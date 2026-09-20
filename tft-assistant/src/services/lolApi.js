/**
 * League / 金铲铲 游戏连接服务
 * 通过后端 LCU 服务获取真实对局数据
 * 
 * 使用方式：
 *   1. 确保已在电脑上启动英雄联盟/金铲铲客户端
 *   2. 后端 lcuService 会自动发现并连接本地客户端
 *   3. 前端通过此模块调用获取真实数据
 * 
 * 限制：
 *   - 仅 PC 端客户端可用（LCU API 协议）
 *   - 手机端金铲铲玩家请使用手动录入战绩功能（/api/records）
 */

import { ref } from 'vue'
import api from './api'

const isConnected = ref(false)
const isLoading = ref(false)
const lastError = ref(null)
const summonerInfo = ref(null)

/**
 * 检查与游戏客户端的连接状态
 */
async function checkConnection() {
  try {
    const { data } = await api.get('/tft/status')
    isConnected.value = data?.data?.connected || false
    if (data?.data?.summoner) {
      summonerInfo.value = data.data.summoner
    }
    return data?.data
  } catch (error) {
    isConnected.value = false
    lastError.value = '无法连接到游戏服务'
    return { connected: false }
  }
}

/**
 * 获取战绩总览（真实 LCU 数据）
 * @param {number} count 拉取最近 N 场对局，默认 20
 */
async function fetchStats(count = 20) {
  if (!isConnected.value) {
    await checkConnection()
  }
  
  isLoading.value = true
  lastError.value = null

  try {
    const { data } = await api.get('/tft/overview', { params: { count } })
    // 后端返回 { summoner, matches, stats }
    return data.data
  } catch (error) {
    lastError.value = error.response?.data?.message || '获取战绩失败，请确保游戏客户端已启动'
    throw error
  } finally {
    isLoading.value = false
  }
}

/**
 * 获取对局历史列表
 * @param {number} count 拉取最近 N 场，默认 20
 */
async function fetchMatchHistory(count = 20) {
  if (!isConnected.value) {
    await checkConnection()
  }

  isLoading.value = true
  lastError.value = null

  try {
    const { data } = await api.get('/tft/matches', { params: { count } })
    return data.data
  } catch (error) {
    lastError.value = error.response?.data?.message || '获取对局历史失败'
    throw error
  } finally {
    isLoading.value = false
  }
}

/**
 * 获取指定对局详情
 * @param {string} gameId 对局 ID
 */
async function fetchMatchDetail(gameId) {
  isLoading.value = true
  lastError.value = null

  try {
    const { data } = await api.get(`/tft/match/${gameId}`)
    return data.data
  } catch (error) {
    lastError.value = error.response?.data?.message || '获取对局详情失败'
    throw error
  } finally {
    isLoading.value = false
  }
}

// ============ 兼容旧版接口导出 ============
export const lolApi = {
  isConnected,
  isLoading,
  lastError,
  summonerInfo,
  checkConnection,
  fetchStats,
  fetchMatchHistory,
  fetchMatchDetail,
  // 向后兼容旧调用方式（matchService.js 使用）
  fetchSummonerData: async (gameUsername, region, subRegion) => {
    // 旧 matchService 调用此方法时传入游戏账号信息
    // 实际数据从 LCU 获取，账号参数用于将来对接其他数据源
    if (!isConnected.value) {
      await checkConnection()
    }
    const overview = await fetchStats(20)
    return {
      matches: overview?.matches || [],
      stats: overview?.stats || {}
    }
  }
}
