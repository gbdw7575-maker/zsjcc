import express from 'express'
import { protect } from '../middleware/auth.js'
import { chatProxy, getAIStatus } from '../controllers/aiController.js'

const router = express.Router()

// AI 分析需登录，防止密钥配额被匿名消耗
router.get('/status', protect, getAIStatus)
router.post('/chat', protect, chatProxy)

export default router
