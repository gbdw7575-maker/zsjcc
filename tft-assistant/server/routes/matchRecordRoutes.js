import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { createRecordRules, handleValidation } from '../middleware/validators.js'
import * as matchRecordController from '../controllers/matchRecordController.js'

const router = Router()

router.use(protect)

router.post('/', createRecordRules, handleValidation, matchRecordController.createRecord)
router.post('/sync-lcu', matchRecordController.syncLCU)
// A2: ScreenShare OCR + AI 复盘自动入库（upsert）
router.post('/ocr', matchRecordController.upsertOcrRecord)
router.get('/', matchRecordController.getMyRecords)
router.get('/:id', matchRecordController.getRecordDetail)
router.delete('/:id', matchRecordController.deleteRecord)

export default router
