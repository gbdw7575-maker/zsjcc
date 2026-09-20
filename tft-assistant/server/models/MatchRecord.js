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
  // 记录来源：manual=手动录入，lcu=从本机客户端自动同步
  source: {
    type: String,
    enum: ['manual', 'lcu'],
    default: 'manual'
  },
  // LCU 对局号（source=lcu 时存在），用于去重；手动记录为空
  sourceGameId: {
    type: String,
    default: ''
  },
  // 最终等级（LCU participants.level）
  level: {
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

// 同一用户的同一LCU对局只能落一条（仅对 sourceGameId 非空记录生效）
matchRecordSchema.index(
  { user: 1, sourceGameId: 1 },
  { unique: true, partialFilterExpression: { sourceGameId: { $exists: true, $ne: '' } } }
)

export default mongoose.model('MatchRecord', matchRecordSchema)
