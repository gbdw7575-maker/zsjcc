/**
 * 游戏数据动态加载服务
 * 优先从后端 /api/game-data 获取，后端不可用或数据库为空时自动回退到本地硬编码数据
 * 
 * 用法：
 *   import { gameData } from '../services/gameDataService'
 *   await gameData.load()                    // 在 App.vue onMounted 中调用
 *   console.log(gameData.heroes.value)       // 响应式英雄列表
 */

import { ref } from 'vue'
import api from './api'

// ============ 同步加载本地数据作为初始回退值 ============
import { heroesData, synergyData, equipmentData, metaTeams as localMetaTeams } from '../data/gameData'
import { POOL_SIZE as LOCAL_POOL_SIZE, ROLL_ODDS as LOCAL_ROLL_ODDS, HERO_COUNT_BY_COST as LOCAL_HERO_COUNT_BY_COST, ALL_POOL_HEROES as LOCAL_ALL_POOL_HEROES } from '../data/poolData'

// ============ 数据缓存（响应式，初始化时就用本地数据填充） ============
const heroes = ref(heroesData)
const synergies = ref(synergyData)
const equipments = ref(equipmentData)
const pool = ref({
  poolSize: LOCAL_POOL_SIZE,
  rollOdds: LOCAL_ROLL_ODDS,
  heroCountByCost: LOCAL_HERO_COUNT_BY_COST,
  poolHeroes: LOCAL_ALL_POOL_HEROES
})
const augments = ref({ heroAugments: [] })
const metaTeams = ref(localMetaTeams)
const loaded = ref(false)
const loading = ref(false)
const error = ref(null)
const currentVersion = ref('S8 怪兽入侵（本地数据）')
const fromFallback = ref(true)

// 为 poolData 工具函数提供兼容的导出格式
const poolSize = ref(LOCAL_POOL_SIZE)
const rollOdds = ref(LOCAL_ROLL_ODDS)
const heroCountByCost = ref(LOCAL_HERO_COUNT_BY_COST)
const allPoolHeroes = ref(LOCAL_ALL_POOL_HEROES)

/**
 * 从后端尝试加载最新活跃赛季数据（异步增强）
 * 仅首次调用会发起请求，后续调用直接返回缓存
 * 数据已通过同步导入初始化，后端不可用时自动使用本地数据
 */
async function load() {
  if (loaded.value) return
  if (loading.value) return

  loading.value = true
  error.value = null

  try {
    const { data } = await api.get('/game-data', { params: { isActive: true } })
    const items = data.data || []

    if (items.length === 0) {
      // 后端无数据，保持本地数据即可
      loaded.value = true
      return
    }

    for (const item of items) {
      switch (item.type) {
        case 'hero':
          if (item.data?.length) heroes.value = item.data
          break
        case 'synergy':
          if (item.data?.length) synergies.value = item.data
          break
        case 'equipment':
          if (item.data?.length) equipments.value = item.data
          break
        case 'pool':
          if (item.data) {
            pool.value = item.data
            poolSize.value = item.data.poolSize || LOCAL_POOL_SIZE
            rollOdds.value = item.data.rollOdds || LOCAL_ROLL_ODDS
            heroCountByCost.value = item.data.heroCountByCost || LOCAL_HERO_COUNT_BY_COST
            allPoolHeroes.value = item.data.poolHeroes || LOCAL_ALL_POOL_HEROES
          }
          break
        case 'augment':
          if (item.data) augments.value = item.data
          break
        case 'metaTeam':
          if (item.data?.length) metaTeams.value = item.data
          break
      }
      currentVersion.value = item.version
    }

    fromFallback.value = false
    loaded.value = true
  } catch (err) {
    // 后端不可用，保持本地数据
    error.value = err.response?.data?.message || err.message || '后端不可用，使用本地数据'
    loaded.value = true
  } finally {
    loading.value = false
  }
}

/**
 * 强制刷新数据（管理员更新后调用）
 */
async function refresh() {
  loaded.value = false
  loading.value = false
  await load()
}

// 提供与旧 data 文件相同的查询方法
function getHeroByName(name) {
  return heroes.value.find(h => h.name === name) || null
}

function getSynergyByName(name) {
  return synergies.value.find(s => s.name === name) || null
}

function getEquipmentByType(type) {
  return equipments.value.filter(e => e.type === type)
}

export const gameData = {
  // 原始数据
  heroes,
  synergies,
  equipments,
  pool,
  augments,
  metaTeams,
  // 状态
  loaded,
  loading,
  error,
  currentVersion,
  fromFallback,
  // 兼容 poolData 的导出
  poolSize,
  rollOdds,
  heroCountByCost,
  allPoolHeroes,
  // 方法
  load,
  refresh,
  getHeroByName,
  getSynergyByName,
  getEquipmentByType
}
