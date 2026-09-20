import User from '../models/User.js'
import Post from '../models/Post.js'
import Announcement from '../models/Announcement.js'
import Feedback from '../models/Feedback.js'
import GameData from '../models/GameData.js'
import { escapeRegex } from '../utils/escapeRegex.js'
import { cleanupUserData } from '../services/userCleanupService.js'

// 获取用户列表（管理员专用）
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const query = {}
    
    if (search) {
      const keyword = escapeRegex(search)
      query.$or = [
        { username: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ]
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: users,
      pagination: { page: Number(page), limit: Number(limit), total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取单个用户详情
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favorites', 'title createdAt')
    
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' })
    }

    // 获取用户发布的帖子数
    const postCount = await Post.countDocuments({ author: req.params.id })
    
    // 获取用户被点赞数
    const userPosts = await Post.find({ author: req.params.id }).select('likes')
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        postCount,
        totalLikes
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 更新用户（管理员）
export const updateUser = async (req, res) => {
  try {
    const { role, bio, avatar } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, bio, avatar },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' })
    }

    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 删除用户
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' })
    }

    // 不能删除自己
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: '不能删除自己' })
    }

    // 级联清理帖子、评论、私信、关注/拉黑、阵容、战绩、反馈、公告、数组引用及磁盘文件
    const result = await cleanupUserData(req.params.id)

    res.json({ success: true, message: '用户及关联数据已删除', data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取统计数据
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalPosts = await Post.countDocuments()
    const pendingPosts = await Post.countDocuments({ status: 'pending' })
    const totalAnnouncements = await Announcement.countDocuments()
    const activeUsers = await User.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    const todayActive = await User.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    const unprocessedFeedbacks = await Feedback.countDocuments({ status: { $in: ['pending', 'processing'] } })

    // 游戏数据统计
    const totalTeams = await GameData.countDocuments({ type: 'metaTeam', isActive: true })
    const totalEquipments = await GameData.countDocuments({ type: 'equipment', isActive: true })
    const totalSynergies = await GameData.countDocuments({ type: 'synergy', isActive: true })
    const totalHeroes = await GameData.countDocuments({ type: 'hero', isActive: true })

    // 最新注册用户
    const recentUsers = await User.find()
      .select('username avatar createdAt')
      .sort({ createdAt: -1 })
      .limit(5)

    // 最新帖子
    const recentPosts = await Post.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        pendingPosts,
        totalAnnouncements,
        activeUsers,
        todayActive,
        unprocessedFeedbacks,
        totalTeams,
        totalEquipments,
        totalSynergies,
        totalHeroes,
        recentUsers,
        recentPosts
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 封禁/解封用户
export const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' })
    }

    // 不能封禁自己
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: '不能封禁自己' })
    }

    user.isBanned = !user.isBanned
    await user.save()

    res.json({
      success: true,
      data: { isBanned: user.isBanned },
      message: user.isBanned ? '用户已被封禁' : '用户已解封'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取待审核帖子列表
export const getPendingPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const query = { status: 'pending' }

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Post.countDocuments(query)

    res.json({
      success: true,
      data: posts,
      pagination: { page: Number(page), limit: Number(limit), total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取所有阵容数据
export const getAllTeams = async (req, res) => {
  try {
    const { page = 1, limit = 50, version, isActive } = req.query
    // 兼容历史 team 数据
    const query = { type: { $in: ['metaTeam', 'team'] } }
    if (version) query.version = version
    if (isActive !== undefined) query.isActive = isActive === 'true'

    const teams = await GameData.find(query)
      .sort({ isActive: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await GameData.countDocuments(query)

    res.json({
      success: true,
      data: teams,
      pagination: { page: Number(page), limit: Number(limit), total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 更新阵容数据
export const updateTeam = async (req, res) => {
  try {
    const { isActive } = req.body
    const team = await GameData.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    )
    if (!team) {
      return res.status(404).json({ success: false, message: '阵容不存在' })
    }
    res.json({ success: true, data: team })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 删除阵容数据
export const deleteTeam = async (req, res) => {
  try {
    const team = await GameData.findByIdAndDelete(req.params.id)
    if (!team) {
      return res.status(404).json({ success: false, message: '阵容不存在' })
    }
    res.json({ success: true, message: '阵容已删除' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 通过帖子审核
export const approvePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' })
    }

    post.status = 'published'
    await post.save()

    res.json({ success: true, message: '帖子已通过审核' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 拒绝帖子
export const rejectPost = async (req, res) => {
  try {
    const { reason } = req.body
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' })
    }

    post.status = 'rejected'
    post.rejectReason = reason || '不符合社区规范'
    await post.save()

    res.json({ success: true, message: '帖子已拒绝' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取所有帖子（管理员查看所有状态）
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const query = {}
    if (status) query.status = status

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Post.countDocuments(query)

    res.json({
      success: true,
      data: posts,
      pagination: { page: Number(page), limit: Number(limit), total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 清除服务端缓存（清理MongoDB中旧数据）
export const clearServerCache = async (req, res) => {
  try {
    const { type } = req.body
    let message = ''

    if (type === 'rejected_posts') {
      const result = await Post.deleteMany({ status: 'rejected' })
      message = `已清除 ${result.deletedCount} 条被拒绝的帖子`
    } else if (type === 'inactive_data') {
      const result = await GameData.deleteMany({ isActive: false })
      message = `已清除 ${result.deletedCount} 条未激活的游戏数据`
    } else if (type === 'all') {
      const p1 = Post.deleteMany({ status: 'rejected' })
      const p2 = GameData.deleteMany({ isActive: false })
      const [r1, r2] = await Promise.all([p1, p2])
      message = `已清除 ${r1.deletedCount} 条被拒绝帖子、${r2.deletedCount} 条未激活数据`
    } else {
      return res.status(400).json({ success: false, message: '请指定清除类型: rejected_posts / inactive_data / all' })
    }

    res.json({ success: true, message })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}