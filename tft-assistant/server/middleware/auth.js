import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')
      if (!user) {
        return res.status(401).json({ success: false, message: '用户不存在，token无效' })
      }
      if (user.isBanned) {
        return res.status(403).json({ success: false, message: '账号已被封禁' })
      }
      req.user = user
      return next()
    } catch (error) {
      return res.status(401).json({ success: false, message: '未授权，token无效' })
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: '未授权，缺少token' })
  }
}

export const optionalAuth = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    } catch (error) {
      req.user = null
    }
  } else {
    req.user = null
  }
  next()
}
