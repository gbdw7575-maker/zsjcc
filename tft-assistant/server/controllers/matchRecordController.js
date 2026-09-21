import MatchRecord from '../models/MatchRecord.js'
import { syncFromLCU } from '../services/lcuSyncService.js'
import { statsService } from '../services/statsService.js'

/**
 * 从本机金铲铲客户端自动同步最近对局
 * POST /api/records/sync-lcu
 */
export const syncLCU = async (req, res) => {
  try {
    const result = await syncFromLCU(req.user._id)
    statsService.invalidateUser(req.user._id)
    res.json({ success: true, data: result })
  } catch (error) {
    if (error.message === 'LCU_CLIENT_NOT_FOUND') {
      return res.status(503).json({
        success: false,
        message: '未检测到运行中的金铲铲客户端，请先启动客户端并登录'
      })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * A2: OCR 识别 + AI 复盘结果自动入库（upsert）
 * POST /api/records/ocr
 *
 * 前端在 ScreenShare 页 AI 复盘返回后调用，依据 videoId+timestamp 去重：
 *   - 已存在：合并更新 aiAdvice 字段（覆盖最新一次 AI 建议）
 *   - 不存在：新建 source='ocr' 的对局记录，placement 默认 0（未知，待用户后续补录）
 *
 * Body:
 *   videoId     String  屏幕共享会话 ID（前端生成）
 *   timestamp   Number  本次 AI 建议的生成时间戳（ms）
 *   aiAdvice    Object  { text, suggestions[], snapshot{}, provider }
 *   mode?       String  默认 ranked
 *   traits?     String[]
 *   units?       Object[]
 *   placement?  Number  已知最终排名则一并更新
 */
export const upsertOcrRecord = async (req, res) => {
  try {
    const { videoId, timestamp, aiAdvice, mode, traits, units, placement } = req.body || {}

    if (!videoId || !timestamp) {
      return res.status(400).json({
        success: false,
        message: '缺少 videoId 或 timestamp，无法去重'
      })
    }
    if (!aiAdvice || !aiAdvice.text) {
      return res.status(400).json({
        success: false,
        message: '缺少 aiAdvice.text，OCR 入库需要 AI 复盘建议文本'
      })
    }

    const sourceGameId = `${videoId}#${timestamp}`
    const advicePayload = {
      text: String(aiAdvice.text).slice(0, 2000),
      suggestions: Array.isArray(aiAdvice.suggestions)
        ? aiAdvice.suggestions.slice(0, 10).map(s => ({
            title: String(s.title || '').slice(0, 100),
            content: String(s.content || '').slice(0, 500)
          }))
        : [],
      snapshot: aiAdvice.snapshot && typeof aiAdvice.snapshot === 'object'
        ? {
            phase: String(aiAdvice.snapshot.phase || '').slice(0, 50),
            gold: String(aiAdvice.snapshot.gold || '').slice(0, 20),
            health: String(aiAdvice.snapshot.health || '').slice(0, 20),
            level: String(aiAdvice.snapshot.level || '').slice(0, 20),
            teamName: String(aiAdvice.snapshot.teamName || '').slice(0, 100)
          }
        : {},
      provider: String(aiAdvice.provider || '').slice(0, 50),
      generatedAt: new Date()
    }

    // 仅在用户提供有效 placement（1-8）时才更新该字段，避免覆盖已有真实排名
    const placementUpdate = {}
    if (typeof placement === 'number' && placement >= 1 && placement <= 8) {
      placementUpdate.placement = placement
    }

    const filter = { user: req.user._id, sourceGameId }
    const update = {
      $set: {
        source: 'ocr',
        aiAdvice: advicePayload,
        ...placementUpdate
      },
      $setOnInsert: {
        user: req.user._id,
        sourceGameId,
        mode: mode || 'ranked',
        traits: Array.isArray(traits) ? traits : [],
        units: Array.isArray(units) ? units : [],
        placement: typeof placement === 'number' && placement >= 1 && placement <= 8 ? placement : 0,
        playedAt: new Date()
      }
    }

    const opts = { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    const record = await MatchRecord.findOneAndUpdate(filter, update, opts).lean()
    // 失效该用户画像缓存，下次请求重算
    statsService.invalidateUser(req.user._id)

    res.status(201).json({ success: true, data: record })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * 录入一条对局记录
 * POST /api/records
 */
export const createRecord = async (req, res) => {
  try {
    const { placement, mode, traits, units, note, gameDuration, playedAt } = req.body

    if (!placement || placement < 1 || placement > 8) {
      return res.status(400).json({ success: false, message: '排名必须在 1-8 之间' })
    }

    const record = await MatchRecord.create({
      user: req.user._id,
      placement,
      mode: mode || 'ranked',
      traits: traits || [],
      units: units || [],
      note: note || '',
      gameDuration: gameDuration || 0,
      playedAt: playedAt || new Date()
    })
    statsService.invalidateUser(req.user._id)

    res.status(201).json({ success: true, data: record })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * 获取当前用户的战绩列表 + 统计数据
 * GET /api/records?limit=20&page=1
 */
export const getMyRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const skip = (page - 1) * limit

    const [records, total] = await Promise.all([
      MatchRecord.find({ user: req.user._id })
        .sort({ playedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MatchRecord.countDocuments({ user: req.user._id })
    ])

    // 计算统计数据
    const stats = await calcUserStats(req.user._id)

    res.json({
      success: true,
      data: { records, total, page, pages: Math.ceil(total / limit), stats }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * 删除一条战绩
 * DELETE /api/records/:id
 */
export const deleteRecord = async (req, res) => {
  try {
    const record = await MatchRecord.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    })

    if (!record) {
      return res.status(404).json({ success: false, message: '记录不存在' })
    }
    statsService.invalidateUser(req.user._id)

    res.json({ success: true, message: '已删除' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * 获取单条战绩详情
 * GET /api/records/:id
 */
export const getRecordDetail = async (req, res) => {
  try {
    const record = await MatchRecord.findOne({
      _id: req.params.id,
      user: req.user._id
    }).lean()

    if (!record) {
      return res.status(404).json({ success: false, message: '记录不存在' })
    }

    res.json({ success: true, data: record })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * 计算用户统计数据（内部工具函数）
 */
export async function calcUserStats(userId) {
  const records = await MatchRecord.find({ user: userId }).lean()
  if (!records.length) return null

  let wins = 0, top4s = 0, totalPlacement = 0, totalDuration = 0
  const traitUsage = {}
  const championUsage = {}

  records.forEach(r => {
    if (r.placement === 1) wins++
    if (r.placement <= 4) top4s++
    totalPlacement += r.placement
    totalDuration += r.gameDuration || 0

    r.traits?.forEach(t => {
      traitUsage[t] = (traitUsage[t] || 0) + 1
    })
    r.units?.forEach(u => {
      championUsage[u.champion] = (championUsage[u.champion] || 0) + 1
    })
  })

  const n = records.length
  return {
    totalGames: n,
    wins,
    top4s,
    winRate: ((wins / n) * 100).toFixed(1),
    top4Rate: ((top4s / n) * 100).toFixed(1),
    avgPlacement: (totalPlacement / n).toFixed(1),
    avgDuration: Math.round(totalDuration / n),
    topTraits: Object.entries(traitUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    topChampions: Object.entries(championUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }
}
