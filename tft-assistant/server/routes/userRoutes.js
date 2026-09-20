import express from 'express'
import { register, login, getMe, updateProfile, getUserProfile } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import { registerRules, loginRules, updateProfileRules, handleValidation } from '../middleware/validators.js'

const router = express.Router()

router.post('/register', registerRules, handleValidation, register)
router.post('/login', loginRules, handleValidation, login)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfileRules, handleValidation, updateProfile)
router.get('/:id', getUserProfile)

export default router
