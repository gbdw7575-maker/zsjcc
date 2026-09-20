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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
  const allowed = [...allowedImageTypes, ...allowedVideoTypes]
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('不支持的文件类型，仅支持图片(jpg/png/gif/webp)和视频(mp4/webm/ogg)'), false)
  }
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
