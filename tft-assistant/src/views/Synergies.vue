<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link to="/" class="inline-flex items-center gap-2 text-[var(--accent-color)] hover:text-[var(--accent-hover)] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium">返回首页</span>
        </router-link>
        <span class="ml-4 text-sm text-gray-500">金铲铲之战 · S18苍林秘境赛季</span>
      </div>

      <!-- 页面标题 -->
      <div class="bg-gradient-to-r from-[rgba(var(--accent-rgb),0.15)] via-[rgba(var(--gold-rgb),0.1)] to-[rgba(59,130,246,0.1)] rounded-3xl p-8 border border-[var(--line-soft)] mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">
          <span class="bg-gradient-to-r from-[#4aefe0] via-[#ffc857] to-[#60a5fa] bg-clip-text text-transparent">羁绊大全</span>
        </h1>
        <p class="text-xl text-gray-300 mb-2">S18苍林秘境赛季所有羁绊效果详解</p>
        <div class="text-sm text-gray-500 mt-3">
          <span class="font-semibold text-gray-400">数据来源：</span>
          <span>金铲铲之战官方公告、虎扑游戏电竞资讯、云顶之弈数据站</span>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="mb-6 hud-card p-4">
        <div class="flex flex-wrap gap-4 items-center">
          <el-select v-model="selectedType" placeholder="选择羁绊类型" class="w-48" @change="filterSynergies">
            <el-option label="全部" value="all" />
            <el-option label="特质羁绊" value="trait" />
            <el-option label="职业羁绊" value="class" />
          </el-select>
          
          <el-input v-model="searchKeyword" placeholder="搜索羁绊名称" class="w-64" @input="filterSynergies" clearable>
            <template #prefix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
          
          <div class="text-sm text-gray-400">
            共 <span class="font-bold text-[var(--accent-color)]">{{ Object.keys(filteredTraits).length + Object.keys(filteredClasses).length }}</span> 个羁绊
          </div>
        </div>
      </div>

      <!-- 羁绊列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- 特质羁绊 -->
        <div v-for="(synergy, name) in filteredTraits" :key="'trait-' + name" 
          class="hud-card p-4 hover:border-[rgba(var(--accent-rgb),0.3)] transition-all">
          <!-- 羁绊标题 -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">✨</span>
              <h3 class="text-lg font-bold text-[var(--accent-color)]">{{ name }}</h3>
            </div>
            <span class="px-2 py-1 bg-[rgba(var(--accent-rgb),0.12)] text-[var(--accent-color)] rounded text-xs font-medium">特质</span>
          </div>
          
          <!-- 羁绊描述 -->
          <div class="mb-3 p-2 bg-blue-500/5 rounded border border-blue-500/10">
            <p class="text-xs text-gray-400">{{ synergy.description }}</p>
          </div>
          
          <!-- 层级效果 - 显示具体数值 -->
          <div class="mb-3">
            <h4 class="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
              <span class="text-sm">📊</span>
              层级效果
            </h4>
            <div class="space-y-1.5">
              <div v-for="level in synergy.levels" :key="level.count"
                class="flex items-start gap-2.5 px-2.5 py-2 bg-[rgba(var(--accent-rgb),0.08)] rounded-lg border border-[rgba(var(--accent-rgb),0.2)] transition-all hover:bg-[rgba(var(--accent-rgb),0.12)] hover:border-[rgba(var(--accent-rgb),0.4)]">
                <span class="flex-shrink-0 px-2 py-0.5 bg-[rgba(var(--accent-rgb),0.18)] rounded text-xs font-bold text-[#d9f7f2] min-w-[2.8rem] text-center leading-relaxed">
                  {{ level.count }}人
                </span>
                <span class="text-sm text-gray-200 leading-relaxed flex-1 break-words">{{ level.effect }}</span>
              </div>
            </div>
          </div>
          
          <!-- 所属英雄 - 紧凑网格 -->
          <div>
            <h4 class="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <span class="text-sm">🎮</span>
              所属英雄
            </h4>
            <div class="grid grid-cols-3 gap-1">
              <div v-for="hero in synergy.heroes" :key="hero" 
                class="flex items-center gap-1 px-1.5 py-1 bg-gray-500/10 rounded">
                <div class="w-5 h-5 bg-center bg-no-repeat"
                  :class="costBorderClass(parseHeroInfo(hero).cost)"
                  :style="{ backgroundImage: `url(${getHeroIconUrl(hero)})`, backgroundSize: 'cover' }"
                ></div>
                <span class="text-xs text-gray-300 truncate">{{ parseHeroInfo(hero).name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 职业羁绊 -->
        <div v-for="(synergy, name) in filteredClasses" :key="'class-' + name" 
          class="hud-card p-4 hover:border-blue-500/30 transition-all">
          <!-- 羁绊标题 -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">⚔️</span>
              <h3 class="text-lg font-bold text-blue-300">{{ name }}</h3>
            </div>
            <span class="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">职业</span>
          </div>
          
          <!-- 羁绊描述 -->
          <div class="mb-3 p-2 bg-blue-500/5 rounded border border-blue-500/10">
            <p class="text-xs text-gray-400">{{ synergy.description }}</p>
          </div>
          
          <!-- 层级效果 - 显示具体数值 -->
          <div class="mb-3">
            <h4 class="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
              <span class="text-sm">📊</span>
              层级效果
            </h4>
            <div class="space-y-1.5">
              <div v-for="level in synergy.levels" :key="level.count"
                class="flex items-start gap-2.5 px-2.5 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 transition-all hover:bg-blue-500/20 hover:border-blue-500/40">
                <span class="flex-shrink-0 px-2 py-0.5 bg-blue-500/30 rounded text-xs font-bold text-blue-100 min-w-[2.8rem] text-center leading-relaxed">
                  {{ level.count }}人
                </span>
                <span class="text-sm text-gray-200 leading-relaxed flex-1 break-words">{{ level.effect }}</span>
              </div>
            </div>
          </div>
          
          <!-- 所属英雄 - 紧凑网格 -->
          <div>
            <h4 class="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <span class="text-sm">🎮</span>
              所属英雄
            </h4>
            <div class="grid grid-cols-3 gap-1">
              <div v-for="hero in synergy.heroes" :key="hero" 
                class="flex items-center gap-1 px-1.5 py-1 bg-gray-500/10 rounded">
                <div class="w-5 h-5 bg-center bg-no-repeat"
                  :class="costBorderClass(parseHeroInfo(hero).cost)"
                  :style="{ backgroundImage: `url(${getHeroIconUrl(hero)})`, backgroundSize: 'cover' }"
                ></div>
                <span class="text-xs text-gray-300 truncate">{{ parseHeroInfo(hero).name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="Object.keys(filteredTraits).length === 0 && Object.keys(filteredClasses).length === 0" 
        class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-xl text-gray-400">未找到匹配的羁绊</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { synergiesData } from '../data/synergiesData'
import { gameData } from '../services/gameDataService'

// 英雄数据和图标查询走 gameData（动态来源）
const getHeroIcon = (heroName) => {
  const hero = gameData.getHeroByName(heroName)
  return hero?.icon || ''
}

const selectedType = ref('all')
const searchKeyword = ref('')

// 解析英雄名称和费用（格式：英雄名(费用)）
const parseHeroInfo = (heroStr) => {
  const match = heroStr.match(/(.+)\((\d+)\)/)
  if (match) {
    return {
      name: match[1],
      cost: parseInt(match[2])
    }
  }
  return { name: heroStr, cost: 1 }
}

const costBorderClass = (cost) => {
  return {
    1: 'border-2 border-gray-500/50 rounded',
    2: 'border-2 border-green-500/50 rounded',
    3: 'border-2 border-blue-500/50 rounded',
    4: 'border-2 border-[rgba(168,85,247,0.5)] rounded',
    5: 'border-2 border-yellow-500/50 rounded'
  }[cost] || 'border-2 border-gray-500/30 rounded'
}

// 获取英雄图标URL
const getHeroIconUrl = (heroStr) => {
  const heroInfo = parseHeroInfo(heroStr)
  return getHeroIcon(heroInfo.name)
}

// 筛选特质羁绊
const filteredTraits = computed(() => {
  let traits = synergiesData.traits
  
  // 根据类型筛选
  if (selectedType.value === 'class') {
    return {}
  }
  
  // 根据关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    traits = Object.fromEntries(
      Object.entries(traits).filter(([name]) => 
        name.toLowerCase().includes(keyword)
      )
    )
  }
  
  return traits
})

// 筛选职业羁绊
const filteredClasses = computed(() => {
  let classes = synergiesData.classes
  
  // 根据类型筛选
  if (selectedType.value === 'trait') {
    return {}
  }
  
  // 根据关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    classes = Object.fromEntries(
      Object.entries(classes).filter(([name]) => 
        name.toLowerCase().includes(keyword)
      )
    )
  }
  
  return classes
})

const filterSynergies = () => {
  // 筛选逻辑已在 computed 中实现
}
</script>

<style scoped>
/* 添加卡片悬停效果 */
.bg-white\/5:hover {
  transform: translateY(-5px);
}

/* 添加层级效果卡片动画 */
.space-y-1\.5 > div {
  transition: all 0.2s ease;
}

.space-y-1\.5 > div:hover {
  transform: translateX(3px);
}
</style>
