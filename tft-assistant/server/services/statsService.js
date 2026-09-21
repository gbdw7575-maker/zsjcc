// 全服对局统计聚合服务
// 基于 MatchRecord 的匿名聚合：客户端无法替代的"只有后端能做"的能力
// 结果带内存缓存（默认 10 分钟），由调度器或首次请求触发刷新
import MatchRecord from '../models/MatchRecord.js'

const CACHE_TTL_MS = 10 * 60 * 1000
const USER_CACHE_TTL_MS = 2 * 60 * 1000 // 个人画像变化更频繁，缓存短一些
let cache = { data: null, computedAt: 0 }
// 个人画像缓存：userId -> { data, computedAt }
const userCache = new Map()

const round1 = (n) => Math.round(n * 10) / 10

/**
 * 聚合全服对局统计（匿名，不暴露任何用户标识）
 */
async function computeOverview() {
  const [summary] = await MatchRecord.aggregate([
    {
      $facet: {
        // ---- 总览 ----
        overview: [
          {
            $group: {
              _id: null,
              totalGames: { $sum: 1 },
              uniquePlayers: { $addToSet: '$user' },
              avgPlacement: { $avg: '$placement' },
              wins: { $sum: { $cond: [{ $eq: ['$placement', 1] }, 1, 0] } },
              top4: { $sum: { $cond: [{ $lte: ['$placement', 4] }, 1, 0] } }
            }
          },
          {
            $project: {
              _id: 0,
              totalGames: 1,
              uniquePlayers: { $size: '$uniquePlayers' },
              avgPlacement: 1,
              winRate: { $cond: [{ $eq: ['$totalGames', 0] }, 0, { $multiply: [{ $divide: ['$wins', '$totalGames'] }, 100] }] },
              top4Rate: { $cond: [{ $eq: ['$totalGames', 0] }, 0, { $multiply: [{ $divide: ['$top4', '$totalGames'] }, 100] }] }
            }
          }
        ],
        // ---- 名次分布 (1-8) ----
        placementDist: [
          { $group: { _id: '$placement', count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, placement: '$_id', count: 1 } }
        ],
        // ---- 热门羁绊 Top 8 ----
        topTraits: [
          { $match: { traits: { $exists: true, $ne: [] } } },
          { $unwind: '$traits' },
          {
            $group: {
              _id: '$traits',
              games: { $sum: 1 },
              avgPlacement: { $avg: '$placement' },
              top4: { $sum: { $cond: [{ $lte: ['$placement', 4] }, 1, 0] } }
            }
          },
          { $sort: { games: -1 } },
          { $limit: 8 },
          {
            $project: {
              _id: 0,
              name: '$_id',
              games: 1,
              avgPlacement: 1,
              top4Rate: { $multiply: [{ $divide: ['$top4', '$games'] }, 100] }
            }
          }
        ],
        // ---- 热门英雄 Top 8 ----
        topChampions: [
          { $match: { units: { $exists: true, $ne: [] } } },
          { $unwind: '$units' },
          {
            $group: {
              _id: '$units.champion',
              games: { $sum: 1 },
              avgPlacement: { $avg: '$placement' }
            }
          },
          { $sort: { games: -1 } },
          { $limit: 8 },
          { $project: { _id: 0, name: '$_id', games: 1, avgPlacement: 1 } }
        ],
        // ---- 模式分布 ----
        modeBreakdown: [
          { $group: { _id: '$mode', count: { $sum: 1 } } },
          { $project: { _id: 0, mode: '$_id', count: 1 } }
        ],
        // ---- 近 14 天对局趋势 ----
        dailyTrend: [
          { $match: { playedAt: { $gte: new Date(Date.now() - 14 * 24 * 3600 * 1000) } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$playedAt' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: '$_id', count: 1 } }
        ]
      }
    }
  ])

  const ov = summary.overview[0] || { totalGames: 0, uniquePlayers: 0, avgPlacement: 0, winRate: 0, top4Rate: 0 }
  return {
    overview: {
      totalGames: ov.totalGames,
      uniquePlayers: ov.uniquePlayers,
      avgPlacement: round1(ov.avgPlacement || 0),
      winRate: round1(ov.winRate),
      top4Rate: round1(ov.top4Rate)
    },
    placementDist: summary.placementDist,
    topTraits: summary.topTraits.map(t => ({ ...t, avgPlacement: round1(t.avgPlacement), top4Rate: round1(t.top4Rate) })),
    topChampions: summary.topChampions.map(c => ({ ...c, avgPlacement: round1(c.avgPlacement) })),
    modeBreakdown: summary.modeBreakdown,
    dailyTrend: summary.dailyTrend,
    computedAt: new Date().toISOString()
  }
}

/**
 * 取统计结果：缓存有效直接返回，否则现算并写缓存
 */
async function getOverview(force = false) {
  if (!force && cache.data && Date.now() - cache.computedAt < CACHE_TTL_MS) {
    return { ...cache.data, cached: true }
  }
  const data = await computeOverview()
  cache = { data, computedAt: Date.now() }
  return { ...data, cached: false }
}

/**
 * 供调度器调用的主动刷新（预热缓存）
 */
async function refresh() {
  return getOverview(true)
}

/**
 * 战绩写入/删除后调用：作废缓存，下次请求重算
 */
function invalidate() {
  cache = { data: null, computedAt: 0 }
}

/**
 * A5: 个人战绩画像聚合
 * 基于当前用户的 MatchRecord（不限来源，manual/lcu/ocr 都参与）
 * 输出胜率趋势/常用阵容/英雄使用率/段位分布/自动 vs 手动数据占比
 *
 * @param {string} userId
 * @param {boolean} force  传 true 时跳过缓存
 */
async function computeUserProfile(userId) {
  // 一次聚合拿多面：总览 + 名次分布 + 羁绊 Top + 英雄 Top + 来源分布 + 14天日趋势 + 模式分布
  const [summary] = await MatchRecord.aggregate([
    { $match: { user: userId } },
    {
      $facet: {
        overview: [
          {
            $group: {
              _id: null,
              totalGames: { $sum: 1 },
              wins: { $sum: { $cond: [{ $eq: ['$placement', 1] }, 1, 0] } },
              top4: { $sum: { $cond: [{ $lte: ['$placement', 4] }, 1, 0] } },
              avgPlacement: { $avg: '$placement' },
              hasAIAdvice: { $sum: { $cond: [{ $ne: ['$aiAdvice.text', ''] }, 1, 0] } }
            }
          },
          {
            $project: {
              _id: 0,
              totalGames: 1,
              wins: 1,
              top4: 1,
              avgPlacement: 1,
              hasAIAdvice: 1,
              winRate: { $cond: [{ $eq: ['$totalGames', 0] }, 0, { $multiply: [{ $divide: ['$wins', '$totalGames'] }, 100] }] },
              top4Rate: { $cond: [{ $eq: ['$totalGames', 0] }, 0, { $multiply: [{ $divide: ['$top4', '$totalGames'] }, 100] }] }
            }
          }
        ],
        placementDist: [
          { $match: { placement: { $gte: 1 } } },
          { $group: { _id: '$placement', count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, placement: '$_id', count: 1 } }
        ],
        topTraits: [
          { $unwind: '$traits' },
          {
            $group: {
              _id: '$traits',
              games: { $sum: 1 },
              wins: { $sum: { $cond: [{ $eq: ['$placement', 1] }, 1, 0] } },
              top4: { $sum: { $cond: [{ $lte: ['$placement', 4] }, 1, 0] } }
            }
          },
          { $sort: { games: -1 } },
          { $limit: 8 },
          {
            $project: {
              _id: 0,
              name: '$_id',
              games: 1,
              winRate: { $multiply: [{ $divide: ['$wins', '$games'] }, 100] },
              top4Rate: { $multiply: [{ $divide: ['$top4', '$games'] }, 100] }
            }
          }
        ],
        topChampions: [
          { $unwind: '$units' },
          {
            $group: {
              _id: '$units.champion',
              games: { $sum: 1 },
              avgStar: { $avg: '$units.star' }
            }
          },
          { $sort: { games: -1 } },
          { $limit: 8 },
          { $project: { _id: 0, name: '$_id', games: 1, avgStar: { $round: ['$avgStar', 1] } } }
        ],
        sourceBreakdown: [
          { $group: { _id: '$source', count: { $sum: 1 } } },
          { $project: { _id: 0, source: '$_id', count: 1 } }
        ],
        modeBreakdown: [
          { $group: { _id: '$mode', count: { $sum: 1 } } },
          { $project: { _id: 0, mode: '$_id', count: 1 } }
        ],
        dailyTrend: [
          { $match: { playedAt: { $gte: new Date(Date.now() - 14 * 24 * 3600 * 1000) } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$playedAt' } },
              games: { $sum: 1 },
              wins: { $sum: { $cond: [{ $eq: ['$placement', 1] }, 1, 0] } }
            }
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              date: '$_id',
              games: 1,
              wins: 1,
              winRate: { $multiply: [{ $divide: ['$wins', '$games'] }, 100] }
            }
          }
        ],
        recentAIAdvice: [
          { $match: { 'aiAdvice.text': { $ne: '' } } },
          { $sort: { 'aiAdvice.generatedAt': -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              placement: 1,
              playedAt: 1,
              mode: 1,
              adviceText: '$aiAdvice.text',
              adviceSnapshot: '$aiAdvice.snapshot',
              provider: '$aiAdvice.provider',
              generatedAt: '$aiAdvice.generatedAt'
            }
          }
        ]
      }
    }
  ])

  const ov = summary.overview[0] || {
    totalGames: 0, wins: 0, top4: 0, avgPlacement: 0, hasAIAdvice: 0, winRate: 0, top4Rate: 0
  }
  const total = ov.totalGames || 0
  const autoCount = summary.sourceBreakdown
    .filter(s => s.source === 'lcu' || s.source === 'ocr')
    .reduce((sum, s) => sum + s.count, 0)

  return {
    overview: {
      totalGames: total,
      wins: ov.wins,
      top4: ov.top4,
      avgPlacement: round1(ov.avgPlacement || 0),
      hasAIAdvice: ov.hasAIAdvice,
      winRate: round1(ov.winRate),
      top4Rate: round1(ov.top4Rate),
      // 自动数据占比：lcu + ocr / 全部
      autoCoverage: total > 0 ? round1((autoCount / total) * 100) : 0
    },
    placementDist: summary.placementDist,
    topTraits: summary.topTraits.map(t => ({
      ...t,
      winRate: round1(t.winRate),
      top4Rate: round1(t.top4Rate)
    })),
    topChampions: summary.topChampions,
    sourceBreakdown: summary.sourceBreakdown,
    modeBreakdown: summary.modeBreakdown,
    dailyTrend: summary.dailyTrend,
    recentAIAdvice: summary.recentAIAdvice,
    computedAt: new Date().toISOString()
  }
}

async function getUserProfile(userId, force = false) {
  const entry = userCache.get(String(userId))
  if (!force && entry && Date.now() - entry.computedAt < USER_CACHE_TTL_MS) {
    return { ...entry.data, cached: true }
  }
  const data = await computeUserProfile(userId)
  userCache.set(String(userId), { data, computedAt: Date.now() })
  return { ...data, cached: false }
}

/**
 * 单用户缓存失效：写入新战绩或 AI 建议沉淀后调用
 */
function invalidateUser(userId) {
  userCache.delete(String(userId))
}

export const statsService = {
  getOverview,
  refresh,
  invalidate,
  getUserProfile,
  invalidateUser,
  CACHE_TTL_MS,
  USER_CACHE_TTL_MS
}
