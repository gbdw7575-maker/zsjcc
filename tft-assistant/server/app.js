import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
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

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 安全 headers
app.use(helmet())

// CORS - 允许本地开发端口
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

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

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '服务正常运行' })
})

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
