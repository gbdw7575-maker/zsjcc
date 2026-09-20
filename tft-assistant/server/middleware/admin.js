import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 管理员权限验证
export const admin = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        return res.status(401).json({ success: false, message: '用户不存在' })
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: '需要管理员权限' })
      }

      req.user = user
      next()
    } catch (error) {
      res.status(401).json({ success: false, message: '未授权，token无效' })
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: '未授权，缺少token' })
  }
}

// 检查是否为管理员（不阻塞，只是附加用户信息）
export const checkAdmin = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')
      if (user) {
        req.user = user
        req.isAdmin = user.role === 'admin'
      }
    } catch (error) {
      req.user = null
      req.isAdmin = false
    }
  }
  next()
}