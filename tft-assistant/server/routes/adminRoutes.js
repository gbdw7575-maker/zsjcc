import express from 'express'
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getStats,
  toggleUserBan,
  getPendingPosts,
  approvePost,
  rejectPost,
  getAllPosts,
  getAllTeams,
  updateTeam,
  deleteTeam,
  clearServerCache
} from '../controllers/adminController.js'
import { admin } from '../middleware/admin.js'

const router = express.Router()

router.use(admin)

router.get('/users', getUsers)
router.get('/stats', getStats)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)
router.post('/users/:id/toggle-ban', toggleUserBan)

// 内容审核
router.get('/posts/pending', getPendingPosts)
router.get('/posts', getAllPosts)
router.post('/posts/:id/approve', approvePost)
router.post('/posts/:id/reject', rejectPost)

// 阵容管理
router.get('/teams', getAllTeams)
router.put('/teams/:id', updateTeam)
router.delete('/teams/:id', deleteTeam)

// 系统维护
router.post('/clear-cache', clearServerCache)

export default router