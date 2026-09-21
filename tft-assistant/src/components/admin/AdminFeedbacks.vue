<template>
  <div class="hud-card p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-white">反馈管理</h2>
        <p class="text-gray-400 text-sm mt-1">共 {{ feedbackTotal }} 条反馈</p>
      </div>
      <div class="flex gap-3">
        <select v-model="feedbackFilter.status" @change="loadFeedbacks" class="px-3 py-2 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white text-sm">
          <option value="">全部状态</option>
          <option value="pending">待处理</option>
          <option value="processing">处理中</option>
          <option value="resolved">已解决</option>
          <option value="closed">已关闭</option>
        </select>
        <select v-model="feedbackFilter.type" @change="loadFeedbacks" class="px-3 py-2 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white text-sm">
          <option value="">全部类型</option>
          <option value="bug">Bug报告</option>
          <option value="feature">功能建议</option>
          <option value="improvement">改进意见</option>
          <option value="other">其他</option>
        </select>
        <button @click="loadFeedbacks" class="px-4 py-2 bg-[var(--bg-card-hover)] text-gray-300 hover:bg-[var(--bg-elevated)] rounded-xl text-sm">
          刷新
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="fb in feedbacks" :key="fb._id"
        class="bg-[var(--bg-card-hover)] rounded-lg p-5 border border-[var(--line-soft)]" :class="{'border-red-500/30': fb.status === 'pending'}">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="px-2 py-0.5 rounded text-xs" :class="getFeedbackTypeClass(fb.type)">
                {{ getFeedbackTypeName(fb.type) }}
              </span>
              <span class="px-2 py-0.5 rounded text-xs" :class="getFeedbackStatusClass(fb.status)">
                {{ getFeedbackStatusName(fb.status) }}
              </span>
              <span class="px-2 py-0.5 rounded text-xs" :class="getFeedbackPriorityClass(fb.priority)">
                {{ getFeedbackPriorityName(fb.priority) }}
              </span>
              <span class="text-gray-500 text-xs">{{ formatDate(fb.createdAt) }}</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">{{ fb.title }}</h3>
            <p class="text-gray-400 text-sm mb-2">{{ fb.description }}</p>
            <div class="text-gray-500 text-xs mb-3">
              提交者: {{ fb.author?.username }} ({{ fb.author?.email }})
            </div>
            <div v-if="fb.adminReply" class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-3">
              <div class="text-blue-400 text-xs mb-1">管理员回复:</div>
              <div class="text-gray-300 text-sm">{{ fb.adminReply }}</div>
            </div>
            <!-- 回复表单 -->
            <div class="flex gap-2 mt-3">
              <input
                v-model="replyTexts[fb._id]"
                placeholder="输入回复内容..."
                class="flex-1 px-3 py-2 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white text-sm placeholder-gray-500"
              />
              <button
                @click="replyFeedback(fb._id)"
                class="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm transition-colors"
              >
                回复
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-2 ml-4">
            <select
              :value="fb.status"
              @change="updateFeedbackStatus(fb._id, $event.target.value)"
              class="px-3 py-1.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white text-xs"
            >
              <option value="pending">待处理</option>
              <option value="processing">处理中</option>
              <option value="resolved">已解决</option>
              <option value="closed">已关闭</option>
            </select>
            <select
              :value="fb.priority"
              @change="updateFeedbackPriority(fb._id, $event.target.value)"
              class="px-3 py-1.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white text-xs"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
            <button
              @click="deleteFeedback(fb._id)"
              class="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="feedbacks.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">💬</div>
      <div class="text-gray-400">暂无反馈</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { feedbackApi } from '../../services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits(['stats-changed'])

const feedbacks = ref([])
const feedbackTotal = ref(0)
const replyTexts = ref({})
const feedbackFilter = reactive({ status: '', type: '' })

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN')

const getFeedbackTypeClass = (type) => {
  const map = { bug: 'bg-red-500/20 text-red-400', feature: 'bg-green-500/20 text-green-400', improvement: 'bg-blue-500/20 text-blue-400', other: 'bg-gray-500/20 text-gray-400' }
  return map[type] || 'bg-gray-500/20 text-gray-400'
}

const getFeedbackTypeName = (type) => {
  const map = { bug: 'Bug报告', feature: '功能建议', improvement: '改进意见', other: '其他' }
  return map[type] || type
}

const getFeedbackStatusClass = (status) => {
  const map = { pending: 'bg-yellow-500/20 text-yellow-400', processing: 'bg-blue-500/20 text-blue-400', resolved: 'bg-green-500/20 text-green-400', closed: 'bg-gray-500/20 text-gray-400' }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}

const getFeedbackStatusName = (status) => {
  const map = { pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭' }
  return map[status] || status
}

const getFeedbackPriorityClass = (priority) => {
  const map = { high: 'bg-red-500/20 text-red-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-gray-500/20 text-gray-400' }
  return map[priority] || 'bg-gray-500/20 text-gray-400'
}

const getFeedbackPriorityName = (priority) => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[priority] || priority
}

const loadFeedbacks = async () => {
  try {
    const params = {}
    if (feedbackFilter.status) params.status = feedbackFilter.status
    if (feedbackFilter.type) params.type = feedbackFilter.type
    const { data } = await feedbackApi.getAll(params)
    feedbacks.value = data.data
    feedbackTotal.value = data.pagination?.total || 0
  } catch (error) {
    console.error('加载反馈失败:', error)
    const msg = error?.response?.data?.message || '加载反馈失败，请确保以管理员身份登录'
    ElMessage.error(msg)
  }
}

const replyFeedback = async (id) => {
  const reply = replyTexts.value[id]
  if (!reply) {
    ElMessage.warning('请输入回复内容')
    return
  }
  try {
    await feedbackApi.reply(id, { adminReply: reply })
    ElMessage.success('已回复')
    replyTexts.value[id] = ''
    loadFeedbacks()
    emit('stats-changed')
  } catch (error) {
    ElMessage.error('回复失败')
  }
}

const updateFeedbackStatus = async (id, status) => {
  try {
    await feedbackApi.updateStatus(id, { status })
    ElMessage.success('状态已更新')
    loadFeedbacks()
    emit('stats-changed')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const updateFeedbackPriority = async (id, priority) => {
  try {
    await feedbackApi.updateStatus(id, { priority })
    ElMessage.success('优先级已更新')
    loadFeedbacks()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteFeedback = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条反馈吗？', '确认删除', { type: 'warning' })
    await feedbackApi.delete(id)
    ElMessage.success('反馈已删除')
    loadFeedbacks()
    emit('stats-changed')
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(() => loadFeedbacks())
</script>
