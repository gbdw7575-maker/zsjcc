import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

export const register = async (req, res) => {
  try {
    const { username, email, password, type } = req.body

    const userExists = await User.findOne({ $or: [{ email }, { username }] })
    if (userExists) {
      return res.status(400).json({ success: false, message: '用户已存在' })
    }

    const user = await User.create({ username, email, password, type: type || 'player' })

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        type: user.type,
        token: generateToken(user._id)
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' })
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: '账号已被封禁，请联系管理员' })
    }

    // C1 syncWorker 用：登录瞬间更新活跃时间，便于后台判断是否值得拉取本机战绩
    user.lastActiveAt = new Date()
    await user.save()

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        type: user.type,
        token: generateToken(user._id)
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title author createdAt')
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    // 白名单字段，防止越权修改 role/type 等敏感字段
    const allowedFields = [
      'username', 'bio', 'avatar', 'gameId', 'region',
      'gender', 'ageGroup', 'rank', 'tags',
      'targetRank', 'targetWinRate', 'targetTeam'
    ]
    const updates = {}
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key]
      }
    }

    // 修改用户名需检查唯一性
    if (updates.username !== undefined) {
      if (updates.username === req.user.username) {
        delete updates.username
      } else {
        const dup = await User.findOne({ username: updates.username })
        if (dup) {
          return res.status(400).json({ success: false, message: '用户名已被占用' })
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    )
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')

    const isMatch = await user.matchPassword(oldPassword)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: '当前密码错误' })
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({ success: false, message: '新密码不能与当前密码相同' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: '密码修改成功' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email')
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' })
    }
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
