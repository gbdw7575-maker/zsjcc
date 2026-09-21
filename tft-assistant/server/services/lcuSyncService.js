/**
 * LCU 战绩同步服务
 * 自动发现本机金铲铲客户端 → 拉取最近 TFT 对局详情 → 落 MatchRecord
 * 数据只存语言中立标识（去赛季前缀的英文 ID），中文映射由前端展示层完成
 */
import MatchRecord from '../models/MatchRecord.js'
import {
  getCurrentSummoner,
  getTftMatchHistory,
  getTftMatchDetail
} from './lcuService.js'

// LCU 队列号 → 本系统模式
const MODE_MAP = {
  1090: 'ranked',
  1091: 'normal',
  1100: 'hyper_roll',
  1160: 'double'
}

/**
 * 去掉赛季前缀：TFT8_Ashe → Ashe；兼容 TFT8_Character_xxx
 * （注：S18 客户端仍可能沿用 TFT8_ 前缀做技术标识，按原样兼容处理）
 */
function stripSeasonPrefix(raw) {
  if (!raw) return ''
  return String(raw)
    .replace(/^TFT\d+_/, '')
    .replace(/^Character_/, '')
}

/**
 * 将单场 LCU 对局详情转换为 MatchRecord 文档结构
 * @param {object} detail getTftMatchDetail 返回值
 * @param {string} puuid 当前召唤师 puuid（用于在 participants 中定位自己）
 * @param {number} queueId 对局摘要中的队列号
 * @param {number} gameCreation 对局摘要中的创建时间（毫秒）
 */
function convertDetail(detail, puuid, queueId, gameCreation) {
  if (!detail || !Array.isArray(detail.participants)) return null

  // 在 participantIdentities 中按 puuid 找自己的 participantId
  let participantId = 0
  if (Array.isArray(detail.participantIdentities)) {
    const identity = detail.participantIdentities.find(
      i => i.player && i.player.puuid === puuid
    )
    if (identity && typeof identity.participantId === 'number') {
      participantId = identity.participantId
    }
  }

  const p = detail.participants[participantId] || detail.participants[0]
  if (!p || typeof p.placement !== 'number' || p.placement < 1 || p.placement > 8) {
    return null
  }

  const traits = (p.traits || [])
    .filter(t => t && t.trait_current_level > 0)
    .map(t => stripSeasonPrefix(t.name))

  const units = (p.units || [])
    .filter(u => u && (u.character_id || u.name))
    .map(u => ({
      champion: stripSeasonPrefix(u.character_id || u.name),
      star: typeof u.tier === 'number' ? u.tier : 1,
      items: (u.items || []).map(i => String(i))
    }))

  return {
    placement: p.placement,
    mode: MODE_MAP[queueId] || 'normal',
    traits,
    units,
    note: '',
    source: 'lcu',
    level: typeof p.level === 'number' ? p.level : 0,
    // 详情时长单位秒 → 分钟
    gameDuration: detail.gameDuration
      ? Math.round(detail.gameDuration / 60)
      : 0,
    playedAt: gameCreation ? new Date(gameCreation) : new Date()
  }
}

/**
 * 从本机客户端同步最近对局到数据库（已存在的对局自动跳过）
 * @param {string} userId
 * @returns {Promise<{synced:number, total:number, account:string}>}
 */
export async function syncFromLCU(userId) {
  const summoner = await getCurrentSummoner()
  if (!summoner || !summoner.puuid) {
    const err = new Error('LCU_CLIENT_NOT_FOUND')
    throw err
  }

  const games = await getTftMatchHistory(summoner.puuid, 0, 20)
  if (!Array.isArray(games)) {
    return { synced: 0, total: 0, account: summoner.displayName || '' }
  }

  // 已落库的对局号
  const existing = await MatchRecord.find(
    { user: userId, source: 'lcu' },
    'sourceGameId'
  ).lean()
  const existingSet = new Set(existing.map(r => r.sourceGameId))

  const newDocs = []
  for (const g of games) {
    if (!g.gameId) continue
    const gameIdStr = String(g.gameId)
    if (existingSet.has(gameIdStr)) continue

    try {
      const detail = await getTftMatchDetail(g.gameId)
      const doc = convertDetail(
        detail,
        summoner.puuid,
        g.queueId,
        g.gameCreation
      )
      if (doc) {
        doc.sourceGameId = gameIdStr
        doc.user = userId
        newDocs.push(doc)
      }
    } catch {
      // 单场失败不阻断整体同步
    }
  }

  if (newDocs.length) {
    await MatchRecord.insertMany(newDocs, { ordered: false })
  }

  const total = await MatchRecord.countDocuments({ user: userId, source: 'lcu' })

  return {
    synced: newDocs.length,
    total,
    account: summoner.displayName || ''
  }
}
