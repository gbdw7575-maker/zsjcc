<template>
  <div class="min-h-screen">
    <section class="py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6">
            <span class="text-purple-400 text-sm font-medium">金铲铲之战 · S8怪兽入侵</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
            <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">掌上金铲铲</span>
          </h1>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">金铲铲之战专业辅助平台 · S8怪兽入侵赛季官方数据</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <router-link to="/teamfight" class="feature-card group">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <span class="text-3xl">⚔️</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">阵容模拟器</h3>
            <p class="text-gray-400">拖拽棋子到棋盘，实时查看羁绊效果，打造最强阵容</p>
            <div class="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
              <span>开始模拟</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </router-link>
          
          <router-link to="/equipment" class="feature-card group">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <span class="text-3xl">🔧</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">装备合成</h3>
            <p class="text-gray-400">查看装备合成路径，了解装备属性，合理分配装备</p>
            <div class="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
              <span>查看装备</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </router-link>
          
          <router-link to="/pool" class="feature-card group">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <span class="text-3xl">🎯</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">卡池概率</h3>
            <p class="text-gray-400">追踪共享卡池，计算D牌概率，精准判断搜卡时机</p>
            <div class="mt-6 flex items-center text-green-400 group-hover:text-green-300 transition-colors">
              <span>开始追踪</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </router-link>
          
          <router-link to="/economy" class="feature-card group">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
              <span class="text-3xl">💰</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">经济计算器</h3>
            <p class="text-gray-400">实时计算利息、升级成本，精准规划每回合经济运营</p>
            <div class="mt-6 flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
              <span>开始计算</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </router-link>
          
          <router-link to="/augments" class="feature-card group">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
              <span class="text-3xl">⭐</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">海克斯强化</h3>
            <p class="text-gray-400">查看所有海克斯强化符文，了解强度评级和适配阵容</p>
            <div class="mt-6 flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
              <span>查看海克斯</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </router-link>
          
          <router-link to="/synergies" class="feature-card group">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <span class="text-3xl">🔗</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">羁绊大全</h3>
            <p class="text-gray-400">查看所有羁绊效果，了解羁绊层级和所属英雄</p>
            <div class="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
              <span>查看羁绊</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </router-link>
        </div>
        
        <!-- 系统公告 -->
        <div v-if="announcements.length > 0" class="mb-16">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-2">
              <span>📢</span> 系统公告
            </h2>
          </div>
          <div class="space-y-4">
            <div 
              v-for="ann in announcements" 
              :key="ann._id"
              class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all"
              :class="ann.isPinned ? 'border-l-4 border-l-yellow-500' : ''"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <span v-if="ann.isPinned" class="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">置顶</span>
                    <span class="px-2 py-0.5 rounded text-xs font-medium" :class="typeBadgeClass(ann.type)">
                      {{ typeLabel(ann.type) }}
                    </span>
                    <h3 class="text-lg font-bold text-white">{{ ann.title }}</h3>
                  </div>
                  <p class="text-gray-400 text-sm line-clamp-2 mb-3">{{ ann.content }}</p>
                  <div class="flex items-center gap-3 text-xs text-gray-500">
                    <span>发布者: {{ ann.author?.username }}</span>
                    <span>{{ formatDate(ann.createdAt) }}</span>
                    <span>浏览: {{ ann.viewCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 版本更新提示 -->
        <div class="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl p-8 border border-white/10 mb-16">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">S8怪兽入侵赛季返场</h2>
              <p class="text-gray-400">英雄强化、机甲羁绊、地下魔盗团，经典赛季重磅回归</p>
            </div>
            <el-tooltip content="点击查看金铲铲之战官方怪兽入侵赛季更新公告" placement="top">
              <el-button type="primary" @click="openUpdateDetails" class="bg-gradient-to-r from-purple-500 to-pink-500 border-none px-8 py-3 rounded-xl font-semibold cursor-pointer">
                查看更新详情 →
              </el-button>
            </el-tooltip>
          </div>
        </div>
        
        <!-- 热门阵容推荐 -->
        <div>
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-bold text-white">热门阵容推荐</h2>
            <router-link to="/teamfight" class="text-purple-400 hover:text-purple-300 font-medium">查看全部 →</router-link>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <template v-for="team in hotTeams" :key="team.id">
              <router-link 
                v-if="team.id"
                :to="`/team/${team.id}`"
                class="team-card group cursor-pointer block"
              >
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-white">{{ team.name }}</span>
                <span :class="tierClass(team.tier)" class="px-3 py-1 rounded-full text-sm font-bold">{{ team.tier }}</span>
              </div>
              <p class="text-gray-400 text-sm mb-4">{{ team.description }}</p>
              <div class="mt-4 pt-4 border-t border-white/10">
                <div class="flex flex-wrap gap-1">
                  <span v-for="hero in team.champions.slice(0, 6)" :key="hero" class="text-xs text-gray-400">{{ hero }}</span>
                  <span v-if="team.champions.length > 6" class="text-xs text-gray-600">+{{ team.champions.length - 6 }}</span>
                </div>
              </div>
            </router-link>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { gameData } from '../services/gameDataService'
import { announcementApi } from '../services/api'

const hotTeams = computed(() => (gameData.metaTeams.value || []).slice(0, 8))
const announcements = ref([])

const tierClass = (tier) => {
  const classes = {
    'S': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black',
    'A': 'bg-gradient-to-r from-purple-400 to-pink-500 text-white',
    'B': 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white',
    'C': 'bg-gray-500 text-white',
    'T0': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black',
    'T0.5': 'bg-gradient-to-r from-purple-400 to-pink-500 text-white',
    'T1': 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
  }
  return classes[tier] || 'bg-gray-500 text-white'
}

const typeBadgeClass = (type) => {
  switch (type) {
    case 'urgent': return 'bg-red-500/20 text-red-400'
    case 'important': return 'bg-yellow-500/20 text-yellow-400'
    default: return 'bg-blue-500/20 text-blue-400'
  }
}

const typeLabel = (type) => {
  switch (type) {
    case 'urgent': return '紧急'
    case 'important': return '重要'
    default: return '普通'
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadAnnouncements = async () => {
  try {
    const { data } = await announcementApi.getAnnouncements()
    announcements.value = data.data
  } catch (error) {
    console.error('加载公告失败:', error)
  }
}

// 打开版本更新详情
const openUpdateDetails = () => {
  // 打开金铲铲之战官方S8怪兽入侵返场公告（实时更新）
  window.open('https://www.taptap.cn/moment/816001859008335622?group_id=213275', '_blank')
}

onMounted(() => {
  loadAnnouncements()
})
</script>

<style scoped>
.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
  transform: translateY(-5px);
}

.team-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}

.team-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
  transform: translateY(-5px);
}
</style>
