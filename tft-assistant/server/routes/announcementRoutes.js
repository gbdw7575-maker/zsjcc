import express from 'express'
import { 
  getAnnouncements, 
  getAnnouncementById, 
  createAnnouncement, 
  updateAnnouncement,
  deleteAnnouncement,
  getAllAnnouncementsAdmin
} from '../controllers/announcementController.js'
import { protect } from '../middleware/auth.js'
import { admin } from '../middleware/admin.js'

const router = express.Router()

// 公开接口
router.get('/', getAnnouncements)
router.get('/:id', getAnnouncementById)

// 管理员接口
router.post('/', protect, admin, createAnnouncement)
router.put('/:id', protect, admin, updateAnnouncement)
router.delete('/:id', protect, admin, deleteAnnouncement)
router.get('/admin/all', protect, admin, getAllAnnouncementsAdmin)

export default router