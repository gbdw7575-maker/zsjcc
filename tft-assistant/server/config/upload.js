import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '..', 'uploads')

// 自动创建 uploads 目录
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// mimetype 白名单：落盘强制扩展名 + 允许的原始扩展名别名
// 不再信任客户端提供的原始扩展名，防止伪造 mimetype 上传 html/可执行文件
const MIME_RULES = {
  'image/jpeg': { forceExt: '.jpg', allowedExt: ['.jpg', '.jpeg'] },
  'image/png': { forceExt: '.png', allowedExt: ['.png'] },
  'image/gif': { forceExt: '.gif', allowedExt: ['.gif'] },
  'image/webp': { forceExt: '.webp', allowedExt: ['.webp'] },
  'video/mp4': { forceExt: '.mp4', allowedExt: ['.mp4'] },
  'video/webm': { forceExt: '.webm', allowedExt: ['.webm'] },
  'video/ogg': { forceExt: '.ogg', allowedExt: ['.ogg', '.ogv'] }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    // 强制使用与 mimetype 匹配的安全扩展名
    const ext = (MIME_RULES[file.mimetype] || {}).forceExt || ''
    cb(null, uniqueSuffix + ext)
  }
})

const fileFilter = (req, file, cb) => {
  const rule = MIME_RULES[file.mimetype]
  if (!rule) {
    return cb(new Error('不支持的文件类型，仅支持图片(jpg/png/gif/webp)和视频(mp4/webm/ogg)'), false)
  }
  // 原始扩展名必须与声明的 mimetype 匹配（无扩展名则放行，落盘时补安全扩展名）
  const origExt = path.extname(file.originalname).toLowerCase()
  if (origExt && !rule.allowedExt.includes(origExt)) {
    return cb(new Error('文件扩展名与文件类型不匹配'), false)
  }
  cb(null, true)
}

// 混合上传：图片 + 视频，最多9个文件，每个最大100MB
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file
    files: 9
  }
})
