<template>
  <div>
    <!-- 筛选区域 -->
    <div class="filter-bar">
      <div class="filter-row">
        <div class="chip-row">
          <button
            v-for="category in forumStore.categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="['f-chip', { 'is-active': selectedCategory === category.id }]"
          >
            <span>{{ category.icon }}</span>
            {{ category.name }}
          </button>
        </div>

        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索帖子标题..."
            clearable
          >
            <template #prefix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <div class="sort-row">
        <span class="sort-label">排序</span>
        <button
          v-for="sort in sortOptions"
          :key="sort.value"
          @click="selectedSort = sort.value"
          :class="['sort-link', { 'is-active': selectedSort === sort.value }]"
        >
          {{ sort.label }}
        </button>
        <span class="count-text">共 {{ displayPosts.length }} 篇帖子</span>
      </div>
    </div>

    <div class="post-list">
      <div v-if="loading" class="state-box">
        <div class="state-text">加载中...</div>
      </div>

      <template v-else>
        <div
          v-for="post in displayPosts"
          :key="post._id || post.id"
          class="post-card"
          @click="goToPost(post)"
        >
          <div class="post-main">
            <div
              class="avatar"
              :style="avatarStyleFor(post.author?.username)"
            >
              {{ initialFor(post.author?.username) }}
            </div>

            <div class="post-content">
              <div class="post-head">
                <h3 class="post-title">{{ post.title || '无标题' }}</h3>
                <div class="tag-row">
                  <span
                    v-for="tag in (post.tags || []).slice(0, 2)"
                    :key="tag"
                    class="tag-pill"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <p class="post-excerpt">{{ post.content || '' }}</p>

              <div class="post-meta">
                <div class="meta-left">
                  <span>{{ post.author?.username || '匿名用户' }}</span>
                  <span class="meta-time">{{ formatTime(post.createdAt) }}</span>
                </div>

                <div class="meta-right">
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {{ post.views || 0 }}
                  </span>
                  <span
                    class="meta-item like"
                    :class="{ liked: (post.likes?.length || 0) > 0 }"
                    @click.stop="handleLike(post)"
                  >
                    <svg v-if="(post.likes?.length || 0) > 0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21s-8-5-9.5-10A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5C20 16 12 21 12 21z"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 21s-8-5-9.5-10A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5C20 16 12 21 12 21z"/>
                    </svg>
                    {{ post.likes?.length || 0 }}
                  </span>
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>
                    </svg>
                    {{ post.commentCount || 0 }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 帖子缩略图 -->
            <div
              v-if="post.media && post.media.length > 0 && post.media[0].type === 'image'"
              class="post-thumb"
              @click.stop="goToPost(post)"
            >
              <img
                :src="getPostThumbnail(post)"
                class="thumb-img"
                alt="帖子图片"
              />
            </div>
            <div
              v-else-if="post.media && post.media.length > 0 && post.media[0].type === 'video'"
              class="post-thumb thumb-video"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="m10 9 5 3-5 3V9z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>

        <div v-if="displayPosts.length === 0" class="state-box">
          <div class="empty-emoji">📭</div>
          <h3 class="empty-title">暂无帖子</h3>
          <p class="empty-sub">快来发布第一篇帖子吧！</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForumStore } from '../../stores/forum'
import { ElMessage } from 'element-plus'
import {
  avatarStyleFor,
  initialFor,
  getPostThumbnail,
  formatTime
} from '../../utils/forumHelpers'

const router = useRouter()
const forumStore = useForumStore()

// 筛选/搜索/排序
const selectedCategory = ref('all')
const searchKeyword = ref('')
const selectedSort = ref('latest')
const loading = ref(false)

const sortOptions = [
  { label: '最新发布', value: 'latest' },
  { label: '最多点赞', value: 'likes' },
  { label: '最多评论', value: 'comments' },
  { label: '最多浏览', value: 'views' }
]

const displayPosts = computed(() => {
  let result = [...forumStore.posts]

  if (selectedCategory.value !== 'all') {
    result = result.filter(post => post.category === selectedCategory.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(post =>
      (post.title && post.title.toLowerCase().includes(keyword)) ||
      (post.content && post.content.toLowerCase().includes(keyword))
    )
  }

  switch (selectedSort.value) {
    case 'likes':
      result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      break
    case 'comments':
      result.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
      break
    case 'views':
      result.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return result
})

const goToPost = (post) => {
  const id = post._id || post.id
  if (!id) {
    ElMessage.error('帖子信息异常')
    return
  }
  router.push(`/forum/${id}`)
}

const handleLike = async (post) => {
  const postId = post._id || post.id
  await forumStore.likePost(postId)
}

onMounted(async () => {
  loading.value = true
  try {
    await forumStore.fetchPosts()
  } catch (error) {
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
})
</script>
