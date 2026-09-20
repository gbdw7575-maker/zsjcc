import express from 'express'
import { getConversations, getMessages, sendMessage, getUnreadCount } from '../controllers/messageController.js'
import { protect } from '../middleware/auth.js'
import { sendMessageRules, handleValidation } from '../middleware/validators.js'

const router = express.Router()

router.get('/conversations', protect, getConversations)
router.get('/unread', protect, getUnreadCount)
router.get('/:userId', protect, getMessages)
router.post('/:userId', protect, sendMessageRules, handleValidation, sendMessage)

export default router
