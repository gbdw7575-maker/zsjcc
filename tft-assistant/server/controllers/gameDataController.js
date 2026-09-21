import GameData from '../models/GameData.js'

// B2: 支持按 season 筛选当前赛季英雄/羁绊/装备
//   优先级：season > version（兼容旧前端调用）
//   season 未传时按 isActive + createdAt 返回最新数据（兼容现有行为）
export const getGameData = async (req, res) => {
  try {
    const { type, version, season } = req.query
    const query = { isActive: true }

    if (type) query.type = type
    if (version) query.version = version
    if (season) query.season = season

    const data = await GameData.find(query).sort({ createdAt: -1 })
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getGameDataById = async (req, res) => {
  try {
    const data = await GameData.findById(req.params.id)
    if (!data) {
      return res.status(404).json({ success: false, message: '数据不存在' })
    }
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createGameData = async (req, res) => {
  try {
    const { version, type, data, source } = req.body
    const gameData = await GameData.create({
      version,
      type,
      data,
      source,
      isActive: true
    })
    res.status(201).json({ success: true, data: gameData })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateGameData = async (req, res) => {
  try {
    const { version, type, data, source, isActive } = req.body
    const gameData = await GameData.findByIdAndUpdate(
      req.params.id,
      { version, type, data, source, isActive },
      { new: true }
    )
    if (!gameData) {
      return res.status(404).json({ success: false, message: '数据不存在' })
    }
    res.json({ success: true, data: gameData })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteGameData = async (req, res) => {
  try {
    const gameData = await GameData.findByIdAndDelete(req.params.id)
    if (!gameData) {
      return res.status(404).json({ success: false, message: '数据不存在' })
    }
    res.json({ success: true, message: '数据已删除' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getActiveVersion = async (req, res) => {
  try {
    const activeData = await GameData.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(1)

    if (activeData.length === 0) {
      return res.json({ success: true, data: { version: 'S18苍林秘境', season: '', patch: '' } })
    }

    // B1: 同时返回 season 与 patch，前端可据此显示"当前赛季：S10"
    const d = activeData[0]
    res.json({
      success: true,
      data: {
        version: d.version,
        season: d.season || '',
        patch: d.patch || ''
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * B2: 获取所有已存在的赛季列表（管理员后台赛季切换器用）
 *   按出现次数倒序，便于切换器显示常用赛季在前
 */
export const listSeasons = async (req, res) => {
  try {
    const seasons = await GameData.aggregate([
      { $match: { season: { $ne: '' } } },
      { $group: { _id: '$season', count: { $sum: 1 }, latestPatch: { $max: '$patch' }, latestCreatedAt: { $max: '$createdAt' } } },
      { $sort: { latestCreatedAt: -1 } },
      { $project: { _id: 0, season: '$_id', count: 1, latestPatch: 1, latestCreatedAt: 1 } }
    ])
    res.json({ success: true, data: seasons })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * B4: 管理员一键切换当前赛季——把目标 season 之外的数据置 isActive=false
 *   仅影响查询接口可见性，原始数据保留（旧赛季可恢复）
 *   需要 admin 权限（路由层挂 admin 中间件）
 * Body: { season: 'S10' }
 */
export const setActiveSeason = async (req, res) => {
  try {
    const { season } = req.body
    if (!season) {
      return res.status(400).json({ success: false, message: '缺少 season 参数' })
    }
    // 先全部置为非活跃，再把目标赛季置为活跃
    await GameData.updateMany({}, { $set: { isActive: false } })
    const result = await GameData.updateMany(
      { season: { $ne: '', $eq: season } },
      { $set: { isActive: true } }
    )
    res.json({
      success: true,
      data: {
        season,
        activatedCount: result.modifiedCount,
        message: `已切换到赛季 ${season}，激活 ${result.modifiedCount} 条数据`
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const bulkCreateGameData = async (req, res) => {
  try {
    const { version, items } = req.body

    const docs = items.map(item => ({
      version,
      type: item.type,
      data: item.data,
      source: item.source || '',
      isActive: true
    }))

    // insertMany 一次写入，默认按序插入，失败抛出首个错误
    const createdItems = await GameData.insertMany(docs)

    res.status(201).json({ success: true, data: createdItems, count: createdItems.length })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}