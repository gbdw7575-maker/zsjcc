import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { corsOrigin } from './config/cors.js'
import { requestLogger } from './middleware/requestLogger.js'
import { notFound } from './middleware/notFound.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import socialRoutes from './routes/socialRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import gameDataRoutes from './routes/gameDataRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import announcementRoutes from './routes/announcementRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import lineupRoutes from './routes/lineupRoutes.js'
import tftDataRoutes from './routes/tftDataRoutes.js'
import matchRecordRoutes from './routes/matchRecordRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import statsRoutes from './routes/statsRoutes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 安全 headers
app.use(helmet())

// CORS：与 Socket.IO 共用统一白名单（CLIENT_URL，多个来源逗号分隔）
app.use(cors({
  origin: corsOrigin,
  credentials: true
}))

// 请求日志（在限流之前，429 也能观测到）
app.use(requestLogger)

// 全局频率限制
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: '请求过于频繁，请稍后再试' }
})
app.use(globalLimiter)

// 登录/注册接口严格频率限制（防暴力破解）
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: '登录尝试过于频繁，请15分钟后再试' }
})
app.use('/api/users/login', authLimiter)
app.use('/api/users/register', authLimiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 静态文件服务 - 上传的图片和视频
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/social', socialRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/game-data', gameDataRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/lineups', lineupRoutes)
app.use('/api/tft', tftDataRoutes)
app.use('/api/records', matchRecordRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/stats', statsRoutes)

// 健康检查：报告数据库连接、运行时长与内存，供运维/答辩演示观测
app.get('/api/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
  const mem = process.memoryUsage()
  res.json({
    success: true,
    message: '服务正常运行',
    data: {
      status: dbState === 'connected' ? 'ok' : 'degraded',
      db: dbState,
      uptime: Math.floor(process.uptime()),
      memory: { rssMB: Math.round(mem.rss / 1048576), heapUsedMB: Math.round(mem.heapUsed / 1048576) },
      node: process.version,
      time: new Date().toISOString()
    }
  })
})

// 404 兜底（路由表之后、错误处理之前）
app.use(notFound)

// 全局错误处理
app.use((err, req, res, next) => {
  // Multer 文件大小超限
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: '文件大小不能超过100MB' })
  }
  // Multer 文件数量超限
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ success: false, message: '最多上传9个文件' })
  }
  // Multer 文件类型错误
  if (err.message && err.message.includes('不支持的文件类型')) {
    return res.status(400).json({ success: false, message: err.message })
  }
  // Mongoose 验证错误 -> 400
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ success: false, message: messages.join(', ') })
  }
  // Mongoose 重复键错误 -> 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ')
    return res.status(409).json({ success: false, message: `${field} 已存在` })
  }
  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'token无效' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'token已过期' })
  }
  // 生产环境不暴露详细错误信息
  const statusCode = err.statusCode || 500
  const message = process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message
  res.status(statusCode).json({
    success: false,
    message: message || '服务器内部错误'
  })
})

export default app
