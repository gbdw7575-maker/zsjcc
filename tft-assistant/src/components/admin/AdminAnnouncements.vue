<template>
  <div class="hud-card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-white">公告管理</h2>
      <button
        @click="openCreateDialog"
        class="px-6 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] rounded-xl"
      >
        发布公告
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="ann in announcements" :key="ann._id"
        class="bg-[var(--bg-card-hover)] rounded-lg p-4 border border-[var(--line-soft)] hover:border-[rgba(var(--accent-rgb),0.3)]">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-xs" :class="getTypeClass(ann.type)">
                {{ getTypeName(ann.type) }}
              </span>
              <span v-if="ann.isPinned" class="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                置顶
              </span>
              <h3 class="text-lg font-bold text-white">{{ ann.title }}</h3>
            </div>
            <p class="text-gray-400 text-sm line-clamp-2">{{ ann.content }}</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>发布者: {{ ann.author?.username }}</span>
              <span>{{ formatDate(ann.createdAt) }}</span>
              <span>浏览: {{ ann.viewCount }}</span>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button @click="editAnnouncement(ann)" class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
              编辑
            </button>
            <button @click="deleteAnnouncement(ann._id)" class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm">
              删除
            </button>
          </div>
        </div>
      </div>

      <div v-if="announcements.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📢</div>
        <div class="text-gray-400">暂无公告</div>
      </div>
    </div>

    <!-- 发布/编辑公告对话框 -->
    <el-dialog v-model="showAnnouncementDialog" :title="editingAnn ? '编辑公告' : '发布公告'" width="600px">
      <div class="space-y-4">
        <div>
          <label class="text-gray-400 text-sm mb-1">标题</label>
          <input v-model="annForm.title" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="公告标题" />
        </div>
        <div>
          <label class="text-gray-400 text-sm mb-1">类型</label>
          <select v-model="annForm.type" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white">
            <option value="normal">普通</option>
            <option value="important">重要</option>
            <option value="urgent">紧急</option>
          </select>
        </div>
        <div class="flex items-center gap-4">
          <input type="checkbox" v-model="annForm.isPinned" id="isPinned" class="w-5 h-5" />
          <label for="isPinned" class="text-white">置顶公告</label>
        </div>
        <div>
          <label class="text-gray-400 text-sm mb-1">内容</label>
          <textarea v-model="annForm.content" rows="6" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="公告内容..."></textarea>
        </div>
      </div>
      <template #footer>
        <button @click="showAnnouncementDialog = false" class="px-6 py-2 bg-[var(--bg-card-hover)] text-white rounded-xl">取消</button>
        <button @click="submitAnnouncement" class="px-6 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] rounded-xl">
          {{ editingAnn ? '保存' : '发布' }}
        </button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { announcementApi } from '../../services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits(['stats-changed'])

const announcements = ref([])
const showAnnouncementDialog = ref(false)
const editingAnn = ref(null)
const annForm = ref({
  title: '',
  content: '',
  type: 'normal',
  isPinned: false
})

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN')

const getTypeClass = (type) => {
  switch (type) {
    case 'urgent': return 'bg-red-500/20 text-red-400'
    case 'important': return 'bg-yellow-500/20 text-yellow-400'
    default: return 'bg-blue-500/20 text-blue-400'
  }
}

const getTypeName = (type) => {
  switch (type) {
    case 'urgent': return '紧急'
    case 'important': return '重要'
    default: return '普通'
  }
}

const loadAnnouncements = async () => {
  try {
    const { data } = await announcementApi.getAllAnnouncements()
    announcements.value = data.data
  } catch (error) {
    console.error('加载公告失败:', error)
  }
}

const openCreateDialog = () => {
  editingAnn.value = null
  annForm.value = { title: '', content: '', type: 'normal', isPinned: false }
  showAnnouncementDialog.value = true
}

const editAnnouncement = (ann) => {
  editingAnn.value = ann
  annForm.value = {
    title: ann.title,
    content: ann.content,
    type: ann.type,
    isPinned: ann.isPinned
  }
  showAnnouncementDialog.value = true
}

const submitAnnouncement = async () => {
  try {
    if (editingAnn.value) {
      await announcementApi.updateAnnouncement(editingAnn.value._id, annForm.value)
      ElMessage.success('公告已更新')
    } else {
      await announcementApi.createAnnouncement(annForm.value)
      ElMessage.success('公告已发布')
    }
    showAnnouncementDialog.value = false
    editingAnn.value = null
    annForm.value = { title: '', content: '', type: 'normal', isPinned: false }
    loadAnnouncements()
    emit('stats-changed')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteAnnouncement = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条公告吗？', '确认删除', { type: 'warning' })
    await announcementApi.deleteAnnouncement(id)
    ElMessage.success('公告已删除')
    loadAnnouncements()
    emit('stats-changed')
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(() => loadAnnouncements())
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
