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
  },
  // B6: 公告所属赛季（null/undefined 表示全赛季通用）
  season: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
})

// B6: 赛季筛选 + 活跃排序联合索引
announcementSchema.index({ isActive: 1, season: 1, createdAt: -1 })

const Announcement = mongoose.model('Announcement', announcementSchema)
export default Announcement