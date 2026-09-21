<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center gap-2 mb-6">
        <button 
          @click="goBack" 
          class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
        >
          <span class="text-lg">←</span>
          返回论坛
        </button>
      </div>

      <div v-if="post" class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
        <div class="p-6 border-b border-white/10">
          <div class="flex items-center gap-4 mb-4">
            <div 
              class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              :style="{ background: getPostDisplayData()?.avatarBg }"
            >
              {{ getPostDisplayData()?.authorAvatar }}
            </div>
            <div>
              <div class="text-white font-bold">{{ getPostDisplayData()?.author }}</div>
              <div class="text-gray-500 text-sm">{{ formatTime(getPostDisplayData()?.createdAt) }}</div>
            </div>
          </div>
          
          <h1 class="text-2xl font-bold text-white mb-4">{{ getPostDisplayData()?.title }}</h1>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="tag in getPostDisplayData()?.tags" 
              :key="tag"
              class="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium"
            >
              {{ tag }}
            </span>
          </div>
          
          <div class="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {{ getPostDisplayData()?.content }}
          </div>

          <!-- 图片和视频展示 -->
          <div v-if="getPostDisplayData()?.media?.length > 0" class="mt-4 space-y-3">
            <div 
              v-for="(item, index) in getPostDisplayData().media" 
              :key="index"
              class="rounded-xl overflow-hidden border border-white/10"
              style="min-height: 200px; background: #1a1a2e;"
            >
              <!-- 图片 -->
              <img 
                v-if="item.type === 'image'"
                :src="getMediaUrl(item.url)"
                :alt="'图片 ' + (index + 1)"
                style="width: 100%; display: block; min-height: 200px; object-fit: contain;"
                @click="previewMedia(item)"
                @error="e => { e.target.alt = '加载失败: ' + getMediaUrl(item.url); e.target.style.minHeight = '40px'; e.target.style.background = '#331111'; }"
                loading="lazy"
              />
              <!-- 视频 -->
              <video 
                v-else-if="item.type === 'video'"
                :src="getMediaUrl(item.url)"
                controls
                preload="metadata"
                style="width: 100%; display: block; min-height: 200px; background: #000;"
              >
                您的浏览器不支持视频播放
              </video>
            </div>
          </div>

          <!-- 图片大图预览 -->
          <Teleport to="body">
            <div 
              v-if="previewVisible"
              class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-pointer"
              @click="previewVisible = false"
            >
              <img :src="getMediaUrl(previewItem?.url)" class="max-w-[90vw] max-h-[90vh] object-contain" loading="lazy" />
              <button 
                class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
                @click.stop="previewVisible = false"
              >✕</button>
            </div>
          </Teleport>
          
          <div class="flex items-center gap-6 mt-6 pt-6 border-t border-white/10">
            <button 
              @click="handleLike"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                getPostDisplayData()?.isLiked 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-400'
              ]"
            >
              <span class="text-xl">{{ getPostDisplayData()?.isLiked ? '❤️' : '🤍' }}</span>
              <span>{{ getPostDisplayData()?.likes }}</span>
            </button>
            
            <button class="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:bg-white/10 rounded-lg transition-colors">
              <span class="text-xl">💬</span>
              <span>{{ comments.length }}</span>
            </button>
            
            <button class="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:bg-white/10 rounded-lg transition-colors">
              <span class="text-xl">👁️</span>
              <span>{{ getPostDisplayData()?.views }}</span>
            </button>
            
            <button 
              @click="handleShare"
              class="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-green-400 rounded-lg transition-colors ml-auto"
            >
              <span class="text-xl">🔗</span>
              <span>分享</span>
            </button>
          </div>
        </div>

        <div class="p-6">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-xl">💬</span>
            评论区 ({{ comments.length }})
          </h3>
          
          <div class="bg-white/5 rounded-xl p-4 mb-6">
            <textarea 
              v-model="newComment"
              placeholder="发表你的看法..."
              class="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none"
              rows="3"
            ></textarea>
            <div class="flex justify-end mt-3">
              <button 
                @click="submitComment"
                :disabled="!newComment.trim()"
                class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
              >
                发表评论
              </button>
            </div>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="comment in comments" 
              :key="comment._id || comment.id"
              class="bg-white/5 rounded-xl p-4"
            >
              <div class="flex items-center gap-3 mb-2">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  :style="{ background: getCommentDisplayData(comment).avatarBg }"
                >
                  {{ getCommentDisplayData(comment).authorAvatar }}
                </div>
                <div class="flex-1">
                  <span class="text-white font-medium text-sm">{{ getCommentDisplayData(comment).author }}</span>
                  <span class="text-gray-500 text-xs ml-2">{{ formatTime(getCommentDisplayData(comment).createdAt) }}</span>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-3">{{ getCommentDisplayData(comment).content }}</p>
              
              <div class="flex items-center gap-6 text-sm">
                <button 
                  @click="handleCommentLike(comment._id || comment.id)"
                  :class="[
                    'flex items-center gap-1 transition-colors',
                    getCommentDisplayData(comment).isLiked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
                  ]"
                >
                  <span>{{ getCommentDisplayData(comment).isLiked ? '❤️' : '🤍' }}</span>
                  <span>{{ getCommentDisplayData(comment).likes }}</span>
                </button>
                
                <button 
                  @click="toggleReply(comment._id || comment.id)"
                  class="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <span>💬</span>
                  <span>回复</span>
                </button>
                
                <button 
                  @click="handleCommentShare(comment)"
                  class="flex items-center gap-1 text-gray-500 hover:text-green-400 transition-colors"
                >
                  <span>🔗</span>
                  <span>转发</span>
                </button>
              </div>
              
              <div v-if="replyToCommentId === (comment._id || comment.id)" class="mt-4 bg-white/5 rounded-lg p-3">
                <textarea 
                  v-model="replyContent"
                  :placeholder="`回复 ${getCommentDisplayData(comment).author}...`"
                  class="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm"
                  rows="2"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button 
                    @click="submitReply(comment._id || comment.id)"
                    :disabled="!replyContent.trim()"
                    class="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all"
                  >
                    发送回复
                  </button>
                  <button 
                    @click="toggleReply(null)"
                    class="px-4 py-1.5 ml-2 bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
              
              <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 pl-4 border-l-2 border-white/10 space-y-3">
                <div 
                  v-for="reply in comment.replies" 
                  :key="reply._id || reply.id"
                  class="bg-white/5 rounded-lg p-3"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <div 
                      class="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                      :style="{ background: getCommentDisplayData(reply).avatarBg }"
                    >
                      {{ getCommentDisplayData(reply).authorAvatar }}
                    </div>
                    <span class="text-white font-medium text-xs">{{ getCommentDisplayData(reply).author }}</span>
                    <span class="text-gray-500 text-xs">{{ formatTime(getCommentDisplayData(reply).createdAt) }}</span>
                  </div>
                  <p class="text-gray-300 text-xs ml-8">{{ getCommentDisplayData(reply).content }}</p>
                  <button 
                    @click="handleCommentLike(reply._id || reply.id)"
                    :class="[
                      'flex items-center gap-1 mt-2 ml-8 text-xs transition-colors',
                      getCommentDisplayData(reply).isLiked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
                    ]"
                  >
                    <span>{{ getCommentDisplayData(reply).isLiked ? '❤️' : '🤍' }}</span>
                    <span>{{ getCommentDisplayData(reply).likes }}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="comments.length === 0" class="text-center py-8">
              <div class="text-4xl mb-2">💭</div>
              <p class="text-gray-500">暂无评论，快来发表第一条评论吧！</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex items-center justify-center min-h-[400px]">
        <el-loading text="加载帖子详情中..." />
      </div>
      
      <el-message 
        v-if="showShareToast" 
        type="success" 
        message="链接已复制到剪贴板！" 
        :duration="2000" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForumStore } from '../stores/forum'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const forumStore = useForumStore()
const userStore = useUserStore()

const post = ref(null)
const comments = ref([])
const newComment = ref('')
const replyToCommentId = ref(null)
const redirectTimer = ref(null)
const replyContent = ref('')
const showShareToast = ref(false)
const loading = ref(true)
const previewVisible = ref(false)
const previewItem = ref(null)

// 获取完整媒体URL（开发环境走Vite代理，直接用相对路径）
const getMediaUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url // 相对路径 /uploads/... 走 Vite proxy → localhost:3000
}

const postId = computed(() => route.params.id)

// 大图预览
const previewMedia = (item) => {
  if (item.type === 'image') {
    previewItem.value = item
    previewVisible.value = true
  }
}

// 获取帖子显示数据
const getPostDisplayData = () => {
  if (!post.value) return null
  // 随机但固定的颜色
  const seed = post.value.author?.username || 'A'
  const hue = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return {
    author: post.value.author?.username || '匿名用户',
    authorAvatar: (post.value.author?.username || 'A')[0].toUpperCase(),
    avatarBg: `hsl(${hue}, 70%, 50%)`,
    title: post.value.title || '无标题',
    tags: post.value.tags || [],
    content: post.value.content || '',
    media: post.value.media || [],
    likes: post.value.likes?.length || 0,
    isLiked: post.value.likes?.some(l => 
      l._id === userStore.userInfo?._id || 
      l.id === userStore.userInfo?.id ||
      l === userStore.userInfo?.id
    ) || false,
    views: post.value.views || 0,
    createdAt: post.value.createdAt ? new Date(post.value.createdAt).getTime() : Date.now()
  }
}

// 获取评论显示数据
const getCommentDisplayData = (comment) => {
  return {
    id: comment._id || comment.id,
    author: comment.author?.username || '匿名用户',
    authorAvatar: (comment.author?.username || 'A')[0].toUpperCase(),
    avatarBg: `hsl(${Math.random() * 360}, 70%, 50%)`,
    content: comment.content || '',
    likes: comment.likes?.length || 0,
    isLiked: comment.likes?.some(l => 
      l._id === userStore.userInfo?._id || 
      l.id === userStore.userInfo?.id
    ) || false,
    createdAt: comment.createdAt ? new Date(comment.createdAt).getTime() : Date.now(),
    replies: (comment.replies || []).map(getCommentDisplayData)
  }
}

const goBack = () => {
  router.push('/forum')
}

const handleLike = async () => {
  try {
    await forumStore.likePost(postId.value)
    // 刷新帖子数据
    const data = await forumStore.fetchPostById(postId.value)
    if (data) {
      post.value = data.post
      comments.value = data.comments
    }
  } catch (error) {
    ElMessage.error('点赞失败')
  }
}

const handleCommentLike = async (commentId) => {
  try {
    await forumStore.likeComment(commentId)
    // 刷新评论
    const data = await forumStore.fetchPostById(postId.value)
    if (data) {
      comments.value = data.comments
    }
  } catch (error) {
    ElMessage.error('点赞失败')
  }
}

const toggleReply = (commentId) => {
  replyToCommentId.value = replyToCommentId.value === commentId ? null : commentId
  if (!replyToCommentId.value) {
    replyContent.value = ''
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    await forumStore.createComment(postId.value, newComment.value.trim())
    ElMessage.success('评论成功')
    newComment.value = ''
    // 刷新评论
    const data = await forumStore.fetchPostById(postId.value)
    if (data) {
      comments.value = data.comments
    }
  } catch (error) {
    ElMessage.error(error.message || '评论失败')
  }
}

const submitReply = async (parentId) => {
  if (!replyContent.value.trim()) return
  
  try {
    await forumStore.createComment(postId.value, replyContent.value.trim(), parentId)
    ElMessage.success('回复成功')
    replyContent.value = ''
    replyToCommentId.value = null
    // 刷新评论
    const data = await forumStore.fetchPostById(postId.value)
    if (data) {
      comments.value = data.comments
    }
  } catch (error) {
    ElMessage.error(error.message || '回复失败')
  }
}

const handleShare = async () => {
  const shareUrl = `${window.location.origin}/forum/${postId.value}`
  try {
    await navigator.clipboard.writeText(shareUrl)
    ElMessage.success('链接已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

const handleCommentShare = async (comment) => {
  const commentId = comment._id || comment.id
  const shareUrl = `${window.location.origin}/forum/${postId.value}#comment-${commentId}`
  try {
    await navigator.clipboard.writeText(shareUrl)
    ElMessage.success('链接已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else {
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const data = await forumStore.fetchPostById(postId.value)
    if (data) {
      post.value = data.post
      comments.value = data.comments
    } else {
      ElMessage.error('帖子不存在')
      redirectTimer.value = setTimeout(() => {
        router.push('/forum')
      }, 1500)
    }
  } catch (error) {
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (redirectTimer.value) {
    clearTimeout(redirectTimer.value)
  }
})
</script>
