<template>
  <div class="hud-card p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-white">内容审核</h2>
        <p class="text-gray-400 text-sm mt-1">待审核帖子: {{ pendingPosts.length }}</p>
      </div>
      <button @click="loadPendingPosts" class="px-4 py-2 bg-[var(--bg-card-hover)] text-gray-300 hover:bg-[var(--bg-elevated)] rounded-xl text-sm transition-colors">
        刷新
      </button>
    </div>

    <div v-if="pendingPosts.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">✅</div>
      <div class="text-gray-400">暂无待审核内容</div>
    </div>

    <div class="space-y-4">
      <div v-for="post in pendingPosts" :key="post._id"
        class="bg-[var(--bg-card-hover)] rounded-lg p-5 border border-[var(--line-soft)] hover:border-yellow-500/30 transition-all">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-full bg-[rgba(var(--accent-rgb),0.18)] flex items-center justify-center text-sm">
                {{ post.author?.username?.[0]?.toUpperCase() }}
              </div>
              <span class="text-white font-medium">{{ post.author?.username }}</span>
              <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{{ post.category }}</span>
              <span class="text-gray-500 text-xs">{{ formatDate(post.createdAt) }}</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">{{ post.title }}</h3>
            <p class="text-gray-400 text-sm line-clamp-3 mb-3">{{ post.content }}</p>
            <div class="flex gap-2">
              <button
                @click="approvePost(post._id)"
                class="px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm transition-colors"
              >
                通过
              </button>
              <button
                @click="showRejectDialog(post)"
                class="px-4 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
              >
                拒绝
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 拒绝原因对话框 -->
    <el-dialog v-model="showRejectReason" title="拒绝理由" width="450px">
      <div>
        <label class="text-gray-400 text-sm mb-2 block">请输入拒绝原因</label>
        <textarea v-model="rejectReason" rows="3" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="拒绝原因..."></textarea>
      </div>
      <template #footer>
        <button @click="showRejectReason = false" class="px-6 py-2 bg-[var(--bg-card-hover)] text-white rounded-xl">取消</button>
        <button @click="confirmRejectPost" class="px-6 py-2 bg-red-500 text-white rounded-xl">确认拒绝</button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../../services/api'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['stats-changed'])

const pendingPosts = ref([])
const showRejectReason = ref(false)
const rejectTargetId = ref(null)
const rejectReason = ref('')

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN')

const loadPendingPosts = async () => {
  try {
    const { data } = await adminApi.getPendingPosts()
    pendingPosts.value = data.data
  } catch (error) {
    console.error('加载待审核帖子失败:', error)
  }
}

const approvePost = async (id) => {
  try {
    await adminApi.approvePost(id)
    ElMessage.success('帖子已通过审核')
    pendingPosts.value = pendingPosts.value.filter(p => p._id !== id)
    emit('stats-changed')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const showRejectDialog = (post) => {
  rejectTargetId.value = post._id
  rejectReason.value = ''
  showRejectReason.value = true
}

const confirmRejectPost = async () => {
  try {
    await adminApi.rejectPost(rejectTargetId.value, rejectReason.value)
    ElMessage.success('帖子已拒绝')
    pendingPosts.value = pendingPosts.value.filter(p => p._id !== rejectTargetId.value)
    showRejectReason.value = false
    emit('stats-changed')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => loadPendingPosts())
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
