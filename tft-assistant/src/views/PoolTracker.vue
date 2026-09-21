<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-white">卡池概率计算器</h1>
        <p class="text-gray-400 mt-2">追踪卡池剩余卡量，实时计算D牌概率 — S8怪兽入侵赛季</p>
      </div>

      <!-- 顶部控制栏 -->
      <div class="bg-[var(--bg-card)] border border-[var(--line-soft)] rounded-lg p-4 mb-6">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label class="text-gray-400 text-xs block mb-1">当前等级</label>
            <select v-model.number="currentLevel" class="w-full bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg px-3 py-2 text-white font-bold focus:border-[var(--accent-color)] outline-none" style="color-scheme: dark">
              <option v-for="l in 9" :key="l" :value="l" class="bg-slate-800 text-white">Lv.{{ l }}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-xs block mb-1">目标英雄</label>
            <select v-model="targetHero" class="w-full bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg px-3 py-2 text-white font-bold focus:border-[var(--accent-color)] outline-none" style="color-scheme: dark">
              <option value="" class="bg-slate-800 text-white">-- 选择英雄 --</option>
              <optgroup v-for="tier in [1,2,3,4,5]" :key="tier" :label="tier + '费英雄'" class="bg-slate-800 text-gray-400">
                <option v-for="h in heroesByTier[tier]" :key="h.en" :value="h.en" class="bg-slate-800 text-white">{{ h.name }} ({{ tier }}费)</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-xs block mb-1">目标总张数</label>
            <select v-model.number="targetCount" class="w-full bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg px-3 py-2 text-white font-bold focus:border-[var(--accent-color)] outline-none" style="color-scheme: dark">
              <option v-for="n in maxTargetOptions" :key="n" :value="n" class="bg-slate-800 text-white">
                {{ n }}张{{ n >= 6 ? ' (追三星)' : '' }}
              </option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-xs block mb-1">计划D牌金币</label>
            <input v-model.number="planGold" type="number" min="0" max="200" class="w-full bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg px-3 py-2 text-white font-bold focus:border-[var(--accent-color)] outline-none" />
          </div>
          <button @click="resetAll" class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-sm font-medium transition-colors border border-red-500/20">
            重置卡池
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- 左侧：卡池追踪 (3列) -->
        <div class="lg:col-span-3 space-y-4">
          <div v-for="tier in [1,2,3,4,5]" :key="tier" class="bg-[var(--bg-card)] border border-[var(--line-soft)] rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold" :class="tierColor(tier)">{{ tier }}费英雄</h3>
                <span class="text-xs text-gray-500">{{ heroesByTier[tier].length }}种 · 每种{{ POOL_SIZE[tier] }}张</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-gray-500">卡池剩余：</span>
                <span class="font-bold" :class="tierRemaining[tier] > tier * 50 ? 'text-green-400' : tierRemaining[tier] > tier * 20 ? 'text-yellow-400' : 'text-red-400'">
                  {{ tierRemaining[tier] }}张
                </span>
                <span class="text-gray-600">/ {{ totalPoolByTier[tier] }}</span>
              </div>
            </div>
            <div class="grid grid-cols-6 md:grid-cols-7 gap-1.5">
                <div v-for="h in heroesByTier[tier]" :key="h.en"
                  class="hero-slot rounded-lg p-1.5 text-center border"
                  :class="slotClass(h)"
                >
                  <div class="w-7 h-7 mx-auto bg-center bg-no-repeat"
                    :class="costBorderClass(h.cost)"
                    :style="{ backgroundImage: `url(${getHeroIconByName(h.name)})`, backgroundSize: 'cover' }"
                  ></div>
                  <div class="text-xs font-bold truncate" :class="heroNameClass(h)">{{ h.name }}</div>
                  <div class="flex flex-col gap-0.5 mt-0.5">
                    <select 
                      :value="myOwned[h.en] || 0"
                      @change="(e) => updateMyOwned(h, parseInt(e.target.value))"
                      class="w-full bg-slate-800/80 border border-cyan-500/30 rounded text-xs text-cyan-400 font-bold px-1 py-0.5 focus:border-cyan-400 outline-none"
                      style="color-scheme: dark"
                      :title="h.name + ' - 我持有'"
                    >
                      <option :value="0" class="bg-slate-800">0</option>
                      <option v-for="n in POOL_SIZE[tier]" :key="'me-'+n" :value="n" class="bg-slate-800">我×{{ n }}</option>
                    </select>
                    <select 
                      :value="othersOwned[h.en] || 0"
                      @change="(e) => updateOthersOwned(h, parseInt(e.target.value))"
                      class="w-full bg-slate-800/80 border border-red-500/30 rounded text-xs text-red-400 font-bold px-1 py-0.5 focus:border-red-400 outline-none"
                      style="color-scheme: dark"
                      :title="h.name + ' - 他人持有'"
                    >
                      <option :value="0" class="bg-slate-800">0</option>
                      <option v-for="n in POOL_SIZE[tier]" :key="'others-'+n" :value="n" class="bg-slate-800">敌×{{ n }}</option>
                    </select>
                  </div>
                  <div v-if="getRemaining(h) > 0" class="text-xs text-gray-500 mt-0.5">剩{{ getRemaining(h) }}</div>
                  <div v-else class="text-xs text-red-500 mt-0.5">已耗尽</div>
                </div>
              </div>
          </div>
        </div>

        <!-- 右侧：概率计算 (2列) -->
        <div class="lg:col-span-2 space-y-4">
          <!-- 概率结果面板 -->
          <div class="bg-[var(--bg-card)] border border-[var(--line-soft)] rounded-lg p-6">
            <h3 class="text-lg font-bold text-white mb-4">概率分析</h3>
            <div v-if="!targetHero" class="text-gray-500 text-sm text-center py-8">
              请选择一个目标英雄
            </div>
            <div v-else class="space-y-4">
              <!-- 持有状态提示 -->
              <div v-if="targetOwned > 0" class="bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                <span class="text-cyan-400 text-sm">你已持有</span>
                <span class="text-cyan-300 font-bold text-lg">{{ targetOwned }}张</span>
                <span class="text-gray-500 text-sm">，还需 {{ needMore }} 张</span>
              </div>

              <!-- 不可能完成警告 -->
              <div v-if="targetCount > targetPoolTotal" class="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-red-300 text-sm">
                ⚠ 目标超出卡池上限（该英雄共{{ targetPoolTotal }}张），请降低目标
              </div>

              <!-- 基本信息 -->
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="bg-[var(--bg-card-hover)] rounded-lg p-3">
                  <div class="text-gray-500 mb-1">卡池剩余</div>
                  <div class="text-2xl font-bold" :class="targetRemaining <= 2 ? 'text-red-400' : targetRemaining <= 5 ? 'text-yellow-400' : 'text-green-400'">
                    {{ targetRemaining }}
                  </div>
                  <div class="text-xs text-gray-600">/ {{ targetPoolTotal }} 张共{{ targetTierCount }}种</div>
                </div>
                <div class="bg-[var(--bg-card-hover)] rounded-lg p-3">
                  <div class="text-gray-500 mb-1">同费剩余</div>
                  <div class="text-2xl font-bold text-white">{{ targetTierRemaining }}</div>
                  <div class="text-xs text-gray-600">张 ({{ targetHeroCost }}费卡池)</div>
                </div>
              </div>

              <!-- 单格概率 -->
              <div class="bg-[rgba(var(--accent-rgb),0.08)] rounded-lg p-4 border border-[var(--line-soft)]">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-gray-400 text-xs mb-1">每格出现概率</div>
                    <div class="text-3xl font-bold text-[var(--accent-color)]">{{ safePercent(slotProb) }}</div>
                  </div>
                  <div>
                    <div class="text-gray-400 text-xs mb-1">每次刷新(5格)</div>
                    <div class="text-3xl font-bold text-[var(--accent-gold)]">{{ safePercent(rollProb) }}</div>
                  </div>
                </div>
              </div>

              <!-- D牌预算分析 -->
              <div v-if="planGold > 0" class="bg-[var(--bg-card-hover)] rounded-lg p-4">
                <h4 class="text-sm text-gray-400 mb-3">{{ planGold }}金币 ≈ {{ Math.floor(planGold / 2) }}次刷新，共 {{ Math.floor(planGold / 2) * 5 }} 格</h4>
                <div class="relative pt-1">
                  <div class="flex mb-1 items-center justify-between">
                  <span class="text-xs text-gray-400">
                    <template v-if="effectiveTarget <= 0">
                      <template v-if="targetOwned >= targetCount">已达成目标</template>
                      <template v-else>卡池已无剩余</template>
                    </template>
                    <template v-else-if="targetOwned > 0">
                      已有{{ targetOwned }}张，还需D到{{ effectiveTarget }}张
                    </template>
                    <template v-else>
                      递到{{ effectiveTarget }}张概率
                    </template>
                  </span>
                    <span class="text-xs font-bold" :class="probWithBudget > 0.5 ? 'text-green-400' : probWithBudget > 0.2 ? 'text-yellow-400' : 'text-red-400'">
                      {{ safePercent(probWithBudget) }}
                    </span>
                  </div>
                  <div class="overflow-hidden h-2 text-xs flex rounded-full bg-white/10">
                    <div :style="{ width: safeBarWidth(probWithBudget) }"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-500"
                      :class="probWithBudget > 0.5 ? 'bg-green-500' : probWithBudget > 0.2 ? 'bg-yellow-500' : 'bg-red-500'">
                    </div>
                  </div>
                </div>
              </div>

              <!-- 期望消耗 -->
              <div class="grid grid-cols-3 gap-2 text-center text-sm">
                <div class="bg-[var(--bg-card-hover)] rounded-lg p-3">
                  <div class="text-gray-500 mb-1">期望刷新</div>
                  <div class="text-xl font-bold text-yellow-400">{{ safeRolls(fishingStats.expectedRolls) }}</div>
                  <div class="text-xs text-gray-600">次</div>
                </div>
                <div class="bg-[var(--bg-card-hover)] rounded-lg p-3">
                  <div class="text-gray-500 mb-1">50%概率</div>
                  <div class="text-xl font-bold text-orange-400">{{ safeRolls(fishingStats.probability50) }}</div>
                  <div class="text-xs text-gray-600">次 ({{ safeGold(fishingStats.probability50 * 2) }}g)</div>
                </div>
                <div class="bg-[var(--bg-card-hover)] rounded-lg p-3">
                  <div class="text-gray-500 mb-1">80%概率</div>
                  <div class="text-xl font-bold text-[var(--accent-color)]">{{ safeRolls(fishingStats.probability80) }}</div>
                  <div class="text-xs text-gray-600">次 ({{ safeGold(fishingStats.probability80 * 2) }}g)</div>
                </div>
              </div>

              <!-- 概率曲线 -->
              <div class="bg-[var(--bg-card-hover)] rounded-lg p-4">
                <h4 class="text-sm text-gray-400 mb-3">概率随D牌次数变化</h4>
                <div class="flex items-end gap-1 h-24">
                  <div v-for="(p, i) in probabilityCurve" :key="i"
                    class="flex-1 rounded-t transition-all"
                    :class="p > 0.8 ? 'bg-green-500' : p > 0.5 ? 'bg-yellow-500' : p > 0.2 ? 'bg-orange-500' : 'bg-red-500/50'"
                    :style="{ height: safeBarHeight(p) }"
                    :title="(i+1) + '次D = ' + safePercent(p)">
                  </div>
                </div>
                <div class="flex justify-between text-xs text-gray-600 mt-2">
                  <span>1次</span>
                  <span>{{ probabilityCurve.length }}次</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前等级刷新概率 -->
          <div class="bg-[var(--bg-card)] border border-[var(--line-soft)] rounded-lg p-4">
            <h3 class="text-sm text-gray-400 mb-3">Lv.{{ currentLevel }} 刷新概率</h3>
            <div class="flex gap-1">
              <div v-for="tier in [1,2,3,4,5]" :key="tier" class="flex-1 text-center">
                <div class="text-xs text-gray-500 mb-1">{{ tier }}费</div>
                <div class="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-1">
                  <div class="h-full rounded-full" :class="tierBarColor(tier)" :style="{ width: rollOdds[tier] + '%' }"></div>
                </div>
                <div class="text-xs font-bold text-white">{{ rollOdds[tier] }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { gameData } from '../services/gameDataService'
// 卡池常量走统一数据入口（本地兜底，后端 pool 数据可覆盖）；纯计算函数仍从 poolData 导入
import { calcSlotProbability, calcRollProbabilityWithBudget, calcFishingStats } from '../data/poolData'

const POOL_SIZE = gameData.poolSize
const ROLL_ODDS = gameData.rollOdds
const ALL_POOL_HEROES = gameData.allPoolHeroes

const heroesByTier = computed(() => {
  return {
    1: ALL_POOL_HEROES.value.filter(h => h.cost === 1),
    2: ALL_POOL_HEROES.value.filter(h => h.cost === 2),
    3: ALL_POOL_HEROES.value.filter(h => h.cost === 3),
    4: ALL_POOL_HEROES.value.filter(h => h.cost === 4),
    5: ALL_POOL_HEROES.value.filter(h => h.cost === 5),
  }
})

const currentLevel = ref(7)
const targetHero = ref('')
const targetCount = ref(1)
const planGold = ref(0)

const myOwned = reactive({})
const othersOwned = reactive({})

function ownedCount(hero) { return myOwned[hero.en] || 0 }
function othersCount(hero) { return othersOwned[hero.en] || 0 }

function getRemaining(hero) {
  return POOL_SIZE.value[hero.tier] - (myOwned[hero.en] || 0) - (othersOwned[hero.en] || 0)
}

function resetAll() {
  Object.keys(myOwned).forEach(k => delete myOwned[k])
  Object.keys(othersOwned).forEach(k => delete othersOwned[k])
  targetHero.value = ''
  targetCount.value = 1
  planGold.value = 0
}

// 费用档位色遵循游戏内语义（1灰/2绿/3蓝/4紫/5金），4费紫用显式色值以免被品牌重映射覆盖
function tierColor(tier) {
  return { 1: 'text-gray-400', 2: 'text-green-400', 3: 'text-blue-400', 4: 'text-[#c084fc]', 5: 'text-yellow-400' }[tier] || 'text-white'
}

function tierBarColor(tier) {
  return { 1: 'bg-gray-400', 2: 'bg-green-400', 3: 'bg-blue-400', 4: 'bg-[#c084fc]', 5: 'bg-yellow-400' }[tier] || 'bg-gray-400'
}

// 从 gameData 查找英雄图标
function getHeroIconByName(name) {
  const hero = gameData.getHeroByName(name)
  return hero?.icon || ''
}

function costBorderClass(cost) {
  return {
    1: 'border-2 border-gray-500/50 rounded',
    2: 'border-2 border-green-500/50 rounded',
    3: 'border-2 border-blue-500/50 rounded', 
    4: 'border-2 border-[rgba(168,85,247,0.5)] rounded',
    5: 'border-2 border-yellow-500/50 rounded'
  }[cost] || 'border-2 border-gray-500/30 rounded'
}

function slotClass(hero) {
  const remaining = getRemaining(hero)
  const isTarget = targetHero.value === hero.en
  if (remaining <= 0) return 'bg-red-500/20 border-red-500/50 opacity-50'
  if (isTarget) return 'bg-[rgba(var(--accent-rgb),0.25)] border-[var(--accent-color)] ring-1 ring-[var(--accent-color)]'
  if (remaining <= 2) return 'bg-red-500/10 border-red-500/20'
  if (remaining <= 5) return 'bg-yellow-500/10 border-yellow-500/20'
  return 'bg-[var(--bg-card-hover)] border-[var(--line-soft)] hover:border-[var(--line-strong)]'
}

function heroNameClass(hero) {
  return getRemaining(hero) <= 0 ? 'text-gray-600 line-through' : 'text-gray-300'
}

const tierRemaining = computed(() => {
  const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ALL_POOL_HEROES.value.forEach(h => { result[h.tier] += getRemaining(h) })
  return result
})

const totalPoolByTier = computed(() => {
  const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ALL_POOL_HEROES.value.forEach(h => { result[h.tier] += POOL_SIZE.value[h.tier] })
  return result
})

const rollOdds = computed(() => {
  const odds = ROLL_ODDS.value[currentLevel.value]
  return odds ? { 1: odds[1] || 0, 2: odds[2] || 0, 3: odds[3] || 0, 4: odds[4] || 0, 5: odds[5] || 0 } : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
})

const targetHeroObj = computed(() => ALL_POOL_HEROES.value.find(h => h.en === targetHero.value))
const targetHeroCost = computed(() => targetHeroObj.value ? targetHeroObj.value.tier : 1)
const targetTierCount = computed(() => {
  const tier = targetHeroObj.value ? targetHeroObj.value.tier : 1
  return heroesByTier.value[tier] ? heroesByTier.value[tier].length : 1
})
const targetPoolTotal = computed(() => targetHeroObj.value ? POOL_SIZE.value[targetHeroObj.value.tier] : 0)
const targetRemaining = computed(() => targetHeroObj.value ? getRemaining(targetHeroObj.value) : 0)
const targetTierRemaining = computed(() => targetHeroObj.value ? tierRemaining.value[targetHeroObj.value.tier] : 0)

const targetOwned = computed(() => targetHeroObj.value ? (myOwned[targetHeroObj.value.en] || 0) : 0)
const targetOthers = computed(() => targetHeroObj.value ? (othersOwned[targetHeroObj.value.en] || 0) : 0)
const needMore = computed(() => Math.max(0, targetCount.value - targetOwned.value))
const effectiveTarget = computed(() => {
  if (!targetHeroObj.value) return 0
  return Math.max(0, Math.min(targetCount.value - targetOwned.value, targetRemaining.value))
})
const maxTargetOptions = computed(() => {
  if (!targetHeroObj.value) return [1, 2, 3]
  const remaining = targetPoolTotal.value - targetOthers.value
  const opts = []
  for (let n = 1; n <= Math.min(remaining, 12); n++) {
    opts.push(n)
  }
  return opts
})

function updateMyOwned(hero, value) {
  const others = othersOwned[hero.en] || 0
  const maxAllowed = POOL_SIZE.value[hero.tier] - others
  const clamped = Math.min(Math.max(0, value), maxAllowed)
  if (clamped === 0) delete myOwned[hero.en]
  else myOwned[hero.en] = clamped
}

function updateOthersOwned(hero, value) {
  const mine = myOwned[hero.en] || 0
  const maxAllowed = POOL_SIZE.value[hero.tier] - mine
  const clamped = Math.min(Math.max(0, value), maxAllowed)
  if (clamped === 0) delete othersOwned[hero.en]
  else othersOwned[hero.en] = clamped
}

const slotProb = computed(() => {
  if (!targetHeroObj.value) return 0
  const val = calcSlotProbability(currentLevel.value, targetHeroCost.value, targetRemaining.value, targetTierRemaining.value)
  return isFinite(val) ? val : 0
})

const rollProb = computed(() => {
  if (!targetHeroObj.value) return 0
  const p = 1 - Math.pow(1 - slotProb.value, 5)
  return isFinite(p) ? p : 0
})

const probWithBudget = computed(() => {
  if (!targetHeroObj.value || planGold.value <= 0) return 0
  if (effectiveTarget.value <= 0) return 0
  const rolls = Math.floor(planGold.value / 2)
  const val = calcRollProbabilityWithBudget(currentLevel.value, targetHeroCost.value, targetRemaining.value, targetTierRemaining.value, rolls, effectiveTarget.value)
  return isFinite(val) ? Math.max(0, Math.min(1, val)) : 0
})

const fishingStats = computed(() => {
  if (!targetHeroObj.value || effectiveTarget.value <= 0) return { expectedRolls: Infinity, probability50: Infinity, probability80: Infinity }
  const stats = calcFishingStats(currentLevel.value, targetHeroCost.value, effectiveTarget.value, targetRemaining.value, targetTierRemaining.value)
  return {
    expectedRolls: isFinite(stats.expectedRolls) ? stats.expectedRolls : Infinity,
    probability50: isFinite(stats.probability50) ? stats.probability50 : Infinity,
    probability80: isFinite(stats.probability80) ? stats.probability80 : Infinity
  }
})

const probabilityCurve = computed(() => {
  if (!targetHeroObj.value) return []
  const curve = []
  for (let r = 1; r <= 25; r++) {
    const val = calcRollProbabilityWithBudget(currentLevel.value, targetHeroCost.value, targetRemaining.value, targetTierRemaining.value, r, effectiveTarget.value)
    curve.push(isFinite(val) ? Math.max(0, Math.min(1, val)) : 0)
  }
  return curve
})

// NaN 安全显示函数
function safePercent(val) {
  if (typeof val !== 'number' || !isFinite(val) || val < 0) return '0%'
  return (val * 100).toFixed(2) + '%'
}
function safeRolls(val) {
  if (typeof val !== 'number' || !isFinite(val) || val < 0) return '∞'
  return Math.round(val)
}
function safeGold(val) {
  if (typeof val !== 'number' || !isFinite(val) || val < 0) return '∞'
  return Math.round(val)
}
function safeBarWidth(val) {
  if (typeof val !== 'number' || !isFinite(val) || val < 0) return '0%'
  return Math.min(100, val * 100) + '%'
}
function safeBarHeight(val) {
  if (typeof val !== 'number' || !isFinite(val) || val < 0) return '2%'
  return Math.max(2, val * 100) + '%'
}
</script>

<style scoped>
.hero-slot { min-height: 38px; }
.hero-slot:hover { transform: translateY(-1px); }
</style>
