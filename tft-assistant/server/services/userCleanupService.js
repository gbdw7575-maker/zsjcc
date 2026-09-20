import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

import User from '../models/User.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import Message from '../models/Message.js'
import Follow from '../models/Follow.js'
import Block from '../models/Block.js'
import Lineup from '../models/Lineup.js'
import MatchRecord from '../models/MatchRecord.js'
import Feedback from '../models/Feedback.js'
import Announcement from '../models/Announcement.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '..', 'uploads')

// 将 /uploads/xxx.jpg 形式的URL转为磁盘绝对路径
const urlToDiskPath = (url) => {
  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) return null
  const base = url.replace('/uploads/', '')
  // 防路径穿越：去掉子目录跳转后再拼接
  const safeName = path.basename(base)
  return path.join(uploadDir, safeName)
}

const safeUnlink = async (filePath) => {
  try {
    await fs.unlink(filePath)
    return true
  } catch {
    return false // 文件不存在等错误不影响主流程
  }
}

/**
 * 删除用户并级联清理全部关联数据。
 * 单机 MongoDB（非副本集）不支持事务，采用「先收集 → 清理数据库 → 清理磁盘」有序执行。
 * @param {string|ObjectId} userId
 * @returns {Promise<{deleted: object, filesRemoved: number}>}
 */
export const cleanupUserData = async (userId) => {
  // 1. 收集该用户的全部帖子（用于清理其下评论、他人收藏引用与磁盘文件）
  const userPosts = await Post.find({ author: userId }).select('media')
  const postIds = userPosts.map(p => p._id)

  const mediaUrls = []
  for (const p of userPosts) {
    for (const m of p.media || []) mediaUrls.push(m.url)
  }

  // 头像若是本地 uploads 文件也一并收集（data URI 无磁盘文件）
  const user = await User.findById(userId).select('avatar')
  if (user?.avatar) mediaUrls.push(user.avatar)

  // 2. 数据库清理：各操作相互独立，并行执行
  const results = await Promise.all([
    // 其帖子下的所有评论 + 该用户在别处发表的评论
    Comment.deleteMany({ post: { $in: postIds } }),
    Comment.deleteMany({ author: userId }),
    // 他人评论点赞列表中移除该用户
    Comment.updateMany({ likes: userId }, { $pull: { likes: userId } }),
    // 私信（收/发）
    Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
    // 关注与粉丝
    Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] }),
    // 拉黑与被拉黑
    Block.deleteMany({ $or: [{ blocker: userId }, { blocked: userId }] }),
    // 阵容
    Lineup.deleteMany({ author: userId }),
    // 他人阵容：移除其点赞与其子文档评论
    Lineup.updateMany(
      {},
      { $pull: { likes: userId, comments: { author: userId } } }
    ),
    // 战绩
    MatchRecord.deleteMany({ user: userId }),
    // 反馈
    Feedback.deleteMany({ author: userId }),
    // 公告（同为作者产出内容）
    Announcement.deleteMany({ author: userId }),
    // 帖子本身
    Post.deleteMany({ author: userId }),
    // 其他用户收藏夹中移除被删帖子
    User.updateMany(
      { favorites: { $in: postIds } },
      { $pull: { favorites: { $in: postIds } } }
    )
  ])

  // 3. 最后删除用户本体
  const userDelete = await User.deleteOne({ _id: userId })

  // 4. 清理磁盘上传文件
  let filesRemoved = 0
  for (const url of mediaUrls) {
    const diskPath = urlToDiskPath(url)
    if (diskPath && (await safeUnlink(diskPath))) filesRemoved += 1
  }

  return {
    deleted: {
      comments: (results[0].deletedCount || 0) + (results[1].deletedCount || 0),
      messages: results[3].deletedCount || 0,
      follows: results[4].deletedCount || 0,
      blocks: results[5].deletedCount || 0,
      lineups: results[6].deletedCount || 0,
      matchRecords: results[8].deletedCount || 0,
      feedbacks: results[9].deletedCount || 0,
      announcements: results[10].deletedCount || 0,
      posts: results[11].deletedCount || 0,
      user: userDelete.deletedCount || 0
    },
    filesRemoved
  }
}

export default cleanupUserData
