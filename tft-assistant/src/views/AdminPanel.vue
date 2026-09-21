<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">管理中心</h1>
          <p class="text-gray-400 mt-2">管理用户、发布公告、数据统计</p>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <div class="hud-card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">👥</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">总用户数</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalUsers }}</div>
            </div>
          </div>
        </div>
        <div class="hud-card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">📝</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">总帖子数</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalPosts }}</div>
            </div>
          </div>
        </div>
        <div class="hud-card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">⏳</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">待审核</div>
              <div class="text-2xl font-bold text-white">{{ stats.pendingPosts }}</div>
            </div>
          </div>
        </div>
        <div class="hud-card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">📢</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">公告数</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalAnnouncements }}</div>
            </div>
          </div>
        </div>
        <div class="hud-card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-[rgba(var(--accent-rgb),0.12)] rounded-xl flex items-center justify-center">
              <span class="text-2xl">🟢</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">今日活跃</div>
              <div class="text-2xl font-bold text-white">{{ stats.todayActive || 0 }}</div>
            </div>
          </div>
        </div>
        <div class="hud-card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">💬</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">反馈待处理</div>
              <div class="text-2xl font-bold text-white">{{ stats.unprocessedFeedbacks || 0 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="flex gap-4 mb-6 flex-wrap">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-6 py-3 rounded-xl font-medium transition-all"
          :class="activeTab === tab.value
            ? 'bg-[var(--accent-color)] text-[#03201d]'
            : 'bg-[var(--bg-card-hover)] text-gray-400 hover:bg-[var(--bg-elevated)]'"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <!-- 5 个 tab 由独立子组件承载，v-if 实现按需挂载（切换 tab 时才拉数据）-->
      <AdminUsers
        v-if="activeTab === 'users'"
        @stats-changed="loadStats"
      />
      <AdminReview
        v-else-if="activeTab === 'review'"
        @stats-changed="loadStats"
      />
      <AdminAnnouncements
        v-else-if="activeTab === 'announcements'"
        @stats-changed="loadStats"
      />
      <AdminMaintenance
        v-else-if="activeTab === 'maintenance'"
        :stats="stats"
        @stats-changed="loadStats"
      />
      <AdminFeedbacks
        v-else-if="activeTab === 'feedbacks'"
        @stats-changed="loadStats"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../services/api'
import AdminUsers from '../components/admin/AdminUsers.vue'
import AdminReview from '../components/admin/AdminReview.vue'
import AdminAnnouncements from '../components/admin/AdminAnnouncements.vue'
import AdminMaintenance from '../components/admin/AdminMaintenance.vue'
import AdminFeedbacks from '../components/admin/AdminFeedbacks.vue'

const activeTab = ref('users')
const tabs = [
  { label: '用户管理', value: 'users', icon: '👥' },
  { label: '内容审核', value: 'review', icon: '🔍' },
  { label: '公告管理', value: 'announcements', icon: '📢' },
  { label: '数据维护', value: 'maintenance', icon: '🛠️' },
  { label: '反馈管理', value: 'feedbacks', icon: '💬' }
]

const stats = ref({
  totalUsers: 0,
  totalPosts: 0,
  totalAnnouncements: 0,
  activeUsers: 0,
  todayActive: 0,
  unprocessedFeedbacks: 0
})

const loadStats = async () => {
  try {
    const { data } = await adminApi.getStats()
    stats.value = data.data
  } catch (error) {
    console.error('加载统计失败:', error)
  }
}

onMounted(() => loadStats())
</script>
