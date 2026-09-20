import mongoose from 'mongoose'

const gameDataSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true
  },
  type: {
    type: String,
    // 统一类型字典：metaTeam=阵容推荐，augment=海克斯，pool=卡池
    // 注：历史数据中的 team 在前端按 metaTeam 兼容处理
    enum: ['metaTeam', 'equipment', 'synergy', 'hero', 'augment', 'pool'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  source: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const GameData = mongoose.model('GameData', gameDataSchema)
export default GameData
