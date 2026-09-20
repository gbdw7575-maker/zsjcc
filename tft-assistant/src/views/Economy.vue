<template>
  <div class="min-h-screen p-4">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">经济运营计算器</h1>
        <p class="text-gray-400 mt-2">实时计算金币利息、升级成本、最佳D牌时机 — S8怪兽入侵赛季</p>
      </div>

      <!-- 面板1: 当前状态输入 -->
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
        <h2 class="text-xl font-bold text-white mb-4">当前状态</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label class="text-gray-400 text-sm block mb-2">当前金币</label>
            <input v-model.number="state.gold" type="number" min="0" max="200" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-purple-400 outline-none" />
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-2">当前等级</label>
            <select v-model.number="state.level" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-purple-400 outline-none" style="color-scheme: dark">
              <option v-for="l in 9" :key="l" :value="l" class="bg-slate-800 text-white">{{ l }}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-2">当前经验</label>
            <input v-model.number="state.xp" type="number" min="0" max="100" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-purple-400 outline-none" />
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-2">连胜/连败</label>
            <select v-model.number="state.streak" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-purple-400 outline-none" style="color-scheme: dark">
              <option :value="-5" class="bg-slate-800 text-white">5连败</option>
              <option :value="-4" class="bg-slate-800 text-white">4连败</option>
              <option :value="-3" class="bg-slate-800 text-white">3连败</option>
              <option :value="-2" class="bg-slate-800 text-white">2连败</option>
              <option :value="-1" class="bg-slate-800 text-white">1连败</option>
              <option :value="0" class="bg-slate-800 text-white">无连胜/连败</option>
              <option :value="1" class="bg-slate-800 text-white">1连胜</option>
              <option :value="2" class="bg-slate-800 text-white">2连胜</option>
              <option :value="3" class="bg-slate-800 text-white">3连胜</option>
              <option :value="4" class="bg-slate-800 text-white">4连胜</option>
              <option :value="5" class="bg-slate-800 text-white">5+连胜</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-2">目标等级</label>
            <select v-model.number="targetLevel" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-purple-400 outline-none" style="color-scheme: dark">
              <option v-for="l in 9" :key="l" :value="l" :disabled="l <= state.level" class="bg-slate-800 text-white">{{ l }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 面板2: 下回合收入 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 class="text-gray-400 text-sm mb-4">下回合预计收入</h3>
          <div class="text-5xl font-bold text-yellow-400 mb-4">{{ nextRoundGold }}</div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">基础收入</span>
              <span class="text-white">+5</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">利息 ({{ interestGold }})</span>
              <span class="text-white">+{{ interestGold }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">连胜/连败</span>
              <span :class="streakGold > 0 ? 'text-green-400' : 'text-white'">+{{ streakGold }}</span>
            </div>
            <div class="flex justify-between border-t border-white/10 pt-2 mt-2">
              <span class="text-gray-300 font-semibold">最终金币</span>
              <span class="text-yellow-300 font-bold">{{ state.gold + nextRoundGold }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 class="text-gray-400 text-sm mb-4">利息断点提醒</h3>
          <div class="space-y-3">
            <div v-for="bp in interestBreakpoints" :key="bp.threshold" class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :class="state.gold >= bp.threshold ? 'bg-yellow-400' : 'bg-gray-600'"></div>
              <span class="text-gray-300 text-sm flex-1">{{ bp.label }}</span>
              <span class="text-yellow-400 font-bold">{{ bp.interest }}</span>
            </div>
            <div class="pt-3 border-t border-white/10 text-sm">
              <span class="text-gray-400">距离下一断点还需 </span>
              <span class="text-purple-400 font-bold">{{ goldToNextBreakpoint }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 class="text-gray-400 text-sm mb-4">升级规划</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">目标等级</span>
              <span class="text-white font-bold">Lv.{{ targetLevel }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">所需总经验</span>
              <span class="text-white font-bold">{{ neededXP }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">需购买经验</span>
              <span class="text-white font-bold">{{ xpToBuy }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">花费金币</span>
              <span class="text-red-400 font-bold text-lg">{{ upgradeCost }}</span>
            </div>
            <div class="flex justify-between border-t border-white/10 pt-2">
              <span class="text-gray-400">自然升级回合数</span>
              <span class="text-cyan-400 font-bold">{{ naturalRounds }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">升级后剩余金币</span>
              <span :class="goldAfterUpgrade >= 0 ? 'text-green-400' : 'text-red-400'" class="font-bold">{{ goldAfterUpgrade }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 面板3: 金币趋势预测 -->
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
        <h2 class="text-xl font-bold text-white mb-4">未来回合金币预测</h2>
        <p class="text-gray-400 text-sm mb-6">假设不花钱、不做任何操作（仅拿利息+基础收入）</p>
        <div class="flex flex-wrap gap-3">
          <div v-for="r in goldProjection" :key="r.round" class="flex-1 min-w-[80px] bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div class="text-gray-500 text-xs mb-1">R{{ r.round }}</div>
            <div class="text-2xl font-bold" :class="r.gold >= 50 ? 'text-yellow-400' : r.gold >= 40 ? 'text-purple-400' : 'text-white'">{{ r.gold }}</div>
            <div class="text-xs mt-2" :class="r.interest > 0 ? 'text-yellow-400' : 'text-gray-600'">利息 +{{ r.interest }}</div>
          </div>
        </div>
      </div>

      <!-- 面板4: D牌成本计算 -->
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
        <h2 class="text-xl font-bold text-white mb-4">D牌/刷新成本</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-white/5 rounded-xl p-4">
            <div class="text-gray-400 text-sm mb-2">刷新一次</div>
            <div class="text-3xl font-bold text-blue-400">2g</div>
          </div>
          <div class="bg-white/5 rounded-xl p-4">
            <div class="text-gray-400 text-sm mb-2">当前可刷新</div>
            <div class="text-3xl font-bold text-green-400">{{ Math.floor(state.gold / 2) }}次</div>
          </div>
          <div class="bg-white/5 rounded-xl p-4">
            <div class="text-gray-400 text-sm mb-2">升一级</div>
            <div class="text-3xl font-bold text-orange-400">{{ Math.ceil(xpToBuy / 4) * 4 }}g</div>
          </div>
          <div class="bg-white/5 rounded-xl p-4">
            <div class="text-gray-400 text-sm mb-2">搜到50的D牌</div>
            <div class="text-3xl font-bold text-purple-400">{{ Math.max(0, Math.floor((state.gold - 50) / 2)) }}次</div>
          </div>
        </div>
      </div>

      <!-- 面板5: 升级路线图 -->
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h2 class="text-xl font-bold text-white mb-4">S8 升级经验表</h2>
        <div class="grid grid-cols-6 gap-3">
          <div v-for="l in levelTable" :key="l.from" class="bg-white/5 rounded-xl p-4 text-center border border-white/10" :class="{ 'ring-2 ring-purple-400': l.from === state.level }">
            <div class="text-gray-400 text-xs mb-1">Lv{{ l.from }} → {{ l.to }}</div>
            <div class="text-2xl font-bold text-white">{{ l.xp }}XP</div>
            <div class="text-xs text-gray-500 mt-1">{{ Math.ceil(l.xp / 4) * 4 }}g</div>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-3 md:grid-cols-6 gap-3 text-center text-sm">
          <div v-for="l in [4,5,6,7,8,9]" :key="l" class="bg-white/5 rounded-xl p-3 border border-white/10">
            <div class="text-gray-400 mb-1">Lv.{{ l }} 抽卡概率</div>
            <div class="flex justify-center gap-2 text-xs">
              <span class="text-gray-500">{{ rollOdds[l]?.tier1 || 0 }}%</span>
              <span class="text-green-400">{{ rollOdds[l]?.tier2 || 0 }}%</span>
              <span class="text-blue-400">{{ rollOdds[l]?.tier3 || 0 }}%</span>
              <span class="text-purple-400">{{ rollOdds[l]?.tier4 || 0 }}%</span>
              <span class="text-yellow-400">{{ rollOdds[l]?.tier5 || 0 }}%</span>
            </div>
            <div class="flex justify-center gap-2 text-xs mt-1 text-gray-600">
              <span>1费</span><span>2费</span><span>3费</span><span>4费</span><span>5费</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const state = reactive({
  gold: 30,
  level: 5,
  xp: 4,
  streak: 0
})

const targetLevel = ref(7)

// S8 升级所需经验
const levelXP = [
  { from: 3, to: 4, xp: 6 },
  { from: 4, to: 5, xp: 10 },
  { from: 5, to: 6, xp: 20 },
  { from: 6, to: 7, xp: 36 },
  { from: 7, to: 8, xp: 56 },
  { from: 8, to: 9, xp: 80 }
]

const levelXPMap = {}
levelXP.forEach(l => { levelXPMap[l.from] = l })

// S8 抽卡概率
const rollOdds = {
  4: { tier1: 55, tier2: 30, tier3: 15, tier4: 0, tier5: 0 },
  5: { tier1: 45, tier2: 33, tier3: 20, tier4: 2, tier5: 0 },
  6: { tier1: 25, tier2: 40, tier3: 30, tier4: 5, tier5: 0 },
  7: { tier1: 19, tier2: 30, tier3: 35, tier4: 15, tier5: 1 },
  8: { tier1: 16, tier2: 20, tier3: 35, tier4: 25, tier5: 4 },
  9: { tier1: 9, tier2: 15, tier3: 30, tier4: 30, tier5: 16 }
}

const interestGold = computed(() => Math.min(5, Math.floor(state.gold / 10)))

const streakGold = computed(() => {
  const abs = Math.abs(state.streak)
  if (abs >= 5) return 3
  if (abs >= 4) return 2
  if (abs >= 2) return 1
  return 0
})

const nextRoundGold = computed(() => 5 + interestGold.value + streakGold.value)

const interestBreakpoints = computed(() => [
  { threshold: 10, label: '10金币 → 1利息', interest: '+1g' },
  { threshold: 20, label: '20金币 → 2利息', interest: '+2g' },
  { threshold: 30, label: '30金币 → 3利息', interest: '+3g' },
  { threshold: 40, label: '40金币 → 4利息', interest: '+4g' },
  { threshold: 50, label: '50金币 → 5利息(上限)', interest: '+5g' }
])

const goldToNextBreakpoint = computed(() => {
  const next = [10, 20, 30, 40, 50].find(t => t > state.gold)
  return next ? next - state.gold : 0
})

// 升级计算
const totalXPToTarget = computed(() => {
  let total = 0
  for (let l = state.level; l < targetLevel.value; l++) {
    if (levelXPMap[l]) total += levelXPMap[l].xp
  }
  return total
})

const neededXP = computed(() => Math.max(0, totalXPToTarget.value - state.xp))

const xpToBuy = computed(() => neededXP.value)

const upgradeCost = computed(() => Math.ceil(xpToBuy.value / 4) * 4)

const goldAfterUpgrade = computed(() => state.gold - upgradeCost.value)

const naturalRounds = computed(() => {
  if (neededXP.value <= 0) return 0
  return Math.ceil(neededXP.value / 2) + '回合'
})

// 金币预测（未来8回合）
const goldProjection = computed(() => {
  const rounds = []
  let gold = state.gold
  for (let i = 1; i <= 8; i++) {
    const interest = Math.min(5, Math.floor(gold / 10))
    const income = 5 + interest + (streakGold.value > 0 ? streakGold.value : 0)
    gold += income
    rounds.push({ round: i, gold, interest, income })
  }
  return rounds
})

const levelTable = levelXP
</script>
