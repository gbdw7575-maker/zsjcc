import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { createRecordRules, handleValidation } from '../middleware/validators.js'
import * as matchRecordController from '../controllers/matchRecordController.js'

const router = Router()

router.use(protect)

router.post('/', createRecordRules, handleValidation, matchRecordController.createRecord)
router.get('/', matchRecordController.getMyRecords)
router.get('/:id', matchRecordController.getRecordDetail)
router.delete('/:id', matchRecordController.deleteRecord)

export default router
