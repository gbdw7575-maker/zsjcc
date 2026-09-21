import express from 'express'
import {
  getGameData,
  getGameDataById,
  createGameData,
  updateGameData,
  deleteGameData,
  getActiveVersion,
  bulkCreateGameData,
  listSeasons,
  setActiveSeason
} from '../controllers/gameDataController.js'
import { protect } from '../middleware/auth.js'
import { admin } from '../middleware/admin.js'

const router = express.Router()

// 公开接口
router.get('/', getGameData)
router.get('/active-version', getActiveVersion)
// B2: 赛季列表（公开，管理员后台赛季切换器用）
router.get('/seasons', listSeasons)
router.get('/:id', getGameDataById)

// 管理接口（需要管理员权限）
router.post('/', protect, admin, createGameData)
router.post('/bulk', protect, admin, bulkCreateGameData)
// B4: 一键切换当前赛季
router.post('/active-season', protect, admin, setActiveSeason)
router.put('/:id', protect, admin, updateGameData)
router.delete('/:id', protect, admin, deleteGameData)

export default router