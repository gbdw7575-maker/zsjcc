<template>
  <div class="forum-page">
    <!-- 头部区域 -->
    <div class="forum-header">
      <div class="forum-header-inner">
        <div class="header-info">
          <div class="title-row">
            <div class="title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>
                <path d="M8.5 11h7M8.5 14h4"/>
              </svg>
            </div>
            <div>
              <h1 class="forum-title">金铲铲论坛</h1>
              <p class="forum-sub">分享攻略 · 讨论阵容 · 结交好友</p>
            </div>
          </div>
        </div>

        <router-link to="/forum/new" class="new-post-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
          </svg>
          发布帖子
        </router-link>
      </div>
    </div>

    <!-- 主标签页 -->
    <div class="forum-body">
      <div class="hud-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="['hud-tab', { 'is-active': activeTab === tab.key }]"
        >
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="tab.key === 'posts'">
              <path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>
            </template>
            <template v-else-if="tab.key === 'tutorials'">
              <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z"/>
              <path d="M18 3v16"/>
            </template>
            <template v-else-if="tab.key === 'lineups'">
              <path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3z"/>
            </template>
            <template v-else>
              <path d="M8 21h8M12 17v4"/>
              <path d="M7 4h10v6a5 5 0 0 1-10 0V4z"/>
              <path d="M5 5H3v2a2 2 0 0 0 2 2M19 5h2v2a2 2 0 0 1-2 2"/>
            </template>
          </svg>
          {{ tab.label }}
        </button>
      </div>

      <!-- ===================== 论坛帖子 ===================== -->
      <ForumPosts v-if="activeTab === 'posts'" />

      <!-- ===================== 教学资源 ===================== -->
      <ForumTutorials v-else-if="activeTab === 'tutorials'" />

      <!-- ===================== 阵容分享 ===================== -->
      <ForumLineups v-else-if="activeTab === 'lineups'" />

      <!-- ===================== 赛事资讯 ===================== -->
      <ForumTournament v-else-if="activeTab === 'esports'" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

// 4 个 tab 子组件按需异步加载，Vite 自动分包，切换 tab 时才下载对应代码
const ForumPosts = defineAsyncComponent(() => import('../components/forum/ForumPosts.vue'))
const ForumTutorials = defineAsyncComponent(() => import('../components/forum/ForumTutorials.vue'))
const ForumLineups = defineAsyncComponent(() => import('../components/forum/ForumLineups.vue'))
const ForumTournament = defineAsyncComponent(() => import('../components/forum/ForumTournament.vue'))

// 主标签页：4 个 tab 由独立子组件承载，本父组件仅负责外壳 + tab 切换
const activeTab = ref('posts')
const tabs = [
  { key: 'posts', label: '论坛帖子' },
  { key: 'tutorials', label: '教学资源' },
  { key: 'lineups', label: '阵容分享' },
  { key: 'esports', label: '赛事资讯' }
]
</script>

<style>
.forum-page {
  min-height: 100vh;
  padding-bottom: 48px;
}

/* ============ 头部 ============ */
.forum-header {
  border-bottom: 1px solid var(--line-soft);
  background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.05), transparent);
}
.forum-header-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 26px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.title-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.1);
  border: 1px solid rgba(var(--accent-rgb), 0.45);
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
.title-icon svg { width: 21px; height: 21px; }
.forum-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-primary);
}
.forum-sub {
  margin-top: 3px;
  font-size: 12.5px;
  color: var(--text-tertiary);
  letter-spacing: 0.05em;
}
.new-post-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  font-family: var(--font-display);
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #03201d;
  background: var(--accent-color);
  text-decoration: none;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  transition: background 0.2s ease, box-shadow 0.2s ease;
}
.new-post-btn svg { width: 16px; height: 16px; }
.new-post-btn:hover {
  background: var(--accent-hover);
  box-shadow: 0 0 24px -6px rgba(var(--accent-rgb), 0.7);
}

/* ============ 主体 ============ */
.forum-body {
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px;
}

/* Tabs */
.hud-tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--line-soft);
}
.hud-tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.hud-tab:hover { color: var(--text-primary); }
.hud-tab.is-active {
  color: #03201d;
  background: var(--accent-color);
}
.tab-svg { width: 16px; height: 16px; }

/* ============ 筛选栏 ============ */
.filter-bar {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-lg);
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.filter-row + .filter-row,
.sort-row { margin-top: 12px; }
.row-label,
.sort-label {
  font-family: var(--font-display);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--text-tertiary);
  flex-shrink: 0;
}
.chip-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.f-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 13px;
  font-family: var(--font-display);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}
.f-chip:hover {
  color: var(--text-primary);
  border-color: rgba(var(--accent-rgb), 0.35);
}
.f-chip.is-active {
  color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.1);
  border-color: rgba(var(--accent-rgb), 0.55);
  box-shadow: 0 0 18px -8px rgba(var(--accent-rgb), 0.6);
}
.f-chip.is-active.platform-blue {
  color: #5ab8ff;
  background: rgba(90, 184, 255, 0.1);
  border-color: rgba(90, 184, 255, 0.55);
  box-shadow: 0 0 18px -8px rgba(90, 184, 255, 0.6);
}
.search-box {
  flex: 1;
  min-width: 200px;
  max-width: 340px;
  margin-left: auto;
}
.t-search { max-width: 340px; margin-left: 0; }
.sort-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
}
.sort-link {
  font-size: 12.5px;
  color: var(--text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}
.sort-link:hover { color: var(--text-primary); }
.sort-link.is-active { color: var(--accent-color); }
.count-text {
  margin-left: auto;
  font-size: 12.5px;
  color: var(--text-tertiary);
}
.count-num {
  color: var(--accent-color);
  font-family: var(--font-display);
  font-weight: 600;
}

/* ============ 帖子卡 ============ */
.post-list { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
.post-card {
  padding: 18px;
  background: var(--bg-card);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.post-card:hover {
  border-color: rgba(var(--accent-rgb), 0.35);
  box-shadow: 0 8px 30px -18px rgba(var(--accent-rgb), 0.5);
}
.post-main { display: flex; gap: 14px; }
.avatar {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  border: 1px solid;
  border-radius: 50%;
}
.avatar.small { width: 38px; height: 38px; font-size: 14px; }
.post-content { flex: 1; min-width: 0; }
.post-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.post-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}
.post-card:hover .post-title { color: var(--accent-color); }
.tag-row { display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
.tag-pill {
  padding: 2px 9px;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 500;
  color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.1);
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  white-space: nowrap;
}
.post-excerpt {
  margin-top: 7px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-meta {
  margin-top: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12.5px;
  color: var(--text-tertiary);
}
.meta-left { display: flex; align-items: center; gap: 12px; }
.meta-time { color: var(--text-tertiary); }
.meta-right { display: flex; align-items: center; gap: 14px; }
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.meta-item svg { width: 15px; height: 15px; }
.meta-item.like { cursor: pointer; }
.meta-item.like:hover { color: var(--danger); }
.meta-item.liked { color: var(--danger); }
.post-thumb {
  flex-shrink: 0;
  width: 76px;
  height: 76px;
  border-radius: var(--r-md);
  overflow: hidden;
  border: 1px solid var(--line-soft);
}
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.thumb-video {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  background: rgba(0, 0, 0, 0.3);
}
.thumb-video svg { width: 28px; height: 28px; }

/* ============ 空状态/加载 ============ */
.state-box { text-align: center; padding: 56px 16px; }
.state-text { color: var(--text-secondary); font-size: 14px; }
.full-width { grid-column: 1 / -1; }
.empty-emoji { font-size: 44px; opacity: 0.7; }
.empty-title {
  margin-top: 12px;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--text-secondary);
}
.empty-sub { margin-top: 6px; font-size: 13px; color: var(--text-tertiary); }

/* ============ 教学 ============ */
.tutorial-wrap { margin-top: 16px; }
.t-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 14px;
}
.t-card {
  background: var(--bg-card);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-lg);
  overflow: hidden;
  transition: border-color 0.2s ease;
}
.t-card:hover { border-color: rgba(var(--accent-rgb), 0.3); }
.t-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--line-soft);
}
.card-head-icon {
  font-size: 16px;
  color: var(--accent-color);
}
.card-head-icon.icon-gold { color: var(--accent-gold); }
.t-card-title {
  font-family: var(--font-display);
  font-size: 15.5px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}
.t-card-title.small {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.t-card-body { padding: 14px 16px 16px; }

/* HUD 表格 */
.table-scroll { overflow-x: auto; }
.hud-table { width: 100%; font-size: 13px; border-collapse: collapse; }
.hud-table th {
  text-align: left;
  padding: 9px 10px;
  font-family: var(--font-display);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--accent-color);
  border-bottom: 1px solid var(--line-strong);
}
.hud-table td {
  padding: 9px 10px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--line-soft);
}
.hud-table tr:last-child td { border-bottom: none; }
.hud-table td.muted { color: var(--text-tertiary); }
.layer { font-family: var(--font-display); font-weight: 700; color: var(--text-primary); }
.layer-gold { color: var(--accent-gold); }
.layer-accent { color: var(--accent-color); }
.layer-ultimate { color: var(--accent-gold); font-size: 15px; }
.ultimate-reward { color: var(--accent-gold); font-weight: 600; }
.tip-box {
  margin-top: 12px;
  padding: 11px 13px;
  background: rgba(var(--gold-rgb), 0.08);
  border: 1px solid rgba(var(--gold-rgb), 0.25);
  border-radius: var(--r-md);
}
.tip-box p { font-size: 12.5px; line-height: 1.6; color: rgba(var(--gold-rgb), 0.85); }

/* 配置块 */
.cfg-block + .cfg-block { margin-top: 14px; }
.cfg-title {
  font-family: var(--font-display);
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 9px;
}
.cfg-title.accent { color: var(--accent-color); }
.cfg-title.green { color: var(--success); }
.cfg-title.gold { color: var(--accent-gold); }
.cfg-lines { display: flex; flex-direction: column; gap: 8px; }
.cfg-line { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); }
.cfg-tag {
  padding: 2px 8px;
  font-size: 11px;
  font-family: var(--font-display);
  border-radius: var(--r-sm);
}
.tag-blue { color: #5ab8ff; background: rgba(90,184,255,.14); }
.tag-accent { color: var(--accent-color); background: rgba(var(--accent-rgb),.14); }
.tag-rose { color: #ff5c8a; background: rgba(255,92,138,.14); }
.cfg-text { font-size: 13px; line-height: 1.7; color: var(--text-secondary); }

/* 平台徽标 */
.platform-badge {
  padding: 3px 9px;
  font-size: 11px;
  font-family: var(--font-display);
  white-space: nowrap;
}
.badge-embed { color: var(--accent-color); background: rgba(var(--accent-rgb),.12); }
.badge-bili { color: #5ab8ff; background: rgba(90,184,255,.12); }
.badge-dy { color: #ff5c8a; background: rgba(255,92,138,.12); }

/* 视频框 */
.video-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--r-md);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid var(--line-soft);
}
.video-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.video-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px;
}
.ph-bili { background: linear-gradient(135deg, rgba(90,184,255,.12), rgba(15,21,36,.6)); }
.ph-dy { background: linear-gradient(135deg, rgba(255,92,138,.12), rgba(15,21,36,.6)); }
.ph-emoji { font-size: 26px; }
.ph-title { font-size: 13px; color: var(--text-secondary); }
.ph-sub { font-size: 11.5px; color: var(--text-tertiary); text-align: center; }

.t-desc {
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mini-tag-row { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
.mini-tag {
  padding: 2px 8px;
  font-size: 11px;
  color: var(--text-tertiary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--r-sm);
}
.t-foot {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-tertiary);
}
.duration { color: var(--accent-color); font-family: var(--font-display); }
.watch-btn {
  display: block;
  margin-top: 12px;
  text-align: center;
  padding: 9px;
  font-size: 12.5px;
  font-family: var(--font-display);
  text-decoration: none;
  border-radius: var(--r-md);
  transition: background 0.2s ease;
}
.watch-embed { color: var(--accent-color); background: rgba(var(--accent-rgb),.12); }
.watch-embed:hover { background: rgba(var(--accent-rgb),.2); }
.watch-dy { color: #ff5c8a; background: rgba(255,92,138,.12); }
.watch-dy:hover { background: rgba(255,92,138,.2); }
.watch-bili { color: #5ab8ff; background: rgba(90,184,255,.12); }
.watch-bili:hover { background: rgba(90,184,255,.2); }

/* ============ 阵容 ============ */
.lineup-wrap { margin-top: 16px; }
.lineup-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.lineup-sort { display: flex; align-items: center; gap: 12px; }
.lineup-bar-right { display: flex; align-items: center; gap: 12px; }
.lineup-bar-right .count-text { margin-left: 0; }
.share-lineup-btn {
  padding: 7px 15px;
  font-family: var(--font-display);
  font-size: 12.5px;
  font-weight: 600;
  color: #03201d;
  background: var(--accent-color);
  border: none;
  cursor: pointer;
  border-radius: var(--r-md);
  transition: background 0.2s ease;
}
.share-lineup-btn:hover { background: var(--accent-hover); }
.lineup-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 14px;
}
.lineup-card {
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-lg);
  transition: border-color 0.2s ease;
}
.lineup-card:hover { border-color: rgba(var(--accent-rgb), 0.3); }
.lineup-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
}
.lineup-author { display: flex; align-items: center; gap: 10px; }
.lineup-title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}
.lineup-author-name { font-size: 11.5px; color: var(--text-tertiary); }
.hero-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.hero-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 66px;
  padding: 7px 9px;
  background: rgba(var(--accent-rgb), 0.06);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-md);
}
.hero-name { font-size: 11.5px; font-weight: 600; color: #ffd97a; }
.hero-star { font-size: 10px; margin-top: 2px; }
.hero-items {
  font-size: 10px;
  color: var(--text-tertiary);
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}
.lineup-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}
.lineup-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  color: var(--text-tertiary);
}
.comment-toggle {
  font-family: var(--font-display);
  font-size: 12.5px;
  color: var(--accent-color);
  background: none;
  border: none;
  cursor: pointer;
}
.comment-toggle:hover { color: var(--accent-hover); }
.comment-area {
  margin-top: 13px;
  padding-top: 13px;
  border-top: 1px solid var(--line-soft);
}
.comment-list { display: flex; flex-direction: column; gap: 9px; margin-bottom: 11px; max-height: 200px; overflow-y: auto; }
.comment-item {
  padding: 9px 11px;
  background: rgba(255, 255, 255, 0.035);
  border-radius: var(--r-md);
}
.comment-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.comment-author { font-size: 11.5px; font-weight: 600; color: var(--accent-color); }
.comment-time { font-size: 11px; color: var(--text-tertiary); }
.comment-content { font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; }
.comment-input-row { display: flex; gap: 8px; }
.comment-send {
  padding: 0 14px;
  font-size: 12.5px;
  color: #03201d;
  background: var(--accent-color);
  border: none;
  border-radius: var(--r-md);
  cursor: pointer;
  transition: background 0.2s ease;
}
.comment-send:hover { background: var(--accent-hover); }

/* Dialog 内部 */
.dialog-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text-primary); }
.hero-config { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.hero-config-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.cfg-id { width: 90px; }
.cfg-name { width: 80px; }
.cfg-star { width: 80px; }
.cfg-items { flex: 1; min-width: 120px; }
.cfg-remove {
  color: var(--danger);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.add-hero-btn {
  align-self: flex-start;
  color: var(--accent-color);
  background: none;
  border: none;
  font-size: 13px;
  cursor: pointer;
}
.dialog-cancel {
  padding: 8px 18px;
  font-size: 13px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.07);
  border: none;
  border-radius: var(--r-md);
  cursor: pointer;
}
.dialog-confirm {
  padding: 8px 22px;
  font-size: 13px;
  font-weight: 600;
  color: #03201d;
  background: var(--accent-color);
  border: none;
  border-radius: var(--r-md);
  cursor: pointer;
}
.dialog-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

/* ============ 赛事 ============ */
.esports-wrap { margin-top: 16px; }
.esports-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.e-card {
  background: var(--bg-card);
  border: 1px solid var(--line-soft);
  border-radius: var(--r-lg);
  overflow: hidden;
}
.span-two { grid-column: 1 / -1; }
.e-card-head {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--line-soft);
}
.e-card-body { padding: 14px 16px 16px; }
.ann-list { display: flex; flex-direction: column; gap: 8px; }
.ann-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 12px;
  background: rgba(255, 255, 255, 0.035);
  border-radius: var(--r-md);
  cursor: pointer;
  transition: background 0.2s ease;
}
.ann-item:hover { background: rgba(255, 255, 255, 0.07); }
.ann-badge {
  padding: 2px 8px;
  font-size: 11px;
  font-family: var(--font-display);
  white-space: nowrap;
}
.badge-danger { color: var(--danger); background: rgba(255, 77, 108, .12); }
.badge-gold { color: var(--accent-gold); background: rgba(var(--gold-rgb), .12); }
.badge-blue { color: #5ab8ff; background: rgba(90, 184, 255, .12); }
.ann-main { flex: 1; min-width: 0; }
.ann-title { font-size: 13.5px; font-weight: 600; color: var(--text-primary); }
.ann-content { margin-top: 6px; font-size: 12.5px; line-height: 1.65; color: var(--text-secondary); white-space: pre-wrap; }
.ann-meta {
  margin-top: 5px;
  display: flex;
  gap: 10px;
  font-size: 11.5px;
  color: var(--text-tertiary);
}

/* 平衡 */
.balance-block {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--r-md);
}
.balance-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.balance-badge { padding: 2px 9px; font-size: 11px; border-radius: var(--r-sm); font-family: var(--font-display); }
.balance-badge.buff { color: var(--success); background: rgba(61, 220, 132, .12); }
.balance-badge.nerf { color: var(--danger); background: rgba(255, 77, 108, .12); }
.balance-date { font-size: 11.5px; color: var(--text-tertiary); }
.balance-title { font-size: 13.5px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
.balance-list {
  list-style: disc;
  padding-left: 18px;
  font-size: 12.5px;
  line-height: 1.9;
  color: var(--text-secondary);
}
.balance-foot { margin-top: 12px; font-size: 11.5px; color: var(--text-tertiary); text-align: center; }

/* JOC */
.joc-highlight {
  padding: 12px;
  background: rgba(var(--gold-rgb), 0.07);
  border: 1px solid rgba(var(--gold-rgb), 0.25);
  border-radius: var(--r-md);
}
.joc-highlight-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.joc-live { font-size: 13px; font-weight: 700; color: var(--accent-gold); }
.joc-date { font-size: 11.5px; color: rgba(var(--gold-rgb), 0.6); }
.joc-lines { display: flex; flex-direction: column; gap: 5px; font-size: 12.5px; color: var(--text-secondary); }
.joc-lines .white { color: var(--text-primary); }
.joc-lines .gold-text { color: var(--accent-gold); }
.joc-lines .blue-text { color: #5ab8ff; }
.joc-block {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--r-md);
}
.joc-block + .joc-block,
.joc-block { margin-top: 10px; }
.joc-block-title { font-size: 13px; font-weight: 700; color: var(--text-secondary); }
.joc-block-title.dim { color: var(--text-tertiary); }
.ended { font-size: 11px; font-weight: 400; color: var(--text-tertiary); }
.schedule-lines { display: flex; flex-direction: column; gap: 7px; font-size: 12.5px; color: var(--text-secondary); }
.schedule-line { display: flex; justify-content: space-between; gap: 10px; }
.sched-accent { color: var(--accent-color); }
.sched-blue { color: #5ab8ff; }
.sched-orange { color: #ff7a59; }
.sched-gold { color: var(--accent-gold); font-weight: 600; }
.joc-link {
  display: block;
  margin-top: 12px;
  text-align: center;
  padding: 9px;
  font-size: 12.5px;
  color: var(--accent-gold);
  background: rgba(var(--gold-rgb), 0.1);
  border: 1px solid rgba(var(--gold-rgb), 0.25);
  border-radius: var(--r-md);
  text-decoration: none;
  transition: background 0.2s ease;
}
.joc-link:hover { background: rgba(var(--gold-rgb), 0.18); }

/* ============ 响应式 ============ */
@media (max-width: 860px) {
  .t-grid,
  .lineup-grid,
  .esports-grid { grid-template-columns: 1fr; }
  .span-two { grid-column: auto; }
}
@media (max-width: 560px) {
  .forum-body { padding: 14px; }
  .hud-tab { padding: 7px 11px; font-size: 12px; }
  .post-main { flex-wrap: wrap; }
  .post-thumb { width: 64px; height: 64px; order: -1; }
  .search-box { max-width: none; }
}
</style>

<style>
/* 阵容弹窗：对齐设计 token */
.lineup-dialog {
  background: var(--bg-card) !important;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-lg) !important;
}
.lineup-dialog .el-dialog__header {
  border-bottom: 1px solid var(--line-soft);
  padding: 15px 20px;
}
.lineup-dialog .el-dialog__body { padding: 20px; }
.lineup-dialog .el-form-item__label {
  color: var(--text-secondary) !important;
  font-family: var(--font-display);
}
.lineup-dialog .el-dialog__footer {
  border-top: 1px solid var(--line-soft);
  padding: 14px 20px;
}
</style>
