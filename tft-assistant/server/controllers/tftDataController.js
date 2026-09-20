import * as lcuService from '../services/lcuService.js'

/**
 * 检查客户端连接状态
 * GET /api/tft/status
 */
export const checkStatus = async (req, res) => {
  try {
    const result = await lcuService.checkClientReady()
    res.json({ success: true, data: result })
  } catch (error) {
    res.json({
      success: true,
      data: { connected: false, reason: error.message }
    })
  }
}

/**
 * 获取召唤师信息
 * GET /api/tft/summoner
 */
export const getSummoner = async (req, res) => {
  try {
    const data = await lcuService.getCurrentSummoner()
    res.json({ success: true, data })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * 获取 TFT 数据总览（战绩列表 + 统计）
 * GET /api/tft/overview?count=20
 */
export const getOverview = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 20
    const data = await lcuService.getTftOverview(count)
    res.json({ success: true, data })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * 获取对局详情
 * GET /api/tft/match/:gameId
 */
export const getMatchDetail = async (req, res) => {
  try {
    const { gameId } = req.params
    if (!gameId) {
      return res.status(400).json({ success: false, message: '缺少 gameId 参数' })
    }
    const data = await lcuService.getTftMatchDetail(gameId)
    res.json({ success: true, data })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * 获取对局历史列表
 * GET /api/tft/matches?count=20
 */
export const getMatches = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 20
    const summoner = await lcuService.getCurrentSummoner()
    const games = await lcuService.getTftMatchHistory(summoner.puuid, 0, count)
    res.json({ success: true, data: games })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}
