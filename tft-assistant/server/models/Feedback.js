import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'other'],
    required: [true, '反馈类型不能为空']
  },
  title: {
    type: String,
    required: [true, '标题不能为空'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, '描述不能为空'],
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'resolved', 'closed'],
    default: 'pending'
  },
  adminReply: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
})

feedbackSchema.index({ status: 1, createdAt: -1 })
feedbackSchema.index({ author: 1, createdAt: -1 })

const Feedback = mongoose.model('Feedback', feedbackSchema)
export default Feedback
