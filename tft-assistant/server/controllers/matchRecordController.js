import MatchRecord from '../models/MatchRecord.js'
import { syncFromLCU } from '../services/lcuSyncService.js'

/**
 * 从本机英雄联盟客户端自动同步最近对局
 * POST /api/records/sync-lcu
 */
export const syncLCU = async (req, res) => {
  try {
    const result = await syncFromLCU(req.user._id)
    res.json({ success: true, data: result })
  } catch (error) {
    if (error.message === 'LCU_CLIENT_NOT_FOUND') {
      return res.status(503).json({
        success: false,
        message: '未检测到运行中的英雄联盟客户端，请先启动客户端并登录'
      })
    }
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
