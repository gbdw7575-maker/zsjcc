<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link to="/" class="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium">返回首页</span>
        </router-link>
      </div>

      <!-- 页面标题 -->
      <div class="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl p-6 border border-white/10 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <span class="text-3xl">✨</span>
              金铲铲海克斯强化符文
            </h1>
            <p class="text-gray-400">S8怪兽入侵赛季 - 官方数据</p>
          </div>
          <div class="text-sm text-gray-500">
            <span class="font-semibold text-gray-400">数据来源：</span>
            <span>金铲铲之战官方公告、虎扑游戏电竞资讯、lolchess.gg官方数据</span>
          </div>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-6">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <!-- 类型筛选 -->
          <div class="flex flex-wrap gap-2">
            <button 
              @click="currentFilter = 'all'"
              :class="currentFilter === 'all' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-purple-500/50"
            >
              全部
            </button>
            <button 
              @click="currentFilter = 'hero'"
              :class="currentFilter === 'hero' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-300'"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-yellow-500/50"
            >
              ⭐ 英雄强化
            </button>
            <button 
              @click="currentFilter = 'silver'"
              :class="currentFilter === 'silver' ? 'bg-gray-400 text-black' : 'bg-white/10 text-gray-300'"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-400/50"
            >
              🥈 银色
            </button>
            <button 
              @click="currentFilter = 'gold'"
              :class="currentFilter === 'gold' ? 'bg-yellow-600 text-black' : 'bg-white/10 text-gray-300'"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-yellow-600/50"
            >
              🥇 金色
            </button>
            <button 
              @click="currentFilter = 'prismatic'"
              :class="currentFilter === 'prismatic' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/10 text-gray-300'"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-purple-500/50"
            >
              💎 棱彩
            </button>
          </div>
          
          <!-- 强度筛选 -->
          <div class="flex gap-2">
            <button 
              @click="tierFilter = 'all'"
              :class="tierFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300'"
              class="px-2 py-1 rounded text-xs transition-all"
            >
              全部强度
            </button>
            <button 
              @click="tierFilter = 'T0'"
              :class="tierFilter === 'T0' ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300'"
              class="px-2 py-1 rounded text-xs transition-all"
            >
              T0
            </button>
            <button 
              @click="tierFilter = 'T1'"
              :class="tierFilter === 'T1' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-300'"
              class="px-2 py-1 rounded text-xs transition-all"
            >
              T1
            </button>
            <button 
              @click="tierFilter = 'T2'"
              :class="tierFilter === 'T2' ? 'bg-blue-400 text-white' : 'bg-white/10 text-gray-300'"
              class="px-2 py-1 rounded text-xs transition-all"
            >
              T2
            </button>
          </div>
        </div>
      </div>

      <!-- 英雄强化列表 -->
      <div v-if="currentFilter === 'all' || currentFilter === 'hero'" class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span class="text-3xl">⭐</span>
          英雄强化符文
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="heroAugment in filteredHeroAugments" 
            :key="heroAugment.hero"
            class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all"
          >
            <!-- 英雄信息 -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-lg">{{ heroAugment.cost }}</span>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">{{ heroAugment.hero }}</h3>
                  <p class="text-sm text-gray-400">{{ heroAugment.cost }}费英雄</p>
                </div>
              </div>
            </div>

            <!-- 强化列表 -->
            <div class="space-y-3">
              <div 
                v-for="augment in heroAugment.augments" 
                :key="augment.name"
                v-show="tierFilter === 'all' || augment.tier === tierFilter"
                class="p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-bold text-yellow-300">{{ augment.name }}</span>
                  <span :class="tierClass(augment.tier)" class="px-2 py-1 rounded text-xs font-bold">
                    {{ augment.tier }}
                  </span>
                </div>
                <div class="mb-2">
                  <span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">{{ augment.type }}</span>
                </div>
                <p class="text-sm text-gray-300 mb-2">{{ augment.effect }}</p>
                <p class="text-xs text-gray-400 mb-2">{{ augment.description }}</p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="team in augment.suitableTeams" :key="team" 
                    class="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">
                    {{ team }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 银色强化列表 -->
      <div v-if="currentFilter === 'all' || currentFilter === 'silver'" class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span class="text-3xl">🥈</span>
          银色强化符文
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="augment in filteredSilverAugments" 
            :key="augment.name"
            class="bg-gradient-to-br from-gray-400/20 to-gray-500/10 rounded-xl p-4 border border-gray-400/30 hover:border-gray-400/50 transition-all"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="font-bold text-gray-200">{{ augment.name }}</span>
              <span :class="tierClass(augment.tier)" class="px-2 py-1 rounded text-xs font-bold">
                {{ augment.tier }}
              </span>
            </div>
            <p class="text-sm text-gray-300 mb-3">{{ augment.effect }}</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="team in augment.suitableTeams" :key="team" 
                class="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-300 rounded-full">
                {{ team }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 金色强化列表 -->
      <div v-if="currentFilter === 'all' || currentFilter === 'gold'" class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span class="text-3xl">🥇</span>
          金色强化符文
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="augment in filteredGoldAugments" 
            :key="augment.name"
            class="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl p-4 border border-yellow-500/30 hover:border-yellow-500/50 transition-all"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="font-bold text-yellow-200">{{ augment.name }}</span>
              <span :class="tierClass(augment.tier)" class="px-2 py-1 rounded text-xs font-bold">
                {{ augment.tier }}
              </span>
            </div>
            <p class="text-sm text-gray-300 mb-3">{{ augment.effect }}</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="team in augment.suitableTeams" :key="team" 
                class="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full">
                {{ team }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 棱彩强化列表 -->
      <div v-if="currentFilter === 'all' || currentFilter === 'prismatic'" class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span class="text-3xl">💎</span>
          棱彩强化符文
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="augment in filteredPrismaticAugments" 
            :key="augment.name"
            class="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/10 rounded-xl p-4 border border-purple-500/30 hover:border-purple-500/50 transition-all"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="font-bold text-purple-200">{{ augment.name }}</span>
              <span :class="tierClass(augment.tier)" class="px-2 py-1 rounded text-xs font-bold">
                {{ augment.tier }}
              </span>
            </div>
            <p class="text-sm text-gray-300 mb-3">{{ augment.effect }}</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="team in augment.suitableTeams" :key="team" 
                class="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                {{ team }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据来源说明 -->
      <div class="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl p-6 border border-white/10">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">📚</span>
          <h2 class="text-xl font-bold text-white">数据来源</h2>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">
          所有海克斯强化符文数据均来自官方S8怪兽入侵赛季数据，确保与官方设定完全匹配。
          英雄强化符文包含每个英雄的专属强化，银色、金色、棱彩强化符文按照官方分类展示。
          强度评级基于实战表现和玩家反馈，适配阵容基于官方推荐和主流玩法。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { augmentsData } from '../data/augmentsData'

const currentFilter = ref('all')
const tierFilter = ref('all')

const tierClass = (tier) => {
  const classes = {
    'T0': 'bg-red-500 text-white',
    'T1': 'bg-orange-500 text-white',
    'T2': 'bg-blue-400 text-white',
    'T3': 'bg-gray-400 text-white'
  }
  return classes[tier] || 'bg-gray-500 text-white'
}

// 筛选英雄强化
const filteredHeroAugments = computed(() => {
  return augmentsData.heroAugments
})

// 筛选银色强化
const filteredSilverAugments = computed(() => {
  if (tierFilter.value === 'all') {
    return augmentsData.silverAugments
  }
  return augmentsData.silverAugments.filter(augment => augment.tier === tierFilter.value)
})

// 筛选金色强化
const filteredGoldAugments = computed(() => {
  if (tierFilter.value === 'all') {
    return augmentsData.goldAugments
  }
  return augmentsData.goldAugments.filter(augment => augment.tier === tierFilter.value)
})

// 筛选棱彩强化
const filteredPrismaticAugments = computed(() => {
  if (tierFilter.value === 'all') {
    return augmentsData.prismaticAugments
  }
  return augmentsData.prismaticAugments.filter(augment => augment.tier === tierFilter.value)
})
</script>

<style scoped>
/* 添加卡片悬停效果 */
.grid > div {
  transition: all 0.3s ease;
}

.grid > div:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>