import mongoose from 'mongoose'
import User from '../models/User.js'
import Block from '../models/Block.js'
import Follow from '../models/Follow.js'
import Message from '../models/Message.js'

// 业务策略错误（携带 HTTP 状态码）
export class MessagePolicyError extends Error {
  constructor(message, statusCode = 403) {
    super(message)
    this.name = 'MessagePolicyError'
    this.statusCode = statusCode
  }
}

// 私信发送策略校验：自身/格式 -> 接收方存在 -> 黑名单(双向) -> 互关 -> 非互关仅可发首条
// REST 与 Socket.IO 共用此函数，返回 { isMutualFollow }，不允许时抛 MessagePolicyError
export const assertCanSend = async (senderId, receiverId) => {
  if (!senderId || !receiverId) {
    throw new MessagePolicyError('参数不完整', 400)
  }
  if (senderId.toString() === receiverId.toString()) {
    throw new MessagePolicyError('不能给自己发送私信', 400)
  }
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new MessagePolicyError('用户ID无效', 400)
  }

  const [blockedByOther, blockedBySender, senderFollows, receiverFollows, receiver] = await Promise.all([
    Block.findOne({ blocker: receiverId, blocked: senderId }),
    Block.findOne({ blocker: senderId, blocked: receiverId }),
    Follow.findOne({ follower: senderId, following: receiverId }),
    Follow.findOne({ follower: receiverId, following: senderId }),
    User.findById(receiverId).select('_id')
  ])

  if (!receiver) {
    throw new MessagePolicyError('对方用户不存在', 404)
  }
  if (blockedByOther) {
    throw new MessagePolicyError('对方已将你拉黑，无法发送私信')
  }
  if (blockedBySender) {
    throw new MessagePolicyError('你已拉黑该用户，无法发送私信')
  }

  const isMutualFollow = !!(senderFollows && receiverFollows)

  if (!isMutualFollow) {
    const existing = await Message.findOne({ sender: senderId, receiver: receiverId })
    if (existing) {
      throw new MessagePolicyError('只有互相关注后才能继续发送私信')
    }
  }

  return { isMutualFollow }
}

// 简单固定窗口频率限制器（单进程内存版，足够本地工具使用）
export class FixedWindowRateLimiter {
  constructor({ windowMs, max }) {
    this.windowMs = windowMs
    this.max = max
    this.hits = new Map()
  }

  check(key) {
    const now = Date.now()
    const rec = this.hits.get(key)
    if (!rec || now - rec.start >= this.windowMs) {
      this.hits.set(key, { start: now, count: 1 })
      return true
    }
    if (rec.count >= this.max) {
      return false
    }
    rec.count += 1
    return true
  }

  // 清理过期键，避免内存泄漏
  cleanup() {
    const now = Date.now()
    for (const [key, rec] of this.hits) {
      if (now - rec.start >= this.windowMs) {
        this.hits.delete(key)
      }
    }
  }
}
