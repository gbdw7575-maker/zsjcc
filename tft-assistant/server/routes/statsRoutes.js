import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import * as statsController from '../controllers/statsController.js'

const router = Router()

// 匿名聚合数据，不含任何用户标识，公开可读
router.get('/overview', statsController.getOverview)

// A5: 个人战绩画像（需登录）
router.get('/profile', protect, statsController.getMyProfile)

export default router
