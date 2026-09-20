import express from 'express'
import {
  getLineups,
  getLineupById,
  createLineup,
  updateLineup,
  deleteLineup,
  likeLineup,
  addLineupComment,
  getLineupComments
} from '../controllers/lineupController.js'
import { protect, optionalAuth } from '../middleware/auth.js'
import { createLineupRules, handleValidation } from '../middleware/validators.js'

const router = express.Router()

router.get('/', getLineups)
router.get('/:id', optionalAuth, getLineupById)
router.post('/', protect, createLineupRules, handleValidation, createLineup)
router.put('/:id', protect, createLineupRules, handleValidation, updateLineup)
router.delete('/:id', protect, deleteLineup)
router.post('/:id/like', protect, likeLineup)
router.post('/:id/comments', protect, addLineupComment)
router.get('/:id/comments', getLineupComments)

export default router
