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
// C3: 查询后台同步状态（lastSyncAt / synced / total）
router.get('/sync-status', matchRecordController.getSyncStatus)
// C4: 登录后立即触发后台异步同步（fire-and-forget）
router.post('/sync-now', matchRecordController.triggerSync)
router.get('/', matchRecordController.getMyRecords)
router.get('/:id', matchRecordController.getRecordDetail)
router.delete('/:id', matchRecordController.deleteRecord)

export default router
