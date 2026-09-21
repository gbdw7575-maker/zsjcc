import Announcement from '../models/Announcement.js'

// 获取所有公告（公开）
// B6: 支持 ?season=S8 过滤；未传 season 时返回全部（含全赛季通用）
//   传 season 时返回：该赛季公告 + season 字段为空的通用公告
export const getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, season } = req.query
    const filter = { isActive: true }
    if (season) {
      // 命中指定赛季 + 全赛季通用（season 为空字符串/null/undefined 的记录）
      filter.$or = [{ season }, { season: { $in: ['', null] } }]
    }

    const announcements = await Announcement.find(filter)
      .populate('author', 'username')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Announcement.countDocuments(filter)

    res.json({
      success: true,
      data: announcements,
      pagination: { page: Number(page), limit: Number(limit), total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取单条公告
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'username')
    
    if (!announcement) {
      return res.status(404).json({ success: false, message: '公告不存在' })
    }

    // 浏览量原子自增
    await Announcement.updateOne({ _id: announcement._id }, { $inc: { viewCount: 1 } })
    announcement.viewCount += 1

    res.json({ success: true, data: announcement })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 创建公告（需管理员权限）
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, isPinned, season } = req.body
    const announcement = await Announcement.create({
      title,
      content,
      type: type || 'normal',
      isPinned: isPinned || false,
      season: season || '',
      author: req.user._id
    })
    await announcement.populate('author', 'username')
    res.status(201).json({ success: true, data: announcement })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 更新公告
export const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, type, isPinned, isActive, season } = req.body
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, type, isPinned, isActive, season },
      { new: true }
    ).populate('author', 'username')

    if (!announcement) {
      return res.status(404).json({ success: false, message: '公告不存在' })
    }

    res.json({ success: true, data: announcement })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 删除公告
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id)
    if (!announcement) {
      return res.status(404).json({ success: false, message: '公告不存在' })
    }
    res.json({ success: true, message: '公告已删除' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取所有公告（含未激活的，管理员专用）
export const getAllAnnouncementsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const announcements = await Announcement.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Announcement.countDocuments()

    res.json({
      success: true,
      data: announcements,
      pagination: { page: Number(page), limit: Number(limit), total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}