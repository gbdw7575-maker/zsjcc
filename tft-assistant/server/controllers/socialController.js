import Follow from '../models/Follow.js'
import User from '../models/User.js'
import Block from '../models/Block.js'
import { escapeRegex } from '../utils/escapeRegex.js'

export const followUser = async (req, res) => {
  try {
    const { userId } = req.body
    const followerId = req.user._id

    if (followerId.toString() === userId) {
      return res.status(400).json({ success: false, message: '不能关注自己' })
    }

    const existing = await Follow.findOne({ follower: followerId, following: userId })
    if (existing) {
      await Follow.deleteOne({ _id: existing._id })
      return res.json({ success: true, data: { isFollowing: false } })
    }

    await Follow.create({ follower: followerId, following: userId })
    res.json({ success: true, data: { isFollowing: true } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate('follower', 'username avatar bio')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: followers.map(f => f.follower) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getFollowing = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId })
      .populate('following', 'username avatar bio')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: following.map(f => f.following) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const checkFollowStatus = async (req, res) => {
  try {
    const follow = await Follow.findOne({
      follower: req.user._id,
      following: req.params.userId
    })
    res.json({ success: true, data: { isFollowing: !!follow } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query
    if (!q || !q.trim()) {
      return res.json({ success: true, data: [] })
    }
    const users = await User.find({
      username: { $regex: escapeRegex(q), $options: 'i' }
    }).select('username avatar bio').limit(10)
    res.json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const blockUser = async (req, res) => {
  try {
    const blockerId = req.user._id
    const blockedId = req.params.userId

    if (blockerId.toString() === blockedId) {
      return res.status(400).json({ success: false, message: '不能拉黑自己' })
    }

    // 检查是否已拉黑
    const existing = await Block.findOne({ blocker: blockerId, blocked: blockedId })
    if (existing) {
      return res.status(400).json({ success: false, message: '已拉黑该用户' })
    }

    // 创建拉黑记录
    await Block.create({ blocker: blockerId, blocked: blockedId })

    // 拉黑后自动取消互关
    await Follow.deleteOne({ follower: blockerId, following: blockedId })
    await Follow.deleteOne({ follower: blockedId, following: blockerId })

    res.json({ success: true, message: '已拉黑该用户' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const unblockUser = async (req, res) => {
  try {
    const blockerId = req.user._id
    const blockedId = req.params.userId

    const result = await Block.deleteOne({ blocker: blockerId, blocked: blockedId })
    if (result.deletedCount === 0) {
      return res.status(400).json({ success: false, message: '未拉黑该用户' })
    }

    res.json({ success: true, message: '已取消拉黑' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getBlocklist = async (req, res) => {
  try {
    const blocks = await Block.find({ blocker: req.user._id })
      .populate('blocked', 'username avatar bio')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: blocks.map(b => b.blocked) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
