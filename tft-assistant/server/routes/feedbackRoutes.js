import express from 'express'
import {
  createFeedback,
  getMyFeedbacks,
  getAllFeedbacks,
  replyToFeedback,
  updateFeedbackStatus,
  deleteFeedback
} from '../controllers/feedbackController.js'
import { protect } from '../middleware/auth.js'
import { admin } from '../middleware/admin.js'
import { createFeedbackRules, handleValidation } from '../middleware/validators.js'

const router = express.Router()

// 所有路由都需要登录
router.use(protect)

// 用户接口
router.post('/', createFeedbackRules, handleValidation, createFeedback)
router.get('/my', getMyFeedbacks)

// 管理员接口
router.get('/all', admin, getAllFeedbacks)
router.put('/:id/reply', admin, replyToFeedback)
router.put('/:id/status', admin, updateFeedbackStatus)
router.delete('/:id', admin, deleteFeedback)

export default router
