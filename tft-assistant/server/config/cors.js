/**
 * CORS 统一配置（REST 与 Socket.IO 共用，避免白名单漂移）
 * 生产环境通过 CLIENT_URL 指定（多个用逗号分隔），未设置时回退本地开发端口
 */
import dotenv from 'dotenv'

// ES module import 先于业务代码执行，这里必须自行确保 env 已加载
dotenv.config()

export const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(s => s.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']

/**
 * 供 cors() / Socket.IO 使用的 origin 校验函数
 * 同源请求（curl、服务端到服务端、移动端 webview）允许无 Origin
 */
export const corsOrigin = (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true)
  } else {
    callback(new Error('Not allowed by CORS'))
  }
}
