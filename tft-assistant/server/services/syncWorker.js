/**
 * C1+C2: 后台战绩同步 worker
 *
 * 设计要点：
 * - 每 5 分钟扫描"近 10 分钟内活跃"的用户 → 自动调 lcuSyncService
 * - LCU 失败入内存队列重试（指数退避 30s / 2min / 10min）
 * - 单机单用户场景：LCU client 与 server 同机，syncFromLCU 总是同步当前召唤师的战绩
 *   多用户场景需额外按 puuid 路由（暂未做，TODO 标记在下方）
 * - Socket.IO 推送：同步成功后向前台用户发送 records:synced 事件（C5 钩子，前端可后续接入）
 * - setInterval 用 .unref() 让 Node 退出时不被定时器阻塞
 *
 * 触发来源：
 *   1. 周期扫描（每 5 分钟）
 *   2. 重试队列（每 1 分钟检查 nextAttemptAt 到期的项）
 *   3. 用户登录后的 syncNow（router beforeEach 异步触发，不等结果）
 */
import User from '../models/User.js'
import { syncFromLCU } from './lcuSyncService.js'
import { getIo } from './socketStore.js'

const POLL_INTERVAL_MS = 5 * 60 * 1000          // 5 分钟：周期扫描
const RETRY_TICK_MS = 60 * 1000                  // 1 分钟：重试队列扫描
const ACTIVE_WINDOW_MS = 10 * 60 * 1000          // 10 分钟：用户活跃窗口
const MAX_ATTEMPTS = 3                            // 最大重试次数（含首次失败后的 3 次重试）
const BACKOFF_SCHEDULE_MS = [30 * 1000, 2 * 60 * 1000, 10 * 60 * 1000] // 指数退避表

// 内存重试队列：userId -> { attempts, nextAttemptAt, lastError }
const retryQueue = new Map()

let pollTimer = null
let retryTimer = null
let running = false // 防止并发同步（同一周期内不重复进入）

const log = (msg) => console.log(`[syncWorker] ${msg}`)

/**
 * 通知前台用户战绩已同步（如果在线）
 * C5 钩子位：前端可监听 'records:synced' 显示"已同步 N 场新战绩"
 */
function notifyUser(userId, payload) {
  try {
    const io = getIo()
    if (!io) return
    io.to(`user:${userId}`).emit('records:synced', payload)
  } catch {
    // io 未就绪时静默
  }
}

/**
 * 对单个用户尝试同步一次
 * @returns {Promise<{ok: boolean, synced?: number, error?: string}>}
 */
async function attemptSync(userId) {
  try {
    const result = await syncFromLCU(userId)
    return { ok: true, synced: result?.synced ?? 0, total: result?.total ?? 0, account: result?.account ?? '' }
  } catch (err) {
    return { ok: false, error: err?.message || String(err) }
  }
}

/**
 * 入队失败用户（覆盖式：已有则覆盖以刷新退避计时）
 */
function enqueueRetry(userId, lastError) {
  retryQueue.set(String(userId), {
    attempts: 0,
    nextAttemptAt: Date.now() + BACKOFF_SCHEDULE_MS[0],
    lastError
  })
}

/**
 * 处理重试队列：对 nextAttemptAt 到期的项尝试再同步
 */
async function drainRetryQueue() {
  if (retryQueue.size === 0) return
  const now = Date.now()
  const due = []
  for (const [userId, entry] of retryQueue.entries()) {
    if (entry.nextAttemptAt <= now) due.push({ userId, entry })
  }
  if (due.length === 0) return

  log(`重试队列：${due.length} 项到期，开始处理`)

  for (const { userId, entry } of due) {
    const result = await attemptSync(userId)
    if (result.ok) {
      retryQueue.delete(userId)
      log(`重试成功 user=${userId} synced=${result.synced}`)
      if (result.synced > 0) {
        notifyUser(userId, { synced: result.synced, total: result.total, account: result.account })
      }
    } else {
      entry.attempts += 1
      if (entry.attempts >= MAX_ATTEMPTS) {
        retryQueue.delete(userId)
        log(`重试上限放弃 user=${userId} lastError=${result.error}`)
      } else {
        entry.nextAttemptAt = Date.now() + BACKOFF_SCHEDULE_MS[entry.attempts]
        entry.lastError = result.error
        log(`重试失败 user=${userId} attempts=${entry.attempts} 下次=${new Date(entry.nextAttemptAt).toISOString()}`)
      }
    }
  }
}

/**
 * 周期扫描：找出活跃用户尝试同步
 *   - 成功 → 失败入队
 *   - 同步到新战绩 → 推送 socket 通知
 */
async function pollOnce() {
  if (running) return
  running = true
  try {
    const since = new Date(Date.now() - ACTIVE_WINDOW_MS)
    const activeUsers = await User.find({ lastActiveAt: { $gte: since } })
      .select('_id username lastActiveAt')
      .lean()
    if (activeUsers.length === 0) return

    log(`扫描到 ${activeUsers.length} 个活跃用户，开始同步`)

    // 已在重试队列中的用户跳过本周期扫描（交给重试队列处理）
    const pendingIds = new Set([...retryQueue.keys()])
    const targets = activeUsers.filter(u => !pendingIds.has(String(u._id)))

    for (const u of targets) {
      const result = await attemptSync(u._id)
      if (result.ok) {
        if (result.synced > 0) {
          log(`同步成功 user=${u.username} synced=${result.synced}`)
          notifyUser(String(u._id), { synced: result.synced, total: result.total, account: result.account })
        } else {
          log(`同步成功但无新数据 user=${u.username}`)
        }
      } else {
        // LCU 客户端未开或临时不可用 → 入队重试
        enqueueRetry(String(u._id), result.error)
        log(`入队重试 user=${u.username} reason=${result.error}`)
      }
    }
  } catch (err) {
    log(`周期扫描异常: ${err?.message || err}`)
  } finally {
    running = false
  }
}

/**
 * 立即触发同步（用于用户登录后异步调用，不等结果）
 */
export function syncNow(userId) {
  if (!userId) return
  // 异步执行，失败也不抛出（调用方不关心结果）
  attemptSync(userId).then(result => {
    if (result.ok) {
      if (result.synced > 0) {
        notifyUser(String(userId), { synced: result.synced, total: result.total, account: result.account })
      }
    } else {
      enqueueRetry(String(userId), result.error)
    }
  }).catch(() => { /* 静默 */ })
}

/**
 * 启动后台 worker：周期扫描 + 重试队列
 * 在 server.js 启动数据库连接后调用
 */
export function startSyncWorker() {
  if (pollTimer || retryTimer) {
    log('worker 已启动，跳过重复调用')
    return
  }
  pollTimer = setInterval(pollOnce, POLL_INTERVAL_MS)
  retryTimer = setInterval(drainRetryQueue, RETRY_TICK_MS)
  // unref：定时器不阻止 Node 进程退出
  pollTimer.unref?.()
  retryTimer.unref?.()
  log(`已启动：周期扫描 ${POLL_INTERVAL_MS / 1000}s，重试扫描 ${RETRY_TICK_MS / 1000}s`)
}

/**
 * 停止 worker（用于测试或优雅关闭）
 */
export function stopSyncWorker() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  if (retryTimer) { clearInterval(retryTimer); retryTimer = null }
  retryQueue.clear()
}

// 导出内部状态供测试 / 健康检查查询
export function getWorkerStatus() {
  return {
    running,
    retryQueueSize: retryQueue.size,
    retryEntries: [...retryQueue.entries()].map(([userId, e]) => ({
      userId,
      attempts: e.attempts,
      nextAttemptAt: new Date(e.nextAttemptAt).toISOString(),
      lastError: e.lastError
    }))
  }
}
