<template>
  <div class="home">
    <!-- ============ Hero ============ -->
    <section class="hero">
      <div class="hero-grid">
        <!-- 左侧竖排赛季标 -->
        <div class="hero-side">
          <span class="hero-side-text">SEASON&nbsp;{{ seasonBadge }}</span>
          <span class="hero-side-line"></span>
        </div>

        <div class="hero-main">
          <div class="hero-badge animate-fade-up">
            <i class="hero-badge-dot"></i>
            <span>金铲铲之战 · {{ seasonLabel }} · 数据实时同步</span>
          </div>

          <h1 class="hero-title animate-fade-up" style="animation-delay:.08s">
            <span class="hero-title-cn">掌上金铲铲</span>
            <span class="hero-title-en">TFT COMPANION</span>
          </h1>

          <p class="hero-desc animate-fade-up" style="animation-delay:.16s">
            阵容模拟 / 卡池概率 / 经济运营 / 战绩复盘 —— 为每一局登顶提供数据支撑
          </p>

          <div class="hero-actions animate-fade-up" style="animation-delay:.24s">
            <router-link to="/teamfight" class="hud-btn hud-btn--primary">
              开始模拟
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </router-link>
            <router-link to="/record" class="hud-btn">我的战绩</router-link>
          </div>

          <!-- 数据条 -->
          <div class="hero-stats animate-fade-up" style="animation-delay:.32s">
            <div class="hero-stat">
              <span class="stat-num">{{ heroStats.heroes }}</span>
              <span class="hero-stat-label">英雄</span>
            </div>
            <span class="hero-stat-sep"></span>
            <div class="hero-stat">
              <span class="stat-num">{{ heroStats.synergies }}</span>
              <span class="hero-stat-label">羁绊</span>
            </div>
            <span class="hero-stat-sep"></span>
            <div class="hero-stat">
              <span class="stat-num">{{ heroStats.teams }}</span>
              <span class="hero-stat-label">阵容</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部扫描线 -->
      <div class="hero-scanline"></div>
    </section>

    <!-- ============ 功能入口 ============ -->
    <section class="block">
      <div class="block-head">
        <h2 class="section-title text-xl">核心工具</h2>
        <span class="chip">TOOLS / 06</span>
      </div>

      <div class="feature-grid">
        <router-link
          v-for="(f, i) in features"
          :key="f.to"
          :to="f.to"
          class="feature hud-card animate-fade-up"
          :style="{ animationDelay: `${0.05 * i}s` }"
        >
          <span class="feature-index">0{{ i + 1 }}</span>
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path :d="f.icon" />
            </svg>
          </div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
          <span class="feature-go">
            进入
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </router-link>
      </div>
    </section>

    <!-- ============ 系统公告 ============ -->
    <section class="block" v-if="announcements.length > 0">
      <div class="block-head">
        <h2 class="section-title text-xl">系统公告</h2>
        <span class="chip chip--gold">ANNOUNCEMENT</span>
      </div>
      <div class="ann-list">
        <div
          v-for="ann in announcements"
          :key="ann._id"
          class="ann hud-card"
          :class="{ 'ann--pin': ann.isPinned }"
        >
          <div class="ann-tags">
            <span v-if="ann.isPinned" class="chip chip--gold">置顶</span>
            <span class="chip" :class="annTypeChip(ann.type)">{{ typeLabel(ann.type) }}</span>
          </div>
          <h3 class="ann-title">{{ ann.title }}</h3>
          <p class="ann-content">{{ ann.content }}</p>
          <div class="ann-meta">
            <span>{{ ann.author?.username }}</span>
            <span>{{ formatDate(ann.createdAt) }}</span>
            <span>浏览 {{ ann.viewCount }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 赛季横幅 ============ -->
    <section class="block">
      <div class="season-banner">
        <div class="season-glyph">{{ seasonBadge }}</div>
        <div class="season-info">
          <h2>{{ seasonTitle }}</h2>
          <p>{{ seasonSubtitle }}</p>
        </div>
        <button class="hud-btn hud-btn--gold" @click="openUpdateDetails">
          更新详情
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M9 7h8v8"/></svg>
        </button>
      </div>
    </section>

    <!-- ============ 热门阵容 ============ -->
    <section class="block">
      <div class="block-head">
        <h2 class="section-title text-xl">热门阵容推荐</h2>
        <router-link to="/teamfight" class="block-more">
          查看全部
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </router-link>
      </div>
      <div class="team-grid">
        <template v-for="(team, i) in hotTeams" :key="team.id">
          <router-link
            v-if="team.id"
            :to="`/team/${team.id}`"
            class="team hud-card animate-fade-up"
            :style="{ animationDelay: `${0.05 * i}s` }"
          >
            <div class="team-head">
              <span class="team-name">{{ team.name }}</span>
              <span class="chip" :class="tierChipClass(team.tier)">{{ team.tier }}</span>
            </div>
            <p class="team-desc">{{ team.description }}</p>
            <div class="team-champions">
              <span v-for="hero in team.champions.slice(0, 6)" :key="hero" class="team-champion">{{ hero }}</span>
              <span v-if="team.champions.length > 6" class="team-champion team-champion--more">+{{ team.champions.length - 6 }}</span>
            </div>
          </router-link>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { gameData } from '../services/gameDataService'
import { announcementApi } from '../services/api'

const hotTeams = computed(() => (gameData.metaTeams.value || []).slice(0, 8))
const announcements = ref([])

// B5: 赛季动态渲染
// currentVersion 形如 "S8 怪兽入侵（本地数据）" / 后端 version 字段；currentSeason 形如 "S8"
const seasonBadge = computed(() => {
  // 取 season 数字部分，如 "S8" → "08"；无 season 时回退到 version 解析
  const s = gameData.currentSeason.value
  if (s) {
    const m = /S(\d+)/i.exec(s)
    return m ? String(m[1]).padStart(2, '0') : s
  }
  // 回退：从 currentVersion 取数字
  const v = gameData.currentVersion.value || ''
  const m2 = /S(\d+)/i.exec(v)
  return m2 ? String(m2[1]).padStart(2, '0') : '08'
})

// HeroBadge 文案：S8 怪兽入侵（如有），无 season 显示 currentVersion
const seasonLabel = computed(() => {
  if (gameData.currentSeason.value) {
    // 若 version 中已包含赛季名（如 "S8 怪兽入侵"），直接用 version；否则用 season
    const v = gameData.currentVersion.value || ''
    if (v && v.toUpperCase().includes(gameData.currentSeason.value.toUpperCase())) return v
    return gameData.currentSeason.value
  }
  return gameData.currentVersion.value || 'S8 怪兽入侵'
})

// 赛季横幅标题
const seasonTitle = computed(() => {
  const v = gameData.currentVersion.value || ''
  // 提取 "S8 怪兽入侵" 中的 "怪兽入侵"
  const m = /S\d+\s*([^\n（(]+)/.exec(v)
  return m ? `${m[1].trim()}赛季` : '怪兽入侵赛季返场'
})

// 赛季横幅副标题（保持品牌文案，未来可由后端 announcement 配置）
const seasonSubtitle = computed(() => {
  if (gameData.fromFallback.value) {
    return '英雄强化、机甲羁绊、地下魔盗团 —— 经典赛季重磅回归'
  }
  return '当前赛季数据已同步，阵容 / 装备 / 羁绊实时更新'
})

// Hero 数据计数，数据加载后响应式更新
const heroStats = computed(() => ({
  heroes: (gameData.heroes.value || []).length,
  synergies: (gameData.synergies.value || []).length,
  teams: (gameData.metaTeams.value || []).length
}))

// 功能入口（SVG path，统一 24x24 线性图标）
const features = [
  {
    to: '/teamfight',
    title: '阵容模拟器',
    desc: '拖拽棋子到棋盘，实时查看羁绊，打造最强阵容',
    icon: 'M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2'
  },
  {
    to: '/equipment',
    title: '装备合成',
    desc: '查看合成路径与属性，合理分配每件装备',
    icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z'
  },
  {
    to: '/pool',
    title: '卡池概率',
    desc: '追踪共享卡池，计算 D 牌概率，判断搜卡时机',
    icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0v20M2 12h20'
  },
  {
    to: '/economy',
    title: '经济计算器',
    desc: '实时计算利息与升级成本，规划每回合运营',
    icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'
  },
  {
    to: '/augments',
    title: '海克斯强化',
    desc: '全部强化符文，强度评级与适配阵容一览',
    icon: 'M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17l-6 3.4 1.4-6.8L2.2 9l6.9-.7L12 2z'
  },
  {
    to: '/synergies',
    title: '羁绊大全',
    desc: '所有羁绊效果、层级与所属英雄查询',
    icon: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1'
  }
]

// 阵容评级配色（金 = 顶级，青 = 主流，灰 = 一般）
const tierChipClass = (tier) => {
  if (['S', 'T0', 'T0.5'].includes(tier)) return 'chip--gold'
  if (['A', 'T1'].includes(tier)) return 'chip--accent'
  return ''
}

const annTypeChip = (type) => {
  if (type === 'urgent') return 'chip--danger'
  if (type === 'important') return 'chip--gold'
  return ''
}

const typeLabel = (type) => {
  switch (type) {
    case 'urgent': return '紧急'
    case 'important': return '重要'
    default: return '普通'
  }
}

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN')

const loadAnnouncements = async () => {
  try {
    // B6: 拉公告时传当前 season（后端返回该赛季 + 全赛季通用）
    const params = {}
    if (gameData.currentSeason.value) {
      params.season = gameData.currentSeason.value
    }
    const { data } = await announcementApi.getAnnouncements(params)
    announcements.value = data.data
  } catch (error) {
    console.error('加载公告失败:', error)
  }
}

const openUpdateDetails = () => {
  window.open('https://www.taptap.cn/moment/816001859008335622?group_id=213275', '_blank')
}

// B6: 赛季切换后重新拉公告（onMounted + watch season）
watch(() => gameData.currentSeason.value, () => loadAnnouncements())

onMounted(() => loadAnnouncements())
</script>

<style scoped>
.home {
  padding-bottom: 64px;
}

/* ================= Hero ================= */
.hero {
  position: relative;
  padding: 72px 0 56px;
  overflow: hidden;
}
.hero-grid {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 36px;
}
.hero-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-top: 10px;
}
.hero-side-text {
  writing-mode: vertical-rl;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.35em;
  color: var(--text-tertiary);
}
.hero-side-line {
  flex: 1;
  width: 1px;
  background: linear-gradient(180deg, var(--accent-color), transparent);
  opacity: 0.6;
}
.hero-main {
  flex: 1;
  min-width: 0;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 28px;
}
.hero-badge span {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}
.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.9);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  50% { opacity: 0.35; }
}
.hero-title {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hero-title-cn {
  font-size: clamp(40px, 6vw, 62px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: 0.04em;
  color: var(--text-primary);
}
.hero-title-en {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(14px, 1.6vw, 18px);
  letter-spacing: 0.42em;
  color: var(--accent-color);
  opacity: 0.85;
}
.hero-desc {
  font-size: 15px;
  color: var(--text-secondary);
  max-width: 560px;
  line-height: 1.7;
  margin-bottom: 32px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 44px;
}
.hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
}
.hero-stat {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.hero-stat .stat-num {
  font-size: 30px;
  color: var(--text-primary);
}
.hero-stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 0.1em;
}
.hero-stat-sep {
  width: 1px;
  height: 22px;
  background: var(--line-strong);
}
.hero-scanline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 10%, rgba(var(--accent-rgb), 0.4) 50%, transparent 90%);
}

/* ================= 通用区块 ================= */
.block {
  max-width: 1152px;
  margin: 0 auto;
  padding: 36px 24px 0;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}
.block-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}
.block-more:hover { color: var(--accent-color); }
.block-more svg { width: 14px; height: 14px; }

/* ================= 功能卡 ================= */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.feature {
  padding: 26px;
  text-decoration: none;
  overflow: hidden;
}
.feature:hover {
  transform: translateY(-3px);
}
.feature-index {
  position: absolute;
  top: 14px;
  right: 18px;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  letter-spacing: 0.15em;
}
.feature-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--accent-rgb), 0.35);
  background: rgba(var(--accent-rgb), 0.07);
  margin-bottom: 18px;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
.feature-icon svg {
  width: 21px;
  height: 21px;
  color: var(--accent-color);
}
.feature-title {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.feature-desc {
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-secondary);
  margin-bottom: 18px;
}
.feature-go {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
}
.feature-go svg {
  width: 13px;
  height: 13px;
  transition: transform 0.2s ease;
}
.feature:hover .feature-go { color: var(--accent-color); }
.feature:hover .feature-go svg { transform: translateX(3px); }

/* ================= 公告 ================= */
.ann-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ann {
  padding: 22px 26px;
}
.ann--pin {
  border-left: 2px solid var(--accent-gold);
}
.ann-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.ann-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.ann-content {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ann-meta {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-display);
}

/* ================= 赛季横幅 ================= */
.season-banner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 30px 32px;
  border: 1px solid rgba(var(--gold-rgb), 0.28);
  background:
    linear-gradient(90deg, rgba(var(--gold-rgb), 0.09), rgba(var(--accent-rgb), 0.04) 60%),
    rgba(255, 255, 255, 0.02);
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
}
.season-glyph {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 700;
  color: var(--accent-gold);
  text-shadow: 0 0 28px rgba(var(--gold-rgb), 0.45);
  line-height: 1;
}
.season-info { flex: 1; }
.season-info h2 {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.season-info p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* ================= 阵容卡 ================= */
.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.team {
  padding: 20px;
}
.team:hover { transform: translateY(-3px); }
.team-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.team-name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}
.team-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}
.team-champions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
}
.team-champion {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-display);
}
.team-champion--more { color: var(--accent-color); }

/* ================= 响应式 ================= */
@media (max-width: 900px) {
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .hero { padding: 48px 0 40px; }
  .hero-side { display: none; }
  .feature-grid, .team-grid { grid-template-columns: 1fr; }
  .season-banner { flex-direction: column; align-items: flex-start; gap: 14px; }
  .hero-stats { gap: 18px; }
}
</style>
