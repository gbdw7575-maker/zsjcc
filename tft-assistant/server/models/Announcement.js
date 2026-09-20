import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '标题不能为空'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, '内容不能为空'],
    maxlength: 5000
  },
  type: {
    type: String,
    enum: ['normal', 'important', 'urgent'],
    default: 'normal'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

announcementSchema.index({ isActive: 1, createdAt: -1 })

const Announcement = mongoose.model('Announcement', announcementSchema)
export default Announcement