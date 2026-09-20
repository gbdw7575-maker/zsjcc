import mongoose from 'mongoose'

const lineupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '阵容标题不能为空'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, '阵容描述不能为空'],
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  heroes: [{
    heroId: {
      type: String,
      required: true
    },
    heroName: {
      type: String,
      default: ''
    },
    star: {
      type: Number,
      default: 1,
      min: 1,
      max: 5
    },
    items: [{
      type: String,
      trim: true
    }]
  }],
  positioning: {
    type: String,
    default: '',
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  }
}, {
  timestamps: true
})

lineupSchema.index({ createdAt: -1 })
lineupSchema.index({ 'likes.length': -1 })

const Lineup = mongoose.model('Lineup', lineupSchema)
export default Lineup
