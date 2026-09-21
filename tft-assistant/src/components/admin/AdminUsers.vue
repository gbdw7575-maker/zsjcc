<template>
  <div class="hud-card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-white">用户管理</h2>
      <div class="flex gap-4">
        <input
          v-model="searchQuery"
          placeholder="搜索用户名或邮箱..."
          class="px-4 py-2 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white placeholder-gray-500"
          @input="searchUsers"
        />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-gray-400 text-sm border-b border-[var(--line-soft)]">
            <th class="text-left py-3 px-4">用户</th>
            <th class="text-left py-3 px-4">邮箱</th>
            <th class="text-left py-3 px-4">角色</th>
            <th class="text-left py-3 px-4">注册时间</th>
            <th class="text-left py-3 px-4">状态</th>
            <th class="text-left py-3 px-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id" class="text-white border-b border-white/5 hover:bg-white/5">
            <td class="py-4 px-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[rgba(var(--accent-rgb),0.18)] flex items-center justify-center">
                  {{ user.username[0].toUpperCase() }}
                </div>
                <span>{{ user.username }}</span>
              </div>
            </td>
            <td class="py-4 px-4 text-gray-400">{{ user.email }}</td>
            <td class="py-4 px-4">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'">
                {{ user.role === 'admin' ? '管理员' : '用户' }}
              </span>
            </td>
            <td class="py-4 px-4 text-gray-400">{{ formatDate(user.createdAt) }}</td>
            <td class="py-4 px-4">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="user.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'">
                {{ user.isBanned ? '已封禁' : '正常' }}
              </span>
            </td>
            <td class="py-4 px-4">
              <div class="flex gap-2">
                <button
                  @click="toggleBan(user)"
                  class="px-3 py-1 text-sm rounded-lg transition-colors"
                  :class="user.isBanned
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'"
                >
                  {{ user.isBanned ? '解封' : '封禁' }}
                </button>
                <button
                  v-if="user.role !== 'admin'"
                  @click="setAdmin(user)"
                  class="px-3 py-1 bg-[rgba(var(--accent-rgb),0.12)] text-[var(--accent-color)] hover:bg-[rgba(var(--accent-rgb),0.18)] rounded-lg text-sm transition-colors"
                >
                  设为管理员
                </button>
                <button
                  @click="deleteUser(user)"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../../services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits(['stats-changed'])

const users = ref([])
const searchQuery = ref('')

const loadUsers = async () => {
  try {
    const { data } = await adminApi.getUsers({ search: searchQuery.value })
    users.value = data.data
  } catch (error) {
    console.error('加载用户失败:', error)
  }
}

const searchUsers = () => loadUsers()

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN')

const toggleBan = async (user) => {
  try {
    await ElMessageBox.confirm(
      user.isBanned ? `确定要解封用户 ${user.username} 吗？` : `确定要封禁用户 ${user.username} 吗？`,
      '确认操作',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    await adminApi.toggleUserBan(user._id)
    ElMessage.success(user.isBanned ? '已解封' : '已封禁')
    loadUsers()
    emit('stats-changed')
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('操作失败')
  }
}

const setAdmin = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要将 ${user.username} 设为管理员吗？`,
      '确认操作',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    await adminApi.updateUser(user._id, { role: 'admin' })
    ElMessage.success('已设为管理员')
    loadUsers()
    emit('stats-changed')
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('操作失败')
  }
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${user.username} 吗？此操作不可恢复！`,
      '危险操作',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'error' }
    )
    await adminApi.deleteUser(user._id)
    ElMessage.success('用户已删除')
    loadUsers()
    emit('stats-changed')
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(() => loadUsers())
</script>
