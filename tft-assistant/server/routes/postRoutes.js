import express from 'express'
import { getPosts, getPostById, createPost, likePost, favoritePost, createComment, likeComment } from '../controllers/postController.js'
import { protect, optionalAuth } from '../middleware/auth.js'
import { createPostRules, createCommentRules, handleValidation } from '../middleware/validators.js'
import { upload } from '../config/upload.js'

const router = express.Router()

router.get('/', getPosts)
router.get('/:id', optionalAuth, getPostById)
router.post('/', protect, upload.array('files', 9), createPostRules, handleValidation, createPost)
router.post('/:id/like', protect, likePost)
router.post('/:id/favorite', protect, favoritePost)
router.post('/:postId/comments', protect, createCommentRules, handleValidation, createComment)
router.post('/comments/:id/like', protect, likeComment)

export default router
