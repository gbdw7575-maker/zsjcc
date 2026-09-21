/**
 * 游戏数据动态加载服务
 * 优先从后端 /api/game-data 获取，后端不可用或数据库为空时自动回退到本地数据
 *
 * 本地数据通过动态 import() 按需加载，Vite 会将大体积数据文件拆分为独立 chunk，
 * 不再全部打进主包；refs 初始为空，数据到达后响应式更新。
 *
 * 用法：
 *   import { gameData } from '../services/gameDataService'
 *   await gameData.load()                    // 在 App.vue onMounted 中调用
 *   console.log(gameData.heroes.value)       // 响应式英雄列表
 */

import { ref } from 'vue'
import api from './api'

// ============ 数据缓存（响应式，本地 chunk 异步到达后填充） ============
const heroes = ref([])
const synergies = ref([])
const equipments = ref([])
const pool = ref({
  poolSize: {},
  rollOdds: {},
  heroCountByCost: {},
  poolHeroes: []
})
const augments = ref({ heroAugments: [], silverAugments: [], goldAugments: [], prismaticAugments: [] })
const metaTeams = ref([])
const loaded = ref(false)
const loading = ref(false)
const error = ref(null)
const currentVersion = ref('S18 苍林秘境（本地数据）')
const fromFallback = ref(true)
// B3: 当前赛季（未指定时后端返回 active 赛季数据）
const currentSeason = ref(null)
// B3: 后端可选赛季列表（供切换器使用）
const availableSeasons = ref([])

// 为 poolData 工具函数提供兼容的导出格式
const poolSize = ref({})
const rollOdds = ref({})
const heroCountByCost = ref({})
const allPoolHeroes = ref([])

// 本地数据 chunk 加载去重
let localPromise = null

/**
 * 动态加载本地数据 chunk（仅首次发起，之后复用）
 */
function ensureLocalData() {
  if (localPromise) return localPromise

  localPromise = (async () => {
    const [gameDataMod, poolMod, augmentsMod] = await Promise.all([
      import('../data/gameData.js'),
      import('../data/poolData.js'),
      import('../data/augmentsData.js')
    ])

    heroes.value = gameDataMod.heroesData
    synergies.value = gameDataMod.synergyData
    equipments.value = gameDataMod.equipmentData
    metaTeams.value = gameDataMod.metaTeams

    pool.value = {
      poolSize: poolMod.POOL_SIZE,
      rollOdds: poolMod.ROLL_ODDS,
      heroCountByCost: poolMod.HERO_COUNT_BY_COST,
      poolHeroes: poolMod.ALL_POOL_HEROES
    }
    poolSize.value = poolMod.POOL_SIZE
    rollOdds.value = poolMod.ROLL_ODDS
    heroCountByCost.value = poolMod.HERO_COUNT_BY_COST
    allPoolHeroes.value = poolMod.ALL_POOL_HEROES

    augments.value = augmentsMod.augmentsData
  })()

  return localPromise
}

// 模块被引用即开始拉取本地 chunk，缩短首屏数据等待
ensureLocalData()

/**
 * 将后端返回的 game-data items 合并到本地 refs
 * @param {Array} items 后端记录数组
 */
function applyGameDataItems(items) {
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
          poolSize.value = item.data.poolSize || poolSize.value
          rollOdds.value = item.data.rollOdds || rollOdds.value
          heroCountByCost.value = item.data.heroCountByCost || heroCountByCost.value
          allPoolHeroes.value = item.data.poolHeroes || allPoolHeroes.value
        }
        break
      case 'augment':
        if (item.data) augments.value = item.data
        break
      case 'metaTeam':
      case 'team': // 历史数据兼容：team 与 metaTeam 同义
        if (item.data?.length) metaTeams.value = item.data
        break
      default:
        // 未识别类型不静默丢弃
        console.warn(`[gameData] 未识别的数据类型: ${item.type}`)
    }
    // 后端记录携带 version 字段，刷新当前版本号
    if (item.version) currentVersion.value = item.version
    // B3: 后端记录携带 season 字段，回填当前赛季
    if (item.season) currentSeason.value = item.season
  }
}

/**
 * 加载流程：先确保本地数据就绪，再尝试后端增强（后端记录覆盖本地）
 * 仅首次完整执行，后续调用直接返回缓存
 * @param {Object} options 可选 { season } 指定赛季拉取
 */
async function load({ season } = {}) {
  if (loaded.value && !season) return
  if (loading.value) return

  loading.value = true
  error.value = null

  try {
    await ensureLocalData()

    // B3: 同时拉取后端可选赛季列表（失败静默）
    try {
      const { data: seasonsData } = await api.get('/game-data/seasons')
      availableSeasons.value = seasonsData?.data || []
      // 未指定 season 时，取 active 赛季
      if (!season && availableSeasons.value.length > 0) {
        const active = availableSeasons.value.find(s => s.isActive)
        if (active) currentSeason.value = active.season
      }
    } catch (e) {
      // 后端无赛季接口（旧版本），忽略
    }

    // B3: season 显式传入时刷新；否则按 active（无 season 参数时后端默认返回 active）
    const params = season ? { season } : { isActive: true }
    const { data } = await api.get('/game-data', { params })
    const items = data.data || []

    if (items.length === 0) {
      // 后端无数据，保持本地数据即可
      loaded.value = true
      return
    }

    applyGameDataItems(items)

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
 * B3: 切换当前赛季并重新拉取数据
 * @param {String} season 赛季标识（如 'S18'、'S10'）
 */
async function setCurrentSeason(season) {
  if (!season) return
  // 强制刷新：重置 loaded 状态后重新走一遍 load(season)
  loading.value = true
  error.value = null
  try {
    await ensureLocalData()
    const { data } = await api.get('/game-data', { params: { season } })
    const items = data.data || []
    if (items.length > 0) {
      applyGameDataItems(items)
      currentSeason.value = season
      fromFallback.value = false
    } else {
      // 该赛季后端无数据，仅切换 season 标识，保留本地数据
      currentSeason.value = season
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || '切换赛季失败'
    currentSeason.value = season
  } finally {
    loading.value = false
  }
}

/**
 * B3: 拉取后端可选赛季列表（独立方法，切换器组件可直接调用刷新）
 */
async function loadSeasons() {
  try {
    const { data } = await api.get('/game-data/seasons')
    availableSeasons.value = data?.data || []
    return availableSeasons.value
  } catch (e) {
    return []
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
  // B3: 赛季相关
  currentSeason,
  availableSeasons,
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
  getEquipmentByType,
  // B3: 赛季切换 + 列表刷新
  setCurrentSeason,
  loadSeasons
}
