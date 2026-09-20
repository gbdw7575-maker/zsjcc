import Message from '../models/Message.js'
import { assertCanSend } from './messagePolicy.js'
import { getIo } from './socketStore.js'

// 统一私信发送入口：内容校验 -> 策略校验 -> 入库 -> populate -> Socket 实时投递
// REST(controllers/messageController) 与 Socket.IO(server.js) 必须共用此函数，
// 防止两条路径校验/投递行为不一致
export const createAndDeliverMessage = async (senderId, receiverId, content) => {
  const trimmed = (content || '').trim()
  if (!trimmed) {
    const err = new Error('消息内容不能为空')
    err.statusCode = 400
    throw err
  }

  const { isMutualFollow } = await assertCanSend(senderId, receiverId)

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content: trimmed,
    isMutualFollow,
    firstContactMsg: !isMutualFollow
  })

  await message.populate('sender', 'username avatar')
  await message.populate('receiver', 'username avatar')

  // 实时投递给接收方（接收方所有标签页均加入 user:<id> 房间）
  const io = getIo()
  if (io) {
    io.to(`user:${receiverId.toString()}`).emit('new_message', message)
  }

  return message
}
