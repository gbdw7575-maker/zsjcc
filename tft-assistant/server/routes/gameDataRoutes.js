import express from 'express'
import { 
  getGameData, 
  getGameDataById, 
  createGameData, 
  updateGameData, 
  deleteGameData,
  getActiveVersion,
  bulkCreateGameData
} from '../controllers/gameDataController.js'
import { protect } from '../middleware/auth.js'
import { admin } from '../middleware/admin.js'

const router = express.Router()

// 公开接口
router.get('/', getGameData)
router.get('/active-version', getActiveVersion)
router.get('/:id', getGameDataById)

// 管理接口（需要管理员权限）
router.post('/', protect, admin, createGameData)
router.post('/bulk', protect, admin, bulkCreateGameData)
router.put('/:id', protect, admin, updateGameData)
router.delete('/:id', protect, admin, deleteGameData)

export default router