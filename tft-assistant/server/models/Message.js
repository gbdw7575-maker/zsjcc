import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, '消息内容不能为空'],
    maxlength: 2000
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isMutualFollow: {
    type: Boolean,
    default: false
  },
  firstContactMsg: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 })

const Message = mongoose.model('Message', messageSchema)
export default Message
