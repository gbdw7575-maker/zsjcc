<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div class="max-w-2xl mx-auto px-4 py-6">
      <!-- 返回按钮 -->
      <div class="flex items-center gap-2 mb-6">
        <button 
          @click="goBack" 
          class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
        >
          <span class="text-lg">←</span>
          返回论坛
        </button>
      </div>

      <!-- 发布表单 -->
      <div class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <h1 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span class="text-2xl">✏️</span>
          发布新帖子
        </h1>
        
        <form @submit.prevent="submitPost" class="space-y-4">
          <!-- 标题 -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">标题</label>
            <input 
              v-model="postForm.title"
              type="text"
              placeholder="输入帖子标题..."
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            />
          </div>
          
          <!-- 内容 -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">内容</label>
            <textarea 
              v-model="postForm.content"
              placeholder="分享你的想法、攻略或问题..."
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              rows="6"
              required
            ></textarea>
          </div>
          
          <!-- 标签 -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">标签</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="tag in availableTags" 
                :key="tag"
                type="button"
                @click="toggleTag(tag)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  postForm.tags.includes(tag)
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                ]"
              >
                {{ tag }}
              </button>
            </div>
            <input 
              v-model="customTag"
              type="text"
              placeholder="添加自定义标签..."
              class="w-full mt-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              @keyup.enter.prevent="addCustomTag"
            />
          </div>

          <!-- 图片/视频上传 -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">
              图片/视频 <span class="text-gray-500 text-xs">(可选，最多9个，支持jpg/png/gif/webp/mp4)</span>
            </label>
            <!-- 拖拽上传区 -->
            <div 
              v-if="uploadFiles.length < 9"
              class="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all"
              @click="$refs.fileInput.click()"
              @dragover.prevent="dragOver = true"
              @dragleave.prevent="dragOver = false"
              @drop.prevent="onDrop"
              :class="{ 'border-purple-500/50 bg-purple-500/5': dragOver }"
            >
              <input 
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg"
                multiple
                class="hidden"
                @change="onFileChange"
              />
              <div class="text-4xl mb-2">{{ dragOver ? '📂' : '🖼️' }}</div>
              <p class="text-gray-400 text-sm">{{ dragOver ? '松开即可上传' : '拖拽文件到此处 或 点击选择' }}</p>
              <p class="text-gray-500 text-xs mt-1">支持图片和视频，单个文件最大 100MB</p>
            </div>

            <!-- 已选文件预览 -->
            <div v-if="uploadFiles.length > 0" class="grid grid-cols-3 gap-3 mt-3">
              <div 
                v-for="(file, index) in uploadFiles" 
                :key="index"
                class="relative aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/10 group"
              >
                <!-- 图片预览 -->
                <img 
                  v-if="file.type.startsWith('image/')"
                  :src="file.preview"
                  class="w-full h-full object-cover"
                />
                <!-- 视频预览 -->
                <video 
                  v-else-if="file.type.startsWith('video/')"
                  :src="file.preview"
                  class="w-full h-full object-cover"
                  muted
                ></video>
                <!-- 文件类型标签 -->
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                  {{ file.type.startsWith('video/') ? '🎬 视频' : '📷 图片' }}
                </span>
                <!-- 文件大小 -->
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded text-xs bg-black/60 text-gray-300 backdrop-blur-sm">
                  {{ formatFileSize(file.size) }}
                </span>
                <!-- 删除按钮 -->
                <button 
                  type="button"
                  @click="removeFile(index)"
                  class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span class="text-white text-2xl font-bold">✕</span>
                </button>
              </div>
            </div>

            <!-- 上传错误提示 -->
            <p v-if="uploadError" class="text-red-400 text-xs mt-2">{{ uploadError }}</p>
          </div>
          
          <!-- 预览 -->
          <div v-if="postForm.title || postForm.content || uploadFiles.length > 0" class="bg-white/5 rounded-xl p-4">
            <h3 class="text-gray-400 text-sm font-medium mb-2">预览</h3>
            <h4 class="text-white font-bold">{{ postForm.title || '标题预览' }}</h4>
            <p class="text-gray-400 text-sm mt-2 whitespace-pre-wrap">{{ postForm.content || '内容预览...' }}</p>
            <!-- 文件预览 -->
            <div v-if="uploadFiles.length > 0" class="grid grid-cols-3 gap-2 mt-3">
              <div v-for="(file, i) in uploadFiles" :key="i" class="aspect-video rounded-lg overflow-hidden bg-black/30 border border-white/5">
                <img v-if="file.type.startsWith('image/')" :src="file.preview" class="w-full h-full object-cover" />
                <video v-else :src="file.preview" class="w-full h-full object-cover" muted />
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <span 
                v-for="tag in postForm.tags" 
                :key="tag"
                class="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- 提交按钮 -->
          <div class="flex items-center justify-between pt-4">
            <span class="text-gray-500 text-sm">
              {{ postForm.content.length }} 字
              <template v-if="uploadFiles.length > 0"> · {{ uploadFiles.length }} 个文件</template>
            </span>
            <button 
              type="submit"
              :disabled="!isFormValid || isUploading"
              class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30"
            >
              {{ isUploading ? '发布中...' : '发布帖子' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForumStore } from '../stores/forum'
import { useUserStore } from '../stores/user'

const router = useRouter()
const forumStore = useForumStore()
const userStore = useUserStore()

const postForm = ref({
  title: '',
  content: '',
  tags: []
})

const customTag = ref('')
const uploadFiles = ref([])
const dragOver = ref(false)
const uploadError = ref('')
const isUploading = ref(false)

const MAX_FILES = 9
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg']

const availableTags = [
  '阵容推荐', '攻略分享', '运营思路', '海克斯', '羁绊',
  '讨论交流', '组队招募', '版本资讯', '新手攻略', '避坑指南',
  'S8', '机甲怪兽', '地下魔盗团', '福牛守护者', '至高天'
]

const isFormValid = computed(() => {
  return postForm.value.title.trim() && postForm.value.content.trim()
})

const goBack = () => {
  router.push('/forum')
}

const toggleTag = (tag) => {
  const index = postForm.value.tags.indexOf(tag)
  if (index === -1) {
    if (postForm.value.tags.length < 3) {
      postForm.value.tags.push(tag)
    }
  } else {
    postForm.value.tags.splice(index, 1)
  }
}

const addCustomTag = () => {
  const tag = customTag.value.trim()
  if (tag && !postForm.value.tags.includes(tag) && postForm.value.tags.length < 3) {
    postForm.value.tags.push(tag)
    customTag.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return '不支持的文件类型：' + file.name
  }
  if (file.size > MAX_FILE_SIZE) {
    return '文件过大（最大100MB）：' + file.name
  }
  return null
}

const addFiles = (files) => {
  uploadError.value = ''
  const remaining = MAX_FILES - uploadFiles.value.length
  const toAdd = Array.from(files).slice(0, remaining)

  for (const file of toAdd) {
    const err = validateFile(file)
    if (err) {
      uploadError.value = err
      continue
    }
    // 去重
    if (uploadFiles.value.some(f => f.name === file.name && f.size === file.size)) continue
    
    file.preview = URL.createObjectURL(file)
    uploadFiles.value.push(file)
  }

  if (files.length > remaining) {
    uploadError.value = `最多上传${MAX_FILES}个文件，已自动截取前${remaining}个`
  }
}

const onFileChange = (e) => {
  addFiles(e.target.files)
  e.target.value = ''
}

const onDrop = (e) => {
  dragOver.value = false
  addFiles(e.dataTransfer.files)
}

const removeFile = (index) => {
  const file = uploadFiles.value[index]
  if (file.preview) URL.revokeObjectURL(file.preview)
  uploadFiles.value.splice(index, 1)
  uploadError.value = ''
}

const submitPost = async () => {
  if (!isFormValid.value || isUploading.value) return
  
  isUploading.value = true
  const user = userStore.userInfo

  try {
    const formData = new FormData()
    formData.append('title', postForm.value.title.trim())
    formData.append('content', postForm.value.content.trim())
    formData.append('category', '杂谈')
    postForm.value.tags.forEach(tag => formData.append('tags[]', tag))
    
    // 添加文件
    uploadFiles.value.forEach((file, index) => {
      formData.append('files', file, file.name)
    })

    await forumStore.createPost(formData)
    
    // 清理预览 URL
    uploadFiles.value.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview)
    })
    
    router.push('/forum')
  } catch (error) {
    uploadError.value = error.message || '发布失败，请稍后再试'
  } finally {
    isUploading.value = false
  }
}
</script>
