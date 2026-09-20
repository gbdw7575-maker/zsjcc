import Feedback from '../models/Feedback.js'

// 创建反馈（登录用户）
export const createFeedback = async (req, res) => {
  try {
    const { type, title, description, priority } = req.body
    const feedback = await Feedback.create({
      type,
      title,
      description,
      priority: priority || 'medium',
      author: req.user._id
    })
    await feedback.populate('author', 'username')
    res.status(201).json({ success: true, data: feedback })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取当前用户的反馈列表
export const getMyFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const feedbacks = await Feedback.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Feedback.countDocuments({ author: req.user._id })

    res.json({
      success: true,
      data: feedbacks,
      pagination: { page: Number(page), limit: Number(limit), total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 管理员获取所有反馈
export const getAllFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query
    const query = {}
    if (status) query.status = status
    if (type) query.type = type

    const feedbacks = await Feedback.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Feedback.countDocuments(query)

    res.json({
      success: true,
      data: feedbacks,
      pagination: { page: Number(page), limit: Number(limit), total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 管理员回复反馈
export const replyToFeedback = async (req, res) => {
  try {
    const { adminReply } = req.body
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { adminReply, status: 'processing' },
      { new: true }
    ).populate('author', 'username email')

    if (!feedback) {
      return res.status(404).json({ success: false, message: '反馈不存在' })
    }

    res.json({ success: true, data: feedback })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 管理员更新反馈状态
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status, adminReply, priority } = req.body
    const updateFields = {}
    if (status) updateFields.status = status
    if (adminReply !== undefined) updateFields.adminReply = adminReply
    if (priority) updateFields.priority = priority

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('author', 'username email')

    if (!feedback) {
      return res.status(404).json({ success: false, message: '反馈不存在' })
    }

    res.json({ success: true, data: feedback })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 管理员删除反馈
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id)
    if (!feedback) {
      return res.status(404).json({ success: false, message: '反馈不存在' })
    }
    res.json({ success: true, message: '反馈已删除' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
