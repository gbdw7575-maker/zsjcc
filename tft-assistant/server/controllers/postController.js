import Post from '../models/Post.js'
import Comment from '../models/Comment.js'

export const getPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query
    const query = { status: 'published' }
    
    if (category) query.category = category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .sort({ isPinned: -1, createdAt: -1 })
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

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('likes', 'username')

    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' })
    }

    post.views += 1
    await post.save()

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
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' })
    }

    const index = post.likes.indexOf(req.user._id)
    if (index === -1) {
      post.likes.push(req.user._id)
    } else {
      post.likes.splice(index, 1)
    }
    await post.save()

    res.json({ success: true, data: post.likes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const favoritePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const user = req.user

    const postIndex = post.favorites.indexOf(user._id)
    const userIndex = user.favorites.indexOf(post._id)

    if (postIndex === -1) {
      post.favorites.push(user._id)
      user.favorites.push(post._id)
    } else {
      post.favorites.splice(postIndex, 1)
      user.favorites.splice(userIndex, 1)
    }

    await post.save()
    await user.save()

    res.json({ success: true, data: user.favorites })
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
    const comment = await Comment.findById(req.params.id)
    const index = comment.likes.indexOf(req.user._id)
    if (index === -1) {
      comment.likes.push(req.user._id)
    } else {
      comment.likes.splice(index, 1)
    }
    await comment.save()
    res.json({ success: true, data: comment.likes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
