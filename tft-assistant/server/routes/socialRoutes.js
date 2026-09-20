import express from 'express'
import { followUser, getFollowers, getFollowing, checkFollowStatus, searchUsers, blockUser, unblockUser, getBlocklist } from '../controllers/socialController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/follow', protect, followUser)
router.get('/followers/:userId', getFollowers)
router.get('/following/:userId', getFollowing)
router.get('/check/:userId', protect, checkFollowStatus)
router.get('/search', searchUsers)
router.post('/block/:userId', protect, blockUser)
router.post('/unblock/:userId', protect, unblockUser)
router.get('/blocklist', protect, getBlocklist)

export default router
