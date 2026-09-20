import mongoose from 'mongoose'

const matchRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // 排名 1-8，1 = 吃鸡
  placement: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  // 游戏模式
  mode: {
    type: String,
    default: 'ranked',
    enum: ['ranked', 'normal', 'double', 'hyper_roll']
  },
  // 主要羁绊（数组）
  traits: [{
    type: String,
    trim: true
  }],
  // 核心阵容 [{ champion, star, items }]
  units: [{
    champion: { type: String, required: true },
    star: { type: Number, default: 1, min: 1, max: 3 },
    items: [{ type: String }]
  }],
  // 备注
  note: {
    type: String,
    maxlength: 200,
    default: ''
  },
  // 游戏时长（分钟）
  gameDuration: {
    type: Number,
    default: 0
  },
  // 对局日期（用户手动选择，默认录入时间）
  playedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.model('MatchRecord', matchRecordSchema)
