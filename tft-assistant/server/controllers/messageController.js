import Message from '../models/Message.js'
import User from '../models/User.js'
import { createAndDeliverMessage } from '../services/messageService.js'

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id
    
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 })

    const conversations = {}
    messages.forEach(msg => {
      const otherId = msg.sender.toString() === userId.toString() ? msg.receiver.toString() : msg.sender.toString()
      if (!conversations[otherId]) {
        conversations[otherId] = {
          userId: otherId,
          lastMessage: msg,
          unreadCount: 0
        }
      }
      if (msg.receiver.toString() === userId.toString() && !msg.isRead) {
        conversations[otherId].unreadCount++
      }
    })

    const result = await Promise.all(
      Object.values(conversations).map(async (conv) => {
        const user = await User.findById(conv.userId).select('username avatar')
        return { ...conv, user }
      })
    )

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user._id

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 })

    await Message.updateMany(
      { sender: userId, receiver: currentUserId, isRead: false },
      { isRead: true }
    )

    res.json({ success: true, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const message = await createAndDeliverMessage(
      req.user._id,
      req.params.userId,
      req.body.content
    )
    res.status(201).json({ success: true, data: message })
  } catch (error) {
    const statusCode = error.statusCode || 500
    res.status(statusCode).json({ success: false, message: error.message })
  }
}

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    })
    res.json({ success: true, data: { unreadCount: count } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
