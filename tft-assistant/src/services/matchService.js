import { ref } from 'vue'
import { lolApi } from './lolApi'

const matchHistory = ref([])

const stats = ref({
  totalGames: 0,
  wins: 0,
  top4: 0,
  avgPlacement: 0,
  winRate: 0,
  top4Rate: 0,
  avgDuration: 0,
  avgLevel: 0,
  currentTier: '',
  currentRank: '',
  lp: 0
})

const isAccountBound = ref(false)
const isSyncing = ref(false)
const gameAccountInfo = ref({
  gameUsername: '',
  region: '',
  subRegion: ''
})

const loadMatchData = (userId) => {
  if (!userId) {
    matchHistory.value = []
    stats.value = {
      totalGames: 0,
      wins: 0,
      top4: 0,
      avgPlacement: 0,
      winRate: 0,
      top4Rate: 0,
      avgDuration: 0,
      avgLevel: 0,
      currentTier: '',
      currentRank: '',
      lp: 0
    }
    isAccountBound.value = false
    gameAccountInfo.value = { gameUsername: '', region: '', subRegion: '' }
    return
  }

  const userData = JSON.parse(localStorage.getItem('matchData_' + userId) || '{}')

  if (userData.bound) {
    gameAccountInfo.value = {
      gameUsername: userData.gameUsername || '',
      region: userData.region || '',
      subRegion: userData.subRegion || ''
    }

    if (userData.matches && userData.matches.length > 0) {
      matchHistory.value = userData.matches
      stats.value = userData.stats || {
        totalGames: userData.matches.length,
        wins: userData.matches.filter(m => m.placement === 1).length,
        top4: userData.matches.filter(m => m.placement <= 4).length,
        avgPlacement: Math.round(userData.matches.reduce((sum, m) => sum + m.placement, 0) / userData.matches.length * 10) / 10,
        winRate: Math.round(userData.matches.filter(m => m.placement === 1).length / userData.matches.length * 100 * 10) / 10,
        top4Rate: Math.round(userData.matches.filter(m => m.placement <= 4).length / userData.matches.length * 100 * 10) / 10,
        avgDuration: Math.round(userData.matches.reduce((sum, m) => sum + m.gameDuration, 0) / userData.matches.length),
        avgLevel: Math.round(userData.matches.reduce((sum, m) => sum + m.level, 0) / userData.matches.length * 10) / 10,
        currentTier: '',
        currentRank: '',
        lp: 0
      }
    } else {
      matchHistory.value = []
      stats.value = {
        totalGames: 0,
        wins: 0,
        top4: 0,
        avgPlacement: 0,
        winRate: 0,
        top4Rate: 0,
        avgDuration: 0,
        avgLevel: 0,
        currentTier: '',
        currentRank: '',
        lp: 0
      }
    }
    isAccountBound.value = true
  } else {
    matchHistory.value = []
    stats.value = {
      totalGames: 0,
      wins: 0,
      top4: 0,
      avgPlacement: 0,
      winRate: 0,
      top4Rate: 0,
      avgDuration: 0,
      avgLevel: 0,
      currentTier: '',
      currentRank: '',
      lp: 0
    }
    isAccountBound.value = false
    gameAccountInfo.value = { gameUsername: '', region: '', subRegion: '' }
  }
}

const bindGameAccount = (userId, gameUsername, region, subRegion) => {
  const userData = {
    bound: true,
    gameUsername: gameUsername,
    region: region,
    subRegion: subRegion,
    matches: [],
    stats: {
      totalGames: 0,
      wins: 0,
      top4: 0,
      avgPlacement: 0,
      winRate: 0,
      top4Rate: 0,
      avgDuration: 0,
      avgLevel: 0,
      currentTier: '',
      currentRank: '',
      lp: 0
    }
  }
  localStorage.setItem('matchData_' + userId, JSON.stringify(userData))
  gameAccountInfo.value = { gameUsername, region, subRegion }
  isAccountBound.value = true
  return { success: true, message: '账号绑定成功' }
}

const syncMatchData = async (userId) => {
  if (!isAccountBound.value || !gameAccountInfo.value.gameUsername) {
    return { success: false, message: '请先绑定游戏账号' }
  }

  isSyncing.value = true

  try {
    const data = await lolApi.fetchSummonerData(
      gameAccountInfo.value.gameUsername,
      gameAccountInfo.value.region,
      gameAccountInfo.value.subRegion
    )

    if (data && data.matches && data.stats) {
      const userData = JSON.parse(localStorage.getItem('matchData_' + userId) || '{}')
      userData.matches = data.matches
      userData.stats = data.stats
      localStorage.setItem('matchData_' + userId, JSON.stringify(userData))

      matchHistory.value = data.matches
      stats.value = data.stats

      return { success: true, message: '数据同步成功', data: data }
    } else {
      return { success: false, message: '获取数据失败' }
    }
  } catch (error) {
    return { success: false, message: error.message || '同步失败' }
  } finally {
    isSyncing.value = false
  }
}

const addMatchRecord = (userId, matchData) => {
  const userData = JSON.parse(localStorage.getItem('matchData_' + userId) || '{}')
  if (!userData.bound) return { success: false, message: '请先绑定游戏账号' }

  userData.matches = userData.matches || []
  userData.matches.unshift({
    id: Date.now(),
    ...matchData,
    time: new Date().toLocaleString()
  })

  if (userData.matches.length > 50) {
    userData.matches = userData.matches.slice(0, 50)
  }

  userData.stats = {
    totalGames: userData.matches.length,
    wins: userData.matches.filter(m => m.placement === 1).length,
    top4: userData.matches.filter(m => m.placement <= 4).length,
    avgPlacement: Math.round(userData.matches.reduce((sum, m) => sum + m.placement, 0) / userData.matches.length * 10) / 10,
    winRate: Math.round(userData.matches.filter(m => m.placement === 1).length / userData.matches.length * 100 * 10) / 10,
    top4Rate: Math.round(userData.matches.filter(m => m.placement <= 4).length / userData.matches.length * 100 * 10) / 10,
    avgDuration: Math.round(userData.matches.reduce((sum, m) => sum + m.gameDuration, 0) / userData.matches.length),
    avgLevel: Math.round(userData.matches.reduce((sum, m) => sum + m.level, 0) / userData.matches.length * 10) / 10,
    currentTier: userData.stats?.currentTier || '',
    currentRank: userData.stats?.currentRank || '',
    lp: userData.stats?.lp || 0
  }

  localStorage.setItem('matchData_' + userId, JSON.stringify(userData))
  loadMatchData(userId)

  return { success: true, message: '对局记录已添加' }
}

const fetchStats = (userId) => {
  loadMatchData(userId)

  if (!isAccountBound.value) {
    return null
  }

  return {
    matchHistory: matchHistory.value,
    stats: stats.value,
    gameAccount: gameAccountInfo.value
  }
}

const clearMatchData = (userId) => {
  localStorage.removeItem('matchData_' + userId)
  loadMatchData(userId)
}

export const matchService = {
  matchHistory,
  stats,
  isAccountBound,
  isSyncing,
  gameAccountInfo,
  loadMatchData,
  bindGameAccount,
  syncMatchData,
  addMatchRecord,
  fetchStats,
  clearMatchData
}