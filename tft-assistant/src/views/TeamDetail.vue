<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link to="/" class="inline-flex items-center gap-2 text-[var(--accent-color)] hover:text-[var(--accent-hover)] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium">返回首页</span>
        </router-link>
        <span class="ml-4 text-sm text-gray-500">金铲铲之战 · S8怪兽入侵赛季</span>
      </div>

      <!-- 加载中/未找到 -->
      <div v-if="notFound" class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="text-6xl mb-4">😿</div>
        <h2 class="text-2xl font-bold text-white mb-2">阵容不存在</h2>
        <p class="text-gray-400 mb-6">该阵容详情尚未收录，敬请期待后续更新</p>
        <router-link to="/" class="px-6 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] rounded-xl transition-colors font-medium">
          返回首页浏览其他阵容
        </router-link>
      </div>

      <div v-else-if="!teamDetail" class="flex items-center justify-center min-h-[400px]">
        <el-loading text="加载阵容详情中..." />
      </div>

      <template v-else>
        <!-- 阵容标题 -->
        <div class="bg-gradient-to-r from-[rgba(var(--accent-rgb),0.15)] via-[rgba(var(--gold-rgb),0.1)] to-[rgba(59,130,246,0.1)] rounded-3xl p-8 border border-[var(--line-soft)] mb-8">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-4 mb-3">
                <h1 class="text-4xl font-bold text-white">{{ teamDetail.name }}</h1>
                <span :class="tierClass(teamDetail.tier)" class="px-4 py-2 rounded-full text-sm font-bold">
                  {{ teamDetail.tier }}
                </span>
                <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {{ teamDetail.population }}人口
                </span>
                <span class="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                  {{ teamDetail.difficulty }}
                </span>
              </div>
              <p class="text-gray-400 text-lg mb-2">{{ teamDetail.description }}</p>
              <div class="text-sm text-gray-500">
                <span class="font-semibold text-gray-400">数据来源：</span>
                <span>金铲铲之战官方公告、TapTap官方社区、云顶之弈数据站</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 主要内容 -->
        <div class="space-y-6">
          <!-- 第一部分：阵容组成 -->
          <div class="hud-card p-6">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">🎮</span>
              阵容组成
            </h2>
            
            <!-- 英雄网格布局 -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              <div v-for="hero in teamDetail.heroes" :key="hero.name" 
                class="p-3 bg-[var(--bg-card-hover)] rounded-lg border border-[var(--line-soft)] hover:border-[rgba(var(--accent-rgb),0.3)] transition-all">
                <!-- 英雄图标 -->
                <div class="flex items-center gap-3 mb-2">
                  <div class="relative">
                    <div class="w-10 h-10 bg-center bg-no-repeat"
                      :class="costBorderClass(hero.cost)"
                      :style="{ backgroundImage: `url(${getHeroIcon(hero.name)})`, backgroundSize: 'cover' }"
                    ></div>
                    <div class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-gold)] rounded-full flex items-center justify-center">
                      <span class="text-white font-bold text-xs">{{ hero.cost }}</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <span class="text-white font-bold text-sm">{{ hero.name }}</span>
                    <span class="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded ml-1">{{ hero.role }}</span>
                  </div>
                </div>
                <!-- 羁绊标签 -->
                <div class="flex flex-wrap gap-1">
                  <span v-for="s in hero.synergies" :key="s" class="text-xs px-1.5 py-0.5 bg-[rgba(var(--accent-rgb),0.18)] text-[var(--accent-color)] rounded">
                    {{ s }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 羁绊效果 - 折叠式布局 -->
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-[var(--accent-color)] mb-3 flex items-center gap-2">
                <span class="text-xl">🔗</span>
                核心羁绊
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="synergyDetail in synergyDetails" :key="synergyDetail.name" 
                  class="p-3 bg-[rgba(var(--accent-rgb),0.08)] rounded-lg border border-[rgba(var(--accent-rgb),0.2)]">
                  <!-- 羁绊标题 -->
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span class="text-lg font-bold text-[var(--accent-color)]">{{ synergyDetail.count }} {{ synergyDetail.name }}</span>
                      <span class="text-xs px-1.5 py-0.5 bg-[rgba(var(--accent-rgb),0.18)] text-[var(--accent-color)] rounded">{{ synergyDetail.type }}</span>
                    </div>
                  </div>
                  
                  <!-- 当前效果 -->
                  <div class="p-2 bg-yellow-500/10 rounded border border-yellow-500/20 mb-2">
                    <p class="text-xs text-yellow-200">{{ synergyDetail.currentEffect }}</p>
                  </div>
                  
                  <!-- 层级效果 - 紧凑显示 -->
                  <div v-if="synergyDetail.levels && synergyDetail.levels.length > 0" class="flex flex-wrap gap-1">
                    <div v-for="level in synergyDetail.levels" :key="level.count"
                      :class="[
                        'px-2 py-1 rounded text-xs transition-all',
                        level.count === synergyDetail.count 
                          ? 'bg-green-500/20 border border-green-500/30 text-green-300 font-medium' 
                          : 'bg-gray-500/10 text-gray-400'
                      ]">
                      {{ level.count }}人
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 第二部分：装备推荐 -->
          <div class="hud-card p-6">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">⚔️</span>
              装备推荐
            </h2>
            
            <!-- 装备网格布局 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- 主C装备 -->
              <div v-if="teamDetail.equipment.mainC" class="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">⭐</span>
                  <h3 class="text-lg font-bold text-yellow-300">主C: {{ teamDetail.equipment.mainC.hero }}</h3>
                </div>
                <div class="space-y-2">
                  <div>
                    <span class="text-xs text-gray-400 mb-1 block">必备装备</span>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="item in teamDetail.equipment.mainC.required" :key="item" 
                        class="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                        {{ item }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-400 mb-1 block">备选装备</span>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="item in teamDetail.equipment.mainC.optional" :key="item" 
                        class="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                        {{ item }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 副C装备 -->
              <div v-if="teamDetail.equipment.subC" class="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">🎯</span>
                  <h3 class="text-lg font-bold text-blue-300">副C: {{ teamDetail.equipment.subC.hero }}</h3>
                </div>
                <div class="space-y-2">
                  <div>
                    <span class="text-xs text-gray-400 mb-1 block">必备装备</span>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="item in teamDetail.equipment.subC.required" :key="item" 
                        class="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        {{ item }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-400 mb-1 block">备选装备</span>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="item in teamDetail.equipment.subC.optional" :key="item" 
                        class="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                        {{ item }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 主坦装备 -->
              <div v-if="teamDetail.equipment.mainTank" class="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">🛡️</span>
                  <h3 class="text-lg font-bold text-green-300">主坦: {{ teamDetail.equipment.mainTank.hero }}</h3>
                </div>
                <div class="space-y-2">
                  <div>
                    <span class="text-xs text-gray-400 mb-1 block">必备装备</span>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="item in teamDetail.equipment.mainTank.required" :key="item" 
                        class="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                        {{ item }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-400 mb-1 block">备选装备</span>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="item in teamDetail.equipment.mainTank.optional" :key="item" 
                        class="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                        {{ item }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 第三部分：运营思路 -->
          <div class="hud-card p-6">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">📊</span>
              运营思路
            </h2>
            
            <!-- 时间轴布局 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- 前期 -->
              <div class="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                    <span class="text-green-300 font-bold text-sm">1</span>
                  </div>
                  <h3 class="text-lg font-bold text-green-300">前期</h3>
                  <span class="text-xs text-gray-400">2-3阶段</span>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed">{{ teamDetail.operation.early }}</p>
              </div>

              <!-- 中期 -->
              <div class="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                    <span class="text-blue-300 font-bold text-sm">2</span>
                  </div>
                  <h3 class="text-lg font-bold text-blue-300">中期</h3>
                  <span class="text-xs text-gray-400">4-5阶段</span>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed">{{ teamDetail.operation.mid }}</p>
              </div>

              <!-- 后期 -->
              <div class="p-4 bg-gradient-to-br from-[rgba(var(--accent-rgb),0.08)] to-[rgba(var(--accent-rgb),0.03)] rounded-xl border border-[rgba(var(--accent-rgb),0.2)]">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-[rgba(var(--accent-rgb),0.18)] rounded-full flex items-center justify-center">
                    <span class="text-[var(--accent-color)] font-bold text-sm">3</span>
                  </div>
                  <h3 class="text-lg font-bold text-[var(--accent-color)]">后期</h3>
                  <span class="text-xs text-gray-400">成型阶段</span>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed">{{ teamDetail.operation.late }}</p>
              </div>
            </div>
          </div>

          <!-- 第四部分：海克斯推荐 -->
          <div class="hud-card p-6">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">✨</span>
              海克斯强化推荐
            </h2>
            
            <!-- 海克斯网格布局 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- 英雄强化 -->
              <div class="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">⭐</span>
                  <h3 class="text-lg font-bold text-yellow-300">英雄强化</h3>
                </div>
                <div class="space-y-1">
                  <div v-for="augment in teamDetail.augments.hero" :key="augment" 
                    class="px-3 py-1.5 bg-yellow-500/10 rounded border border-yellow-500/20 text-xs text-gray-300">
                    {{ augment }}
                  </div>
                </div>
              </div>

              <!-- 战力类 -->
              <div class="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-xl border border-red-500/20">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">⚔️</span>
                  <h3 class="text-lg font-bold text-red-300">战力类</h3>
                </div>
                <div class="space-y-1">
                  <div v-for="augment in teamDetail.augments.combat" :key="augment" 
                    class="px-3 py-1.5 bg-red-500/10 rounded border border-red-500/20 text-xs text-gray-300">
                    {{ augment }}
                  </div>
                </div>
              </div>

              <!-- 经济类 -->
              <div class="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">💰</span>
                  <h3 class="text-lg font-bold text-blue-300">经济类</h3>
                </div>
                <div class="space-y-1">
                  <div v-for="augment in teamDetail.augments.economy" :key="augment" 
                    class="px-3 py-1.5 bg-blue-500/10 rounded border border-blue-500/20 text-xs text-gray-300">
                    {{ augment }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 第五部分：克制关系 -->
          <div class="hud-card p-6">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">⚖️</span>
              克制关系
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 优势 -->
              <div class="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xl">✅</span>
                  <h3 class="text-lg font-bold text-green-300">阵容优势</h3>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed">{{ teamDetail.counter.advantage }}</p>
              </div>

              <!-- 劣势 -->
              <div class="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-xl border border-red-500/20">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xl">⚠️</span>
                  <h3 class="text-lg font-bold text-red-300">阵容劣势</h3>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed">{{ teamDetail.counter.disadvantage }}</p>
              </div>
            </div>
          </div>

          <!-- 第六部分：实战技巧 -->
          <div class="bg-gradient-to-r from-[rgba(var(--accent-rgb),0.15)] via-[rgba(var(--gold-rgb),0.1)] to-[rgba(59,130,246,0.1)] rounded-2xl p-6 border border-[var(--line-soft)]">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">💡</span>
              <h2 class="text-2xl font-bold text-white">实战技巧</h2>
            </div>
            <p class="text-gray-300 text-base leading-relaxed">{{ teamDetail.tips }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { gameData } from '../services/gameDataService'
import { getTeamDetailById } from '../data/teamDetails'
// 羁绊详细数据（含 levels 对象数组和 effect 文本），来自 synergiesData.js
import { getSynergyByName } from '../data/synergiesData'

const getHeroIcon = (heroName) => {
  const hero = gameData.getHeroByName(heroName)
  return hero?.icon || ''
}

const route = useRoute()
const teamDetail = ref(null)
const notFound = ref(false)

const tierClass = (tier) => {
  const classes = {
    'T0': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black',
    'T0.5': 'bg-gradient-to-r from-[#c084fc] to-[#ec4899] text-white',
    'T1': 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white',
    'T2': 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
  }
  return classes[tier] || 'bg-gray-500 text-white'
}

const costBorderClass = (cost) => {
  return {
    1: 'border-2 border-gray-500/50 rounded-lg',
    2: 'border-2 border-green-500/50 rounded-lg',
    3: 'border-2 border-blue-500/50 rounded-lg',
    4: 'border-2 border-[rgba(168,85,247,0.5)] rounded-lg',
    5: 'border-2 border-yellow-500/50 rounded-lg'
  }[cost] || 'border-2 border-[rgba(168,85,247,0.3)] rounded-lg'
}

// 解析羁绊字符串，提取羁绊名称和数量
const parseSynergy = (synergyStr) => {
  const match = synergyStr.match(/^(\d+)\s+(.+)$/)
  if (match) {
    return {
      count: parseInt(match[1]),
      name: match[2]
    }
  }
  return { count: 1, name: synergyStr }
}

// 获取羁绊详情和层级效果
const getSynergyDetail = (synergyStr) => {
  const parsed = parseSynergy(synergyStr)
  const synergyData = getSynergyByName(parsed.name)
  
  if (synergyData) {
    return {
      ...parsed,
      ...synergyData,
      currentEffect: synergyData.levels.find(l => l.count === parsed.count)?.effect || ''
    }
  }
  
  return { ...parsed, levels: [], currentEffect: '' }
}

// 计算所有羁绊的详情
const synergyDetails = computed(() => {
  if (!teamDetail.value || !teamDetail.value.synergies) return []
  return teamDetail.value.synergies.map(s => getSynergyDetail(s))
})

onMounted(() => {
  const id = parseInt(route.params.id)
  teamDetail.value = getTeamDetailById(id)
  
  if (!teamDetail.value) {
    notFound.value = true
  }
})
</script>

<style scoped>
/* 添加滚动动画 */
.space-y-3 > div {
  transition: all 0.3s ease;
}

.space-y-3 > div:hover {
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.08);
}
</style>