import mongoose from 'mongoose'

const gameDataSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['team', 'equipment', 'synergy', 'hero'],
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
