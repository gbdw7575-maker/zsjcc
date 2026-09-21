<template>
  <div class="space-y-6">
    <!-- 游戏数据概览 -->
    <div class="hud-card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-white">游戏数据概览</h2>
          <p class="text-gray-400 text-sm mt-1">当前活跃版本的数据统计</p>
        </div>
        <button @click="$router.push('/admin/game-data')" class="px-4 py-2 bg-[rgba(var(--accent-rgb),0.12)] text-[var(--accent-color)] hover:bg-[rgba(var(--accent-rgb),0.18)] rounded-xl text-sm transition-colors">
          进入数据维护 →
        </button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)] text-center">
          <div class="text-3xl mb-2">🎯</div>
          <div class="text-2xl font-bold text-white">{{ stats.totalTeams || 0 }}</div>
          <div class="text-gray-400 text-sm">推荐阵容</div>
        </div>
        <div class="bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)] text-center">
          <div class="text-3xl mb-2">⚔️</div>
          <div class="text-2xl font-bold text-white">{{ stats.totalEquipments || 0 }}</div>
          <div class="text-gray-400 text-sm">装备数据</div>
        </div>
        <div class="bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)] text-center">
          <div class="text-3xl mb-2">🔗</div>
          <div class="text-2xl font-bold text-white">{{ stats.totalSynergies || 0 }}</div>
          <div class="text-gray-400 text-sm">羁绊数据</div>
        </div>
        <div class="bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)] text-center">
          <div class="text-3xl mb-2">👤</div>
          <div class="text-2xl font-bold text-white">{{ stats.totalHeroes || 0 }}</div>
          <div class="text-gray-400 text-sm">英雄数据</div>
        </div>
      </div>
    </div>

    <!-- 阵容数据管理 -->
    <div class="hud-card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-white">阵容数据管理</h2>
          <p class="text-gray-400 text-sm mt-1">查看、置顶推荐、删除不当阵容</p>
        </div>
        <button @click="loadTeams" class="px-4 py-2 bg-[var(--bg-card-hover)] text-gray-300 hover:bg-[var(--bg-elevated)] rounded-xl text-sm transition-colors">
          刷新
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full" v-if="teams.length > 0">
          <thead>
            <tr class="text-gray-400 text-sm border-b border-[var(--line-soft)]">
              <th class="text-left py-3 px-4">阵容名称</th>
              <th class="text-left py-3 px-4">版本</th>
              <th class="text-left py-3 px-4">类型</th>
              <th class="text-left py-3 px-4">状态</th>
              <th class="text-left py-3 px-4">创建时间</th>
              <th class="text-left py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in teams" :key="team._id" class="text-white border-b border-white/5 hover:bg-white/5">
              <td class="py-3 px-4">
                <span class="font-medium">{{ team.data?.name || team.data?.title || '未命名阵容' }}</span>
              </td>
              <td class="py-3 px-4 text-gray-400">{{ team.version || '-' }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{{ team.type }}</span>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-xs" :class="team.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'">
                  {{ team.isActive ? '推荐中' : '未推荐' }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-400 text-sm">{{ formatDate(team.createdAt) }}</td>
              <td class="py-3 px-4">
                <div class="flex gap-2">
                  <button
                    @click="toggleTeamPin(team)"
                    class="px-3 py-1 rounded-lg text-sm transition-colors"
                    :class="team.isActive
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'"
                  >
                    {{ team.isActive ? '取消推荐' : '置顶推荐' }}
                  </button>
                  <button
                    @click="deleteTeam(team)"
                    class="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="teams.length === 0" class="text-center py-8 text-gray-400">
        暂无阵容数据
      </div>
    </div>

    <!-- 系统维护 -->
    <div class="hud-card p-6">
      <h2 class="text-xl font-bold text-white mb-4">系统维护</h2>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)]">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🗑️</span>
            <div>
              <div class="text-white font-medium">清除被拒帖子</div>
              <div class="text-gray-400 text-sm">永久删除所有被拒绝的帖子</div>
            </div>
          </div>
          <button
            @click="clearCache('rejected_posts')"
            :disabled="cacheClearing"
            class="px-6 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {{ cacheClearing ? '处理中...' : '清除被拒帖子' }}
          </button>
        </div>
        <div class="flex-1 bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)]">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🧹</span>
            <div>
              <div class="text-white font-medium">清除未激活数据</div>
              <div class="text-gray-400 text-sm">删除所有已取消推荐的版本数据</div>
            </div>
          </div>
          <button
            @click="clearCache('inactive_data')"
            :disabled="cacheClearing"
            class="px-6 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {{ cacheClearing ? '处理中...' : '清除未激活数据' }}
          </button>
        </div>
        <div class="flex-1 bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)]">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">📊</span>
            <div>
              <div class="text-white font-medium">系统数据统计</div>
              <div class="text-gray-400 text-sm">查看当前系统运行状况</div>
            </div>
          </div>
          <div class="text-gray-400 text-sm space-y-1">
            <div class="flex justify-between">
              <span>总用户数</span>
              <span class="text-white">{{ stats.totalUsers }}</span>
            </div>
            <div class="flex justify-between">
              <span>总帖子数</span>
              <span class="text-white">{{ stats.totalPosts }}</span>
            </div>
            <div class="flex justify-between">
              <span>待审核</span>
              <span class="text-white">{{ stats.pendingPosts }}</span>
            </div>
            <div class="flex justify-between">
              <span>今日活跃</span>
              <span class="text-white">{{ stats.todayActive || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../../services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['stats-changed'])

const teams = ref([])
const cacheClearing = ref(false)

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN')

const loadTeams = async () => {
  try {
    const { data } = await adminApi.getAllTeams()
    teams.value = data.data
  } catch (error) {
    console.error('加载阵容失败:', error)
  }
}

const toggleTeamPin = async (team) => {
  try {
    await adminApi.updateTeam(team._id, { isActive: !team.isActive })
    ElMessage.success(team.isActive ? '已取消推荐' : '已置顶推荐')
    loadTeams()
    emit('stats-changed')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteTeam = async (team) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除阵容 "${team.data?.name || team.data?.title || '未命名'}" 吗？`,
      '确认删除',
      { type: 'warning' }
    )
    await adminApi.deleteTeam(team._id)
    ElMessage.success('阵容已删除')
    loadTeams()
    emit('stats-changed')
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败')
  }
}

const clearCache = async (type) => {
  try {
    await ElMessageBox.confirm(
      type === 'rejected_posts' ? '确定要永久删除所有被拒绝的帖子吗？此操作不可恢复！' : '确定要删除所有未激活的版本数据吗？此操作不可恢复！',
      '危险操作',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'error' }
    )
    cacheClearing.value = true
    const { data } = await adminApi.clearCache(type)
    ElMessage.success(data.message)
    loadTeams()
    emit('stats-changed')
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('清除失败')
  } finally {
    cacheClearing.value = false
  }
}

onMounted(() => loadTeams())
</script>
