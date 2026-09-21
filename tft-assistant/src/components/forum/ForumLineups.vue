<template>
  <div class="lineup-wrap">
    <div class="filter-bar lineup-bar">
      <div class="lineup-sort">
        <span class="sort-label">排序</span>
        <button
          v-for="sort in lineupSortOptions"
          :key="sort.value"
          @click="lineupSort = sort.value"
          :class="['sort-link', { 'is-active': lineupSort === sort.value }]"
        >
          {{ sort.label }}
        </button>
      </div>
      <div class="lineup-bar-right">
        <span class="count-text">共 {{ lineups.length }} 套阵容</span>
        <button class="share-lineup-btn" @click="showCreateLineup = true">
          ✨ 分享阵容
        </button>
      </div>
    </div>

    <div class="lineup-grid">
      <div v-if="lineupLoading" class="state-box">
        <div class="state-text">加载中...</div>
      </div>
      <template v-else>
        <div
          v-for="lineup in sortedLineups"
          :key="lineup._id"
          class="lineup-card"
        >
          <div class="lineup-head">
            <div class="lineup-author">
              <div
                class="avatar small"
                :style="avatarStyleFor(lineup.author?.username)"
              >
                {{ initialFor(lineup.author?.username) }}
              </div>
              <div>
                <h3 class="lineup-title">{{ lineup.title }}</h3>
                <span class="lineup-author-name">{{ lineup.author?.username || '匿名用户' }}</span>
              </div>
            </div>
            <div class="tag-row">
              <span
                v-for="tag in (lineup.tags || []).slice(0, 3)"
                :key="tag"
                class="tag-pill"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 英雄展示 -->
          <div class="hero-row">
            <div
              v-for="(hero, idx) in (lineup.heroes || []).slice(0, 8)"
              :key="idx"
              class="hero-chip"
            >
              <span class="hero-name">{{ hero.heroName || hero.heroId }}</span>
              <span class="hero-star">{{ '⭐'.repeat(hero.star || 1) }}</span>
              <span v-if="(hero.items || []).length > 0" class="hero-items">{{ hero.items.join(' ') }}</span>
            </div>
          </div>

          <p class="lineup-desc">{{ lineup.description }}</p>

          <div class="lineup-meta">
            <div class="meta-right">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {{ lineup.views || 0 }}
              </span>
              <span
                class="meta-item like"
                :class="{ liked: (lineup.likes?.length || 0) > 0 }"
                @click="handleLikeLineup(lineup)"
              >
                <svg v-if="(lineup.likes?.length || 0) > 0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-8-5-9.5-10A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5C20 16 12 21 12 21z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21s-8-5-9.5-10A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5C20 16 12 21 12 21z"/>
                </svg>
                {{ lineup.likes?.length || 0 }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>
                </svg>
                {{ (lineup.comments || []).length }}
              </span>
            </div>
            <button class="comment-toggle" @click="toggleLineupComment(lineup)">
              评论
            </button>
          </div>

          <!-- 评论区 -->
          <div v-if="expandedLineupId === lineup._id" class="comment-area">
            <div v-if="(lineup.comments || []).length > 0" class="comment-list">
              <div
                v-for="(comment, cIdx) in lineup.comments"
                :key="cIdx"
                class="comment-item"
              >
                <div class="comment-head">
                  <span class="comment-author">{{ comment.author?.username || '用户' }}</span>
                  <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
              </div>
            </div>
            <div class="comment-input-row">
              <el-input
                v-model="lineupCommentContent[lineup._id]"
                placeholder="写下你的评论..."
                size="small"
                class="flex-1"
                @keyup.enter="submitLineupComment(lineup)"
              />
              <button
                class="comment-send"
                @click="submitLineupComment(lineup)"
              >
                发送
              </button>
            </div>
          </div>
        </div>

        <div v-if="lineups.length === 0" class="state-box full-width">
          <div class="empty-emoji">🛡️</div>
          <h3 class="empty-title">暂无阵容分享</h3>
          <p class="empty-sub">快来分享你的强力阵容吧！</p>
        </div>
      </template>
    </div>

    <!-- 创建阵容弹窗 -->
    <el-dialog v-model="showCreateLineup" :close-on-click-modal="false" class="lineup-dialog">
      <template #header>
        <span class="dialog-title">✨ 分享新阵容</span>
      </template>
      <el-form :model="createLineupForm" label-position="top">
        <el-form-item label="阵容名称" required>
          <el-input v-model="createLineupForm.title" placeholder="如：机甲精英" maxlength="100" />
        </el-form-item>
        <el-form-item label="阵容描述" required>
          <el-input v-model="createLineupForm.description" type="textarea" :rows="3" placeholder="描述阵容核心玩法..." maxlength="5000" />
        </el-form-item>
        <el-form-item label="英雄配置">
          <div class="hero-config">
            <div v-for="(hero, idx) in createLineupForm.heroes" :key="idx" class="hero-config-row">
              <el-input v-model="hero.heroId" placeholder="英雄ID" size="small" class="cfg-id" />
              <el-input v-model="hero.heroName" placeholder="名称" size="small" class="cfg-name" />
              <el-select v-model="hero.star" size="small" class="cfg-star">
                <el-option v-for="n in 5" :key="n" :label="'⭐'.repeat(n)" :value="n" />
              </el-select>
              <el-input v-model="hero.itemsStr" placeholder="装备(空格分隔)" size="small" class="cfg-items" @change="updateHeroItems(idx)" />
              <button class="cfg-remove" @click="removeHero(idx)">✕</button>
            </div>
            <button class="add-hero-btn" @click="addHero">+ 添加英雄</button>
          </div>
        </el-form-item>
        <el-form-item label="站位描述">
          <el-input v-model="createLineupForm.positioning" type="textarea" :rows="2" placeholder="描述棋子站位（如：前排左1放盖伦...）" maxlength="1000" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="createLineupForm.tagsStr" placeholder="多个标签用逗号分隔，如：机甲,前排" maxlength="200" />
        </el-form-item>
      </el-form>
      <template #footer>
        <button class="dialog-cancel" @click="showCreateLineup = false">取消</button>
        <button
          class="dialog-confirm"
          :disabled="!createLineupForm.title || !createLineupForm.description"
          @click="submitCreateLineup"
        >
          发布
        </button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { lineupApi } from '../../services/api'
import { ElMessage } from 'element-plus'
import { avatarStyleFor, initialFor, formatTime } from '../../utils/forumHelpers'

const lineups = ref([])
const lineupLoading = ref(false)
const lineupSort = ref('latest')
const showCreateLineup = ref(false)
const expandedLineupId = ref(null)
const lineupCommentContent = ref({})

const lineupSortOptions = [
  { label: '最新发布', value: 'latest' },
  { label: '最多点赞', value: 'likes' }
]

const sortedLineups = computed(() => {
  const arr = [...lineups.value]
  if (lineupSort.value === 'likes') {
    return arr.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
  }
  return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const createLineupForm = ref({
  title: '',
  description: '',
  heroes: [{ heroId: '', heroName: '', star: 1, itemsStr: '', items: [] }],
  positioning: '',
  tagsStr: ''
})

const addHero = () => {
  createLineupForm.value.heroes.push({ heroId: '', heroName: '', star: 1, itemsStr: '', items: [] })
}

const removeHero = (idx) => {
  if (createLineupForm.value.heroes.length > 1) {
    createLineupForm.value.heroes.splice(idx, 1)
  }
}

const updateHeroItems = (idx) => {
  const hero = createLineupForm.value.heroes[idx]
  hero.items = (hero.itemsStr || '').split(/\s+/).filter(Boolean)
}

const submitCreateLineup = async () => {
  if (!createLineupForm.value.title || !createLineupForm.value.description) return
  try {
    const heroes = createLineupForm.value.heroes.map(h => ({
      heroId: h.heroId,
      heroName: h.heroName || h.heroId,
      star: h.star,
      items: h.items || []
    }))
    const tags = (createLineupForm.tagsStr || '').split(',').map(t => t.trim()).filter(Boolean)

    await lineupApi.createLineup({
      title: createLineupForm.value.title,
      description: createLineupForm.value.description,
      heroes,
      positioning: createLineupForm.value.positioning,
      tags
    })

    ElMessage.success('阵容分享成功！')
    showCreateLineup.value = false
    createLineupForm.value = {
      title: '',
      description: '',
      heroes: [{ heroId: '', heroName: '', star: 1, itemsStr: '', items: [] }],
      positioning: '',
      tagsStr: ''
    }
    await fetchLineups()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '分享失败')
  }
}

const fetchLineups = async () => {
  lineupLoading.value = true
  try {
    const { data } = await lineupApi.getLineups({ limit: 20, sort: lineupSort.value })
    lineups.value = data.data || []
  } catch (error) {
    console.error('获取阵容失败:', error)
    lineups.value = []
  } finally {
    lineupLoading.value = false
  }
}

const handleLikeLineup = async (lineup) => {
  try {
    const { data } = await lineupApi.likeLineup(lineup._id)
    lineup.likes = data.data?.likes || []
  } catch (error) {
    ElMessage.error('操作失败，请先登录')
  }
}

const toggleLineupComment = async (lineup) => {
  if (expandedLineupId.value === lineup._id) {
    expandedLineupId.value = null
    return
  }
  expandedLineupId.value = lineup._id
  if (!lineupCommentContent.value[lineup._id]) {
    lineupCommentContent.value[lineup._id] = ''
  }
  try {
    const { data } = await lineupApi.getComments(lineup._id)
    lineup.comments = data.data || []
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

const submitLineupComment = async (lineup) => {
  const content = lineupCommentContent.value[lineup._id]?.trim()
  if (!content) return
  try {
    const { data } = await lineupApi.addComment(lineup._id, { content })
    if (!lineup.comments) lineup.comments = []
    lineup.comments.push(data.data)
    lineupCommentContent.value[lineup._id] = ''
    ElMessage.success('评论成功')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '评论失败')
  }
}

onMounted(() => {
  fetchLineups()
})
</script>
