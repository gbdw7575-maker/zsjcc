import { body, query, param, validationResult } from 'express-validator'

// 验证结果检查中间件
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg)
    return res.status(400).json({ success: false, message: messages.join('; ') })
  }
  next()
}

// ============ 用户相关 ============

export const registerRules = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 20 }).withMessage('用户名需要2-20个字符')
    .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/).withMessage('用户名只能包含中文、英文、数字和下划线'),
  body('email')
    .trim()
    .isEmail().withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6, max: 50 }).withMessage('密码需要6-50个字符')
]

export const loginRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('请输入用户名'),
  body('password')
    .notEmpty().withMessage('请输入密码')
]

export const updateProfileRules = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('用户名需要3-20个字符')
    .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/).withMessage('用户名只能包含中文、英文、数字和下划线'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('个人简介最多200个字符'),
  body('avatar')
    .optional()
    .isString()
    .isLength({ max: 2000000 }).withMessage('头像数据过大'),
  body('gameId')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('游戏ID最多50个字符'),
  body('region')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('所在地区最多20个字符'),
  body('gender')
    .optional({ values: 'falsy' })
    .isIn(['male', 'female', 'secret']).withMessage('无效的性别选项'),
  body('ageGroup')
    .optional({ values: 'falsy' })
    .isIn(['12-17', '18-24', '25-30', '31-40', '40+']).withMessage('无效的年龄段'),
  body('rank')
    .optional({ values: 'falsy' })
    .isIn(['unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'challenger']).withMessage('无效的段位'),
  body('tags')
    .optional()
    .isArray({ max: 5 }).withMessage('个人标签最多5个'),
  body('targetWinRate')
    .optional({ nullable: true })
    .isInt({ min: 0, max: 100 }).withMessage('目标胜率需为0-100的整数'),
  body('targetTeam')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('目标阵容最多50个字符')
]

export const changePasswordRules = [
  body('oldPassword')
    .notEmpty().withMessage('请输入当前密码'),
  body('newPassword')
    .isLength({ min: 6, max: 50 }).withMessage('新密码需要6-50个字符')
]

// ============ 帖子相关 ============

export const createPostRules = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('标题需要1-100个字符'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 }).withMessage('内容需要1-10000个字符'),
  body('category')
    .optional()
    .trim()
    .isIn(['阵容推荐', '装备攻略', '运营思路', '杂谈', '求助']).withMessage('无效的分类'),
  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('标签最多10个')
]

export const createCommentRules = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 }).withMessage('评论需要1-2000个字符'),
  body('parentComment')
    .optional({ nullable: true })
    .isMongoId().withMessage('无效的父评论ID')
]

// ============ 反馈相关 ============

export const createFeedbackRules = [
  body('type')
    .trim()
    .isIn(['bug', 'feature', 'improvement', 'other']).withMessage('请选择有效的反馈类型'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('标题需要1-100个字符'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 5000 }).withMessage('描述需要1-5000个字符'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('无效的优先级')
]

// ============ 私信相关 ============

export const sendMessageRules = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 }).withMessage('消息需要1-5000个字符')
]

// ============ 战绩相关 ============

export const createRecordRules = [
  body('placement')
    .isInt({ min: 1, max: 8 }).withMessage('排名必须在1-8之间'),
  body('mode')
    .optional()
    .trim()
    .isIn(['ranked', 'normal', 'hyper', 'double']).withMessage('无效的游戏模式'),
  body('traits')
    .optional()
    .isArray({ max: 20 }).withMessage('羁绊最多20个'),
  body('units')
    .optional()
    .isArray({ max: 9 }).withMessage('英雄最多9个'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('备注最多1000个字符'),
  body('gameDuration')
    .optional()
    .isInt({ min: 0 }).withMessage('游戏时长必须为非负整数'),
  body('playedAt')
    .optional()
    .isISO8601().withMessage('无效的游戏时间格式')
]

// ============ 阵容相关 ============

export const createLineupRules = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('标题需要1-50个字符'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('描述最多2000个字符'),
  body('heroes')
    .optional()
    .isArray({ max: 9 }).withMessage('英雄最多9个'),
  body('positioning')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('站位数据过长'),
  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('标签最多10个')
]

// ============ 通用分页校验 ============

export const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('页码必须为正整数'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('每页数量为1-100')
]

// ============ MongoDB ID 校验 ============

export const mongoIdRule = [
  param('id')
    .isMongoId().withMessage('无效的ID格式')
]
