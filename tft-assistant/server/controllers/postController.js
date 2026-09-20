import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import User from '../models/User.js'
import { escapeRegex } from '../utils/escapeRegex.js'

export const getPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query
    const query = { status: 'published' }
    
    if (category) query.category = category
    if (search) {
      const keyword = escapeRegex(search)
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ]
    }

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    // 一次聚合拿到本页帖子的评论计数，避免 N+1 查询
    const postIds = posts.map(p => p._id)
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } }
    ])
    const countMap = new Map(commentCounts.map(c => [c._id.toString(), c.count]))
    posts.forEach(p => {
      p._doc.commentCount = countMap.get(p._id.toString()) || 0
    })

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

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('likes', 'username')

    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' })
    }

    // 非 published 帖仅作者本人或管理员可见，防止直链绕过审核
    if (post.status !== 'published') {
      const isOwner = req.user && post.author._id.toString() === req.user._id.toString()
      const isAdmin = req.user && req.user.role === 'admin'
      if (!isOwner && !isAdmin) {
        return res.status(404).json({ success: false, message: '帖子不存在或未发布' })
      }
    }

    // 浏览量原子自增，避免 read-modify-write 并发丢数
    await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } })
    post.views += 1

    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })

    res.json({ success: true, data: { post, comments } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body
    
    // 处理上传的文件
    const media = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith('video/')
        media.push({
          url: '/uploads/' + file.filename,
          type: isVideo ? 'video' : 'image',
          originalName: file.originalname
        })
      }
    }

    const post = await Post.create({
      title,
      content,
      category,
      tags: tags || [],
      media,
      author: req.user._id
    })
    await post.populate('author', 'username avatar')
    res.status(201).json({ success: true, data: post })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const likePost = async (req, res) => {
  try {
    // 仅取 likes 字段判断当前状态，避免整文档回写
    const post = await Post.findById(req.params.id).select('likes')
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' })
    }

    const liked = post.likes.some(id => id.equals(req.user._id))
    const update = liked
      ? { $pull: { likes: req.user._id } }
      : { $addToSet: { likes: req.user._id } }

    const updated = await Post.findByIdAndUpdate(req.params.id, update, { new: true })
      .select('likes')

    res.json({ success: true, data: updated.likes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const favoritePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('_id')
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' })
    }

    const user = await User.findById(req.user._id).select('favorites')
    const favorited = user.favorites.some(id => id.equals(post._id))

    // 双向收藏关系原子更新，并行执行
    const postUpdate = favorited
      ? { $pull: { favorites: user._id } }
      : { $addToSet: { favorites: user._id } }
    const userUpdate = favorited
      ? { $pull: { favorites: post._id } }
      : { $addToSet: { favorites: post._id } }

    await Promise.all([
      Post.updateOne({ _id: post._id }, postUpdate),
      User.updateOne({ _id: user._id }, userUpdate)
    ])

    const updated = await User.findById(req.user._id).select('favorites')
    res.json({ success: true, data: updated.favorites })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body
    const comment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user._id,
      parentComment: parentComment || null
    })
    await comment.populate('author', 'username avatar')
    res.status(201).json({ success: true, data: comment })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).select('likes')
    if (!comment) {
      return res.status(404).json({ success: false, message: '评论不存在' })
    }

    const liked = comment.likes.some(id => id.equals(req.user._id))
    const update = liked
      ? { $pull: { likes: req.user._id } }
      : { $addToSet: { likes: req.user._id } }

    const updated = await Comment.findByIdAndUpdate(req.params.id, update, { new: true })
      .select('likes')

    res.json({ success: true, data: updated.likes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
