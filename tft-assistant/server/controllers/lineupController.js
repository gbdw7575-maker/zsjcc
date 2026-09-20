import Lineup from '../models/Lineup.js'

// 获取阵容列表
export const getLineups = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'latest' } = req.query
    const query = { status: 'published' }
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    // 使用聚合管道统一处理排序和分页，避免内存排序
    const pipeline = [
      { $match: query },
      { $addFields: { likeCount: { $size: '$likes' } } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          pipeline: [{ $project: { username: 1, avatar: 1 } }],
          as: 'author'
        }
      },
      { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } }
    ]

    // 排序
    switch (sort) {
      case 'popular':
        pipeline.push({ $sort: { views: -1, createdAt: -1 } })
        break
      case 'likes':
        pipeline.push({ $sort: { likeCount: -1, createdAt: -1 } })
        break
      default:
        pipeline.push({ $sort: { createdAt: -1 } })
    }

    // 分页
    const [result] = await Lineup.aggregate([
      ...pipeline,
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limitNum }],
          total: [{ $count: 'count' }]
        }
      }
    ])

    const lineups = result.data
    const total = result.total[0]?.count || 0

    res.json({
      success: true,
      data: lineups,
      pagination: { page: pageNum, limit: limitNum, total }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取单个阵容详情
export const getLineupById = async (req, res) => {
  try {
    const lineup = await Lineup.findById(req.params.id)
      .populate('author', 'username avatar bio')

    if (!lineup) {
      return res.status(404).json({ success: false, message: '阵容不存在' })
    }

    lineup.views += 1
    await lineup.save()

    res.json({ success: true, data: lineup })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 创建阵容
export const createLineup = async (req, res) => {
  try {
    const { title, description, heroes, positioning, tags } = req.body
    const lineup = await Lineup.create({
      title,
      description,
      heroes: heroes || [],
      positioning: positioning || '',
      tags: tags || [],
      author: req.user._id
    })
    await lineup.populate('author', 'username avatar')
    res.status(201).json({ success: true, data: lineup })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 更新阵容
export const updateLineup = async (req, res) => {
  try {
    const lineup = await Lineup.findById(req.params.id)

    if (!lineup) {
      return res.status(404).json({ success: false, message: '阵容不存在' })
    }

    if (lineup.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: '无权修改此阵容' })
    }

    const { title, description, heroes, positioning, tags } = req.body
    if (title !== undefined) lineup.title = title
    if (description !== undefined) lineup.description = description
    if (heroes !== undefined) lineup.heroes = heroes
    if (positioning !== undefined) lineup.positioning = positioning
    if (tags !== undefined) lineup.tags = tags

    await lineup.save()
    await lineup.populate('author', 'username avatar')
    res.json({ success: true, data: lineup })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 删除阵容
export const deleteLineup = async (req, res) => {
  try {
    const lineup = await Lineup.findById(req.params.id)

    if (!lineup) {
      return res.status(404).json({ success: false, message: '阵容不存在' })
    }

    if (lineup.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: '无权删除此阵容' })
    }

    await Lineup.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: '阵容已删除' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 点赞/取消点赞阵容
export const likeLineup = async (req, res) => {
  try {
    const lineup = await Lineup.findById(req.params.id)
    if (!lineup) {
      return res.status(404).json({ success: false, message: '阵容不存在' })
    }

    const index = lineup.likes.indexOf(req.user._id)
    if (index === -1) {
      lineup.likes.push(req.user._id)
    } else {
      lineup.likes.splice(index, 1)
    }
    await lineup.save()

    res.json({ success: true, data: { likes: lineup.likes, count: lineup.likes.length } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 阵容评论
export const addLineupComment = async (req, res) => {
  try {
    const { content } = req.body
    const lineup = await Lineup.findById(req.params.id)

    if (!lineup) {
      return res.status(404).json({ success: false, message: '阵容不存在' })
    }

    const comment = {
      author: req.user._id,
      content
    }

    lineup.comments.push(comment)
    await lineup.save()
    await lineup.populate('comments.author', 'username avatar')

    const newComment = lineup.comments[lineup.comments.length - 1]
    res.status(201).json({ success: true, data: newComment })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 获取阵容评论
export const getLineupComments = async (req, res) => {
  try {
    const lineup = await Lineup.findById(req.params.id)
      .populate('comments.author', 'username avatar')

    if (!lineup) {
      return res.status(404).json({ success: false, message: '阵容不存在' })
    }

    const comments = lineup.comments.sort((a, b) => b.createdAt - a.createdAt)
    res.json({ success: true, data: comments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
