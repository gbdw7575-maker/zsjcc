import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '标题不能为空'],
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: [true, '内容不能为空'],
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['阵容推荐', '装备攻略', '运营思路', '杂谈', '求助'],
    default: '杂谈'
  },
  tags: [{
    type: String,
    trim: true
  }],
  media: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    originalName: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected', 'draft', 'deleted'],
    default: 'published'
  },
  rejectReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

postSchema.index({ createdAt: -1 })
postSchema.index({ category: 1, createdAt: -1 })

const Post = mongoose.model('Post', postSchema)
export default Post
