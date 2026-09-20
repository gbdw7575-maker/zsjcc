import Message from '../models/Message.js'
import User from '../models/User.js'
import Follow from '../models/Follow.js'
import Block from '../models/Block.js'

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
    const { userId } = req.params
    const { content } = req.body
    const senderId = req.user._id
    const receiverId = userId

    // 1. 检查是否被对方拉黑
    const isBlocked = await Block.findOne({
      blocker: receiverId,
      blocked: senderId
    })
    if (isBlocked) {
      return res.status(403).json({ success: false, message: '对方已将你拉黑，无法发送私信' })
    }

    // 也检查发送者是否拉黑了对方
    const hasBlocked = await Block.findOne({
      blocker: senderId,
      blocked: receiverId
    })
    if (hasBlocked) {
      return res.status(403).json({ success: false, message: '你已拉黑该用户，无法发送私信' })
    }

    // 2. 检查是否互相关注
    const senderFollowsReceiver = await Follow.findOne({
      follower: senderId,
      following: receiverId
    })
    const receiverFollowsSender = await Follow.findOne({
      follower: receiverId,
      following: senderId
    })

    const isMutualFollow = !!(senderFollowsReceiver && receiverFollowsSender)

    // 3. 非互关：检查是否已发过消息
    if (!isMutualFollow) {
      const existingMessage = await Message.findOne({
        sender: senderId,
        receiver: receiverId
      })
      if (existingMessage) {
        return res.status(403).json({
          success: false,
          message: '只有互相关注后才能继续发送私信'
        })
      }
    }

    // 4. 创建消息
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      isMutualFollow,
      firstContactMsg: !isMutualFollow
    })

    await message.populate('sender', 'username avatar')
    await message.populate('receiver', 'username avatar')

    res.status(201).json({ success: true, data: message })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
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
