import mongoose from 'mongoose'

const gameDataSchema = new mongoose.Schema({
  // 历史版本字符串（如 "S8怪兽入侵"），保留兼容；B1 后推荐用 season + patch 替代
  version: {
    type: String,
    required: true
  },
  // B1: 赛季标识（如 'S8' / 'S10'），用于跨赛季筛选与切换
  season: {
    type: String,
    default: '',
    index: true
  },
  // B1: 补丁号（如 '14.18.1'），同赛季内多版本对比用
  patch: {
    type: String,
    default: ''
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

// B1: 赛季 + 类型 + 活跃 复合索引，加速按赛季拉取当前英雄/羁绊/装备
gameDataSchema.index({ season: 1, type: 1, isActive: 1 })

const GameData = mongoose.model('GameData', gameDataSchema)
export default GameData
