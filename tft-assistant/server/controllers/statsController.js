// 全服统计控制器：薄 HTTP 适配层，逻辑在 services/statsService.js
import { statsService } from '../services/statsService.js'

// GET /api/stats/overview — 公开接口，返回匿名聚合数据
export const getOverview = async (req, res, next) => {
  try {
    const force = req.query.refresh === '1' && req.user?.role === 'admin'
    const data = await statsService.getOverview(force)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

// A5: GET /api/stats/profile — 当前登录用户的个人战绩画像
//   需登录；force=1 且管理员时绕过缓存
export const getMyProfile = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: '未登录' })
    }
    const force = req.query.refresh === '1'
    const data = await statsService.getUserProfile(String(req.user._id), force)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
