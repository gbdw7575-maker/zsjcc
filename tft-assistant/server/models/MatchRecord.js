import mongoose from 'mongoose'

const matchRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // 排名 1-8，1 = 吃鸡；0 = 未知（source=ocr 时录入 AI 建议但尚未录入最终排名）
  placement: {
    type: Number,
    default: 0,
    min: 0,
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
  // 记录来源：
  //   manual=手动录入
  //   lcu=从本机客户端自动同步
  //   ocr=ScreenShare 页 OCR 识别 + AI 复盘自动入库（A1 新增）
  source: {
    type: String,
    enum: ['manual', 'lcu', 'ocr'],
    default: 'manual'
  },
  // LCU 对局号 或 OCR 帧标识（source=ocr 时存 videoId#timestamp 用于去重）
  sourceGameId: {
    type: String,
    default: ''
  },
  // 最终等级（LCU participants.level）
  level: {
    type: Number,
    default: 0
  },
  // A1 新增：AI 复盘建议文本（ScreenShare OCR + AI 分析后由前端回写）
  // 单条对局保留最近一次 AI 建议，便于 MyRecord 列表回看
  aiAdvice: {
    text: { type: String, default: '', maxlength: 2000 },
    // 结构化建议条目（每条 {title, content}）
    suggestions: [{
      title: { type: String, default: '' },
      content: { type: String, default: '' }
    }],
    // 建议生成的快照字段（便于历史回看时定位当时局面）
    snapshot: {
      phase: { type: String, default: '' },
      gold: { type: String, default: '' },
      health: { type: String, default: '' },
      level: { type: String, default: '' },
      teamName: { type: String, default: '' }
    },
    provider: { type: String, default: '' },
    generatedAt: { type: Date, default: null }
  },
  // 对局日期（用户手动选择，默认录入时间）
  playedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// 同一用户的同一来源对局只能落一条（仅对 sourceGameId 非空记录生效）
// A1 后 source=ocr 也复用此唯一约束：同一 videoId+timestamp 不可重复入库
matchRecordSchema.index(
  { user: 1, sourceGameId: 1 },
  { unique: true, partialFilterExpression: { sourceGameId: { $exists: true, $ne: '' } } }
)

export default mongoose.model('MatchRecord', matchRecordSchema)
