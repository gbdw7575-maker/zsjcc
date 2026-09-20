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
const currentVersion = ref('S8 怪兽入侵（本地数据）')
const fromFallback = ref(true)

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
 * 加载流程：先确保本地数据就绪，再尝试后端增强（后端记录覆盖本地）
 * 仅首次完整执行，后续调用直接返回缓存
 */
async function load() {
  if (loaded.value) return
  if (loading.value) return

  loading.value = true
  error.value = null

  try {
    await ensureLocalData()

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
