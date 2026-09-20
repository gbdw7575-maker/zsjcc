import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import * as tftDataController from '../controllers/tftDataController.js'

const router = Router()

// 所有 TFT 数据接口需要登录
router.use(protect)

router.get('/status', tftDataController.checkStatus)
router.get('/summoner', tftDataController.getSummoner)
router.get('/overview', tftDataController.getOverview)
router.get('/matches', tftDataController.getMatches)
router.get('/match/:gameId', tftDataController.getMatchDetail)

export default router
