<template>
  <div class="min-h-screen p-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">意见反馈</h1>
        <p class="text-gray-400 mt-2">告诉我们你的想法，帮助我们做得更好</p>
      </div>

      <!-- 反馈表单 -->
      <div class="hud-card p-6 mb-8">
        <h2 class="text-xl font-bold text-white mb-4">提交反馈</h2>
        <div class="space-y-4">
          <div>
            <label class="text-gray-400 text-sm mb-1 block">反馈类型</label>
            <select v-model="form.type" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white">
              <option value="bug">Bug 报告</option>
              <option value="feature">功能建议</option>
              <option value="improvement">改进意见</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1 block">标题</label>
            <input v-model="form.title" placeholder="简要描述你的反馈" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white placeholder-gray-500" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1 block">详细描述</label>
            <textarea v-model="form.description" rows="5" placeholder="请详细描述你的问题或建议..." class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white placeholder-gray-500"></textarea>
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1 block">优先级</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input type="radio" v-model="form.priority" value="low" class="w-4 h-4" />
                <span>低</span>
              </label>
              <label class="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input type="radio" v-model="form.priority" value="medium" class="w-4 h-4" />
                <span>中</span>
              </label>
              <label class="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input type="radio" v-model="form.priority" value="high" class="w-4 h-4" />
                <span>高</span>
              </label>
            </div>
          </div>
          <button 
            @click="submitFeedback"
            :disabled="submitting"
            class="px-8 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] rounded-xl font-medium disabled:opacity-50"
          >
            {{ submitting ? '提交中...' : '提交反馈' }}
          </button>
        </div>
      </div>

      <!-- 我的反馈列表 -->
      <div class="hud-card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white">我的反馈</h2>
          <button @click="loadMyFeedbacks" class="px-4 py-2 bg-[var(--bg-card-hover)] text-gray-300 hover:bg-[var(--bg-elevated)] rounded-xl text-sm">
            刷新
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="fb in myFeedbacks" :key="fb._id" 
            class="bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)]">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 rounded text-xs" :class="getTypeClass(fb.type)">
                    {{ getTypeName(fb.type) }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-xs" :class="getStatusClass(fb.status)">
                    {{ getStatusName(fb.status) }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-xs" :class="getPriorityClass(fb.priority)">
                    {{ getPriorityName(fb.priority) }}
                  </span>
                  <span class="text-gray-500 text-xs">{{ formatDate(fb.createdAt) }}</span>
                </div>
                <h3 class="text-lg font-bold text-white mb-1">{{ fb.title }}</h3>
                <p class="text-gray-400 text-sm mb-2">{{ fb.description }}</p>
                <div v-if="fb.adminReply" class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
                  <div class="text-blue-400 text-xs mb-1">管理员回复:</div>
                  <div class="text-gray-300 text-sm">{{ fb.adminReply }}</div>
                  <div class="text-gray-500 text-xs mt-1">{{ formatDate(fb.updatedAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="myFeedbacks.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📝</div>
          <div class="text-gray-400">暂无反馈记录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { feedbackApi } from '../services/api'
import { ElMessage } from 'element-plus'

const form = ref({
  type: 'bug',
  title: '',
  description: '',
  priority: 'medium'
})

const submitting = ref(false)
const myFeedbacks = ref([])

const submitFeedback = async () => {
  if (!form.value.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  if (!form.value.description.trim()) {
    ElMessage.warning('请输入详细描述')
    return
  }
  submitting.value = true
  try {
    await feedbackApi.create(form.value)
    ElMessage.success('感谢你的反馈！')
    form.value = { type: 'bug', title: '', description: '', priority: 'medium' }
    loadMyFeedbacks()
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || '提交失败，请稍后重试'
    ElMessage.error(msg)
  } finally {
    submitting.value = false
  }
}

const loadMyFeedbacks = async () => {
  try {
    const { data } = await feedbackApi.getMy()
    myFeedbacks.value = data.data
  } catch (error) {
    console.error('加载反馈失败:', error)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getTypeClass = (type) => {
  const map = { bug: 'bg-red-500/20 text-red-400', feature: 'bg-green-500/20 text-green-400', improvement: 'bg-blue-500/20 text-blue-400', other: 'bg-gray-500/20 text-gray-400' }
  return map[type] || 'bg-gray-500/20 text-gray-400'
}

const getTypeName = (type) => {
  const map = { bug: 'Bug报告', feature: '功能建议', improvement: '改进意见', other: '其他' }
  return map[type] || type
}

const getStatusClass = (status) => {
  const map = { pending: 'bg-yellow-500/20 text-yellow-400', processing: 'bg-blue-500/20 text-blue-400', resolved: 'bg-green-500/20 text-green-400', closed: 'bg-gray-500/20 text-gray-400' }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}

const getStatusName = (status) => {
  const map = { pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭' }
  return map[status] || status
}

const getPriorityClass = (priority) => {
  const map = { high: 'bg-red-500/20 text-red-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-gray-500/20 text-gray-400' }
  return map[priority] || 'bg-gray-500/20 text-gray-400'
}

const getPriorityName = (priority) => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[priority] || priority
}

onMounted(() => {
  loadMyFeedbacks()
})
</script>
