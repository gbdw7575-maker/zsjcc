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
    const { bio, avatar, gameId, region } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, avatar, gameId, region },
      { new: true }
    )
    res.json({ success: true, data: user })
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
