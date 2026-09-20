import { createServer } from 'http'
import { Server } from 'socket.io'
import { exec } from 'child_process'
import app from './app.js'
import connectDB from './config/db.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from './models/User.js'
import { setIo } from './services/socketStore.js'
import { createAndDeliverMessage } from './services/messageService.js'
import { FixedWindowRateLimiter } from './services/messagePolicy.js'
import { corsOrigin } from './config/cors.js'

const PORT = process.env.PORT || 3000
const server = createServer(app)

// 启动流程
const start = async () => {
  // 验证必要的环境变量
  const requiredEnvVars = ['JWT_SECRET']
  const missing = requiredEnvVars.filter(v => !process.env[v])
  if (missing.length > 0) {
    console.error(`❌ 缺少必要的环境变量: ${missing.join(', ')}`)
    console.error('   请检查 server/.env 文件是否正确配置')
    process.exit(1)
  }
  
  // 先连接数据库
  await connectDB()
  
  // 初始化管理员账户
  await initAdmin()
  
  // 启动服务器
  server.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`)
  })
}

// 初始化管理员账户
const initAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' })
    const crypto = await import('crypto')
    
    if (!existingAdmin) {
      const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex')
      await User.create({
        username: 'admin',
        email: 'admin@tft.com',
        password: adminPassword,
        role: 'admin',
        bio: '系统管理员'
      })
      console.log('✅ 管理员账户已自动创建')
      console.log('   用户名: admin')
      console.log(`   密码: ${adminPassword}`)
      if (!process.env.ADMIN_PASSWORD) {
        console.log('   ⚠️  请在 .env 中设置 ADMIN_PASSWORD 后重启')
      }
    } else if (process.env.ADMIN_PASSWORD) {
      existingAdmin.password = process.env.ADMIN_PASSWORD
      await existingAdmin.save()
      console.log('✅ 管理员账户已存在 (密码已同步为 .env 配置)')
    } else {
      console.log('✅ 管理员账户已存在')
    }
  } catch (error) {
    console.error('初始化管理员失败:', error.message)
  }
}

start()

const io = new Server(server, {
  cors: {
    // 与 REST 共用统一白名单，部署时设置 CLIENT_URL 即可
    origin: corsOrigin,
    methods: ['GET', 'POST']
  }
})

// 注册 io 实例供 REST 层投递实时事件
setIo(io)

const onlineUsers = new Map()

// Socket 私信频率限制：每用户每10秒最多10条，定期清理过期计数
const messageRateLimiter = new FixedWindowRateLimiter({ windowMs: 10 * 1000, max: 10 })
setInterval(() => messageRateLimiter.cleanup(), 60 * 1000).unref()

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('未授权'))
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return next(new Error('用户不存在'))
    }
    if (user.isBanned) {
      return next(new Error('账号已被封禁'))
    }
    socket.userId = decoded.id
    next()
  } catch (error) {
    next(new Error('token无效'))
  }
})

io.on('connection', (socket) => {
  console.log(`用户连接: ${socket.userId}`)
  // 加入以自己 userId 命名的房间，保证多标签页/设备都能收到私信
  socket.join(`user:${socket.userId}`)
  onlineUsers.set(socket.userId, socket.id)

  socket.on('send_message', async (data) => {
    try {
      if (!messageRateLimiter.check(socket.userId)) {
        return socket.emit('error', { message: '发送过于频繁，请稍后再试' })
      }
      const { receiverId, content } = data || {}
      // 与 REST 共用统一发送入口：黑名单/互关/首条策略全部生效
      const message = await createAndDeliverMessage(socket.userId, receiverId, content)
      socket.emit('message_sent', message)
    } catch (error) {
      socket.emit('error', { message: error.message })
    }
  })

  socket.on('disconnect', () => {
    console.log(`用户断开: ${socket.userId}`)
    onlineUsers.delete(socket.userId)
  })
})

server.on('error', async (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ 端口 ${PORT} 已被占用`)
    
    exec(`netstat -ano | findstr :${PORT}`, async (error, stdout) => {
      if (!error && stdout) {
        const lines = stdout.trim().split('\n')
        const pids = new Set()
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/)
          const pid = parts[parts.length - 1]
          if (pid && !isNaN(pid)) {
            pids.add(pid)
          }
        })
        
        if (pids.size > 0) {
          console.error(`   占用进程 PID: ${[...pids].join(', ')}`)
          console.error(`   请执行: taskkill /PID <PID> /F 终止进程后重试`)
        } else {
          console.error(`   无法获取占用进程信息，请手动检查端口占用`)
        }
      } else {
        console.error(`   无法获取占用进程信息，请手动检查端口占用`)
      }
      try { await mongoose.connection.close() } catch (e) {}
      process.exit(1)
    })
  } else {
    console.error(`服务器启动失败: ${err.message}`)
    try { await mongoose.connection.close() } catch (e) {}
    process.exit(1)
  }
})
