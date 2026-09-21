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
      <template v-if="activeTab === 'posts'">
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
                  :style="getAvatarStyle(post)"
                >
                  {{ getInitial(post) }}
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
      </template>

      <!-- ===================== 教学资源 ===================== -->
      <template v-if="activeTab === 'tutorials'">
        <div class="tutorial-wrap">
          <!-- 筛选栏 -->
          <div class="filter-bar">
            <!-- 分类筛选 -->
            <div class="filter-row">
              <span class="row-label">分类</span>
              <div class="chip-row">
                <button
                  v-for="cat in tutorialCategories"
                  :key="cat.key"
                  @click="tutorialCategory = cat.key"
                  :class="['f-chip', { 'is-active': tutorialCategory === cat.key }]"
                >
                  {{ cat.icon }} {{ cat.label }}
                </button>
              </div>
            </div>
            <!-- 平台筛选 -->
            <div class="filter-row">
              <span class="row-label">平台</span>
              <div class="chip-row">
                <button
                  v-for="plat in tutorialPlatforms"
                  :key="plat.key"
                  @click="tutorialPlatform = plat.key"
                  :class="['f-chip', { 'is-active platform-blue': tutorialPlatform === plat.key }]"
                >
                  {{ plat.icon }} {{ plat.label }}
                </button>
              </div>
            </div>
            <!-- 搜索 -->
            <div class="filter-row">
              <div class="search-box t-search">
                <el-input v-model="tutorialSearch" placeholder="搜索教学内容..." clearable />
              </div>
              <span class="count-text">共 <span class="count-num">{{ filteredTutorials.length }}</span> 条结果</span>
            </div>
          </div>

          <!-- 卡片网格 -->
          <div class="t-grid">
            <!-- 魔盗团奖励层数攻略（固定卡片，始终显示） -->
            <div v-if="tutorialCategory === 'all' && tutorialPlatform === 'all' && !tutorialSearch" class="t-card">
              <div class="t-card-head">
                <span class="card-head-icon icon-gold">◆</span>
                <h3 class="t-card-title">魔盗团奖励层数攻略</h3>
              </div>
              <div class="t-card-body">
                <div class="table-scroll">
                  <table class="hud-table">
                    <thead>
                      <tr>
                        <th>层数</th>
                        <th>奖励类型</th>
                        <th>所需进度</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td class="layer layer-gold">1层</td><td>💰 金币</td><td class="muted">9</td></tr>
                      <tr><td class="layer">2层</td><td>⚔️ 装备</td><td class="muted">25</td></tr>
                      <tr><td class="layer">3层</td><td>💰 金币</td><td class="muted">45</td></tr>
                      <tr><td class="layer layer-accent">4层</td><td>🧩 纹章</td><td class="muted">70</td></tr>
                      <tr><td class="layer">5层</td><td>⚔️ 装备</td><td class="muted">110</td></tr>
                      <tr><td class="layer layer-accent">6层</td><td>🧩 纹章</td><td class="muted">150</td></tr>
                      <tr><td class="layer layer-ultimate">7层</td><td class="ultimate-reward">✨ 英雄复制器</td><td class="muted">200</td></tr>
                    </tbody>
                  </table>
                </div>
                <div class="tip-box">
                  <p><strong>💡 收菜技巧：</strong>建议在战力允许的情况下尽量叠高层数，7层英雄复制器是终极目标。稳住血量，把握收菜时机！</p>
                </div>
              </div>
            </div>

            <!-- 管理员程序配置推荐（固定卡片） -->
            <div v-if="tutorialCategory === 'all' && tutorialPlatform === 'all' && !tutorialSearch" class="t-card">
              <div class="t-card-head">
                <span class="card-head-icon">⚙</span>
                <h3 class="t-card-title">管理员程序配置推荐</h3>
              </div>
              <div class="t-card-body">
                <div class="cfg-block">
                  <h4 class="cfg-title accent">🎯 最强配置组合</h4>
                  <div class="cfg-lines">
                    <div class="cfg-line"><span class="cfg-tag tag-blue">选择1</span><span>开局生成一个临时的【英雄复制器】</span></div>
                    <div class="cfg-line"><span class="cfg-tag tag-accent">选择2</span><span>每回合提供免费刷新次数</span></div>
                    <div class="cfg-line"><span class="cfg-tag tag-rose">选择3</span><span>战斗开始时掉落金币</span></div>
                  </div>
                </div>
                <div class="cfg-block">
                  <h4 class="cfg-title green">📋 备选方案</h4>
                  <p class="cfg-text">如遇卡池不顺，可调整为「经验值加成 + 攻击力提升 + 金币掉落」组合，稳扎稳打保障前期血量。</p>
                </div>
                <div class="cfg-block">
                  <h4 class="cfg-title gold">⚠️ 注意事项</h4>
                  <p class="cfg-text">管理员程序加成效果与英雄星级和连胜相关，建议在连胜时优先选择金币类加成滚雪球。</p>
                </div>
              </div>
            </div>

            <!-- 动态教学卡片 -->
            <div
              v-for="t in filteredTutorials"
              :key="t.id"
              class="t-card"
            >
              <!-- 卡片头部 -->
              <div class="t-card-head">
                <h3 class="t-card-title small">{{ t.title }}</h3>
                <span
                  class="platform-badge"
                  :class="{
                    'badge-embed': t.platform === 'embed',
                    'badge-bili': t.platform === 'bilibili',
                    'badge-dy': t.platform === 'douyin'
                  }"
                >
                  {{ t.platform === 'embed' ? '📺 直接播放' : t.platform === 'douyin' ? '🎵 抖音' : '🎬 跳转' }}
                </span>
              </div>
              <!-- 卡片内容 -->
              <div class="t-card-body">
                <!-- 嵌入播放器 / 平台预览 -->
                <div class="video-frame">
                  <!-- B站嵌入播放 -->
                  <iframe
                    v-if="t.platform === 'embed' && t.bvid"
                    :src="`//player.bilibili.com/player.html?bvid=${t.bvid}&page=1&high_quality=1&danmaku=0`"
                    scrolling="no" border="0" frameborder="no" framespacing="0"
                    allowfullscreen="true"
                    class="video-iframe"
                  ></iframe>
                  <!-- B站跳转预览 -->
                  <div v-else-if="t.platform === 'bilibili'" class="video-placeholder ph-bili">
                    <span class="ph-emoji">🎬</span>
                    <span class="ph-title">B站精准视频</span>
                    <span class="ph-sub">点击下方按钮跳转观看</span>
                  </div>
                  <!-- 抖音跳转预览 -->
                  <div v-else-if="t.platform === 'douyin'" class="video-placeholder ph-dy">
                    <span class="ph-emoji">🎵</span>
                    <span class="ph-title">抖音精准视频</span>
                    <span class="ph-sub">点击下方按钮跳转抖音观看</span>
                  </div>
                  <!-- 兜底 -->
                  <div v-else class="video-placeholder">
                    <span class="ph-sub">暂无可播放内容</span>
                  </div>
                </div>
                <!-- 描述 -->
                <p class="t-desc">{{ t.desc }}</p>
                <!-- 标签 -->
                <div v-if="t.tags && t.tags.length > 0" class="mini-tag-row">
                  <span v-for="tag in t.tags" :key="tag" class="mini-tag">{{ tag }}</span>
                </div>
                <!-- 作者和时长 -->
                <div class="t-foot">
                  <span v-if="t.author">{{ t.author }}</span>
                  <span v-if="t.duration" class="duration">{{ t.duration }}</span>
                </div>
                <!-- 观看按钮 -->
                <a
                  :href="t.link"
                  target="_blank"
                  class="watch-btn"
                  :class="{
                    'watch-embed': t.platform === 'embed',
                    'watch-dy': t.platform === 'douyin',
                    'watch-bili': t.platform !== 'embed' && t.platform !== 'douyin'
                  }"
                >
                  {{ t.platform === 'embed' ? '📺 新窗口观看完整视频' : t.platform === 'douyin' ? '🎵 跳转抖音观看此视频' : '🎬 跳转B站观看此视频' }}
                </a>
              </div>
            </div>

            <!-- 无结果 -->
            <div v-if="filteredTutorials.length === 0" class="state-box full-width">
              <div class="empty-emoji">🔍</div>
              <h3 class="empty-title">没有找到相关内容</h3>
              <p class="empty-sub">试试其他分类或搜索关键词</p>
            </div>
          </div>
        </div>
      </template>

      <!-- ===================== 阵容分享 ===================== -->
      <template v-if="activeTab === 'lineups'">
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
                      :style="getAuthorStyle(lineup)"
                    >
                      {{ (lineup.author?.username || 'A')[0].toUpperCase() }}
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

      <!-- ===================== 赛事资讯 ===================== -->
      <template v-if="activeTab === 'esports'">
        <div class="esports-wrap">
          <div class="esports-grid">
            <!-- 版本更新公告 -->
            <div class="e-card span-two">
              <div class="e-card-head">
                <span class="card-head-icon">📢</span>
                <h3 class="t-card-title">版本更新公告</h3>
              </div>
              <div class="e-card-body">
                <div v-if="announcementLoading" class="state-text">加载中...</div>
                <div v-else-if="announcements.length > 0" class="ann-list">
                  <div
                    v-for="ann in announcements.slice(0, 5)"
                    :key="ann._id"
                    class="ann-item"
                    @click="toggleAnnouncement(ann)"
                  >
                    <span
                      class="ann-badge"
                      :class="ann.type === 'urgent' ? 'badge-danger' : ann.isPinned ? 'badge-gold' : 'badge-blue'"
                    >
                      {{ ann.type === 'urgent' ? '紧急' : ann.isPinned ? '置顶' : '公告' }}
                    </span>
                    <div class="ann-main">
                      <h4 class="ann-title">{{ ann.title }}</h4>
                      <div v-if="expandedAnnouncementId === ann._id" class="ann-content">{{ ann.content }}</div>
                      <div class="ann-meta">
                        <span>{{ ann.author?.username || '管理员' }}</span>
                        <span>{{ formatTime(ann.createdAt) }}</span>
                        <span>👁 {{ ann.viewCount || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="state-text">暂无版本公告</div>
              </div>
            </div>

            <!-- 游戏平衡性解读 -->
            <div class="e-card">
              <div class="e-card-head">
                <span class="card-head-icon">⚖</span>
                <h3 class="t-card-title">平衡性解读</h3>
              </div>
              <div class="e-card-body">
                <div class="cfg-block balance-block">
                  <div class="balance-head">
                    <span class="balance-badge buff">加强</span>
                    <span class="balance-date">2026.06 版本调整</span>
                  </div>
                  <h4 class="balance-title">S8 怪兽入侵赛季平衡调整回顾</h4>
                  <ul class="balance-list">
                    <li>战斗机甲吸收基础生命值提升5%</li>
                    <li>精英战士处决阈值从30%提升至33%</li>
                    <li>星之守护者法力回复加成40%/70%/100%/150%</li>
                    <li>怪兽棋子基础属性普遍高于同费英雄</li>
                  </ul>
                </div>
                <div class="cfg-block balance-block">
                  <div class="balance-head">
                    <span class="balance-badge nerf">削弱</span>
                    <span class="balance-date">持续关注</span>
                  </div>
                  <h4 class="balance-title">S8返场版本调整</h4>
                  <ul class="balance-list">
                    <li>地下魔盗团叠加进度数值回调</li>
                    <li>部分三费卡技能伤害系数小幅下调</li>
                  </ul>
                </div>
                <p class="balance-foot">
                  以上内容由管理员维护更新，实际以游戏内公告为准
                </p>
              </div>
            </div>

            <!-- JOC金铲铲公开赛 -->
            <div class="e-card">
              <div class="e-card-head">
                <span class="card-head-icon icon-gold">🏆</span>
                <h3 class="t-card-title">金铲铲公开赛 JOC</h3>
              </div>
              <div class="e-card-body">
                <!-- 夏季赛总决赛 -->
                <div class="joc-highlight">
                  <div class="joc-highlight-head">
                    <span class="joc-live">🔥 JOC 夏季赛总决赛</span>
                    <span class="joc-date">7月2日-7月4日</span>
                  </div>
                  <div class="joc-lines">
                    <p>📍 地点：<span class="white">杭州西湖体育馆</span></p>
                    <p>💰 奖金：<span class="gold-text">冠军100万元</span></p>
                    <p>📺 直播：<span class="blue-text">Joc.qq.com / 虎牙 / 斗鱼 / B站</span></p>
                  </div>
                </div>
                <!-- 赛程安排 -->
                <div class="cfg-block joc-block">
                  <h4 class="joc-block-title">📅 赛程安排</h4>
                  <div class="schedule-lines">
                    <div class="schedule-line">
                      <span>4月23日 - 5月31日</span>
                      <span class="sched-accent">四大赛道选拔</span>
                    </div>
                    <div class="schedule-line">
                      <span>6月11日 - 7月1日</span>
                      <span class="sched-blue">全国总决赛线上阶段</span>
                    </div>
                    <div class="schedule-line">
                      <span>7月2日</span>
                      <span class="sched-orange">半决赛</span>
                    </div>
                    <div class="schedule-line">
                      <span>7月4日 14:00</span>
                      <span class="sched-gold">冠军之战</span>
                    </div>
                  </div>
                </div>
                <!-- 四大赛道 -->
                <div class="cfg-block joc-block">
                  <h4 class="joc-block-title">🛤️ 四大赛道</h4>
                  <div class="joc-lines">
                    <p>🎮 <span class="white">平台赛道</span> — 斗鱼/快手/B站/虎牙/抖音</p>
                    <p>🏫 <span class="white">高校赛道</span> — 全国高校选拔</p>
                    <p>⭐ <span class="white">精英巡回赛</span> — 职业选手赛道</p>
                    <p>🌐 <span class="white">全民赛道</span> — 全民参与突围</p>
                  </div>
                </div>
                <!-- 春季赛回顾 -->
                <div class="cfg-block joc-block">
                  <h4 class="joc-block-title dim">🏅 春季赛回顾 <span class="ended">已结束</span></h4>
                  <div class="joc-lines">
                    <p>冠军：<span class="gold-text">TLG糕手雕妹</span></p>
                    <p>地点：<span class="white">广州塔</span></p>
                    <p>奖金：<span class="gold-text">100万元</span></p>
                  </div>
                </div>
                <a href="https://joc.qq.com/" target="_blank" class="joc-link">
                  🏆 进入JOC官网观赛
                </a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForumStore } from '../stores/forum'
import { lineupApi, announcementApi } from '../services/api'
import { ElMessage } from 'element-plus'
import { tutorials, tutorialCategories, tutorialPlatforms } from '../data/tutorialData'

const router = useRouter()
const forumStore = useForumStore()

// ========== 主标签页 ==========
const activeTab = ref('posts')
const tabs = [
  { key: 'posts', label: '论坛帖子' },
  { key: 'tutorials', label: '教学资源' },
  { key: 'lineups', label: '阵容分享' },
  { key: 'esports', label: '赛事资讯' }
]

// ========== 教学资源筛选 ==========
const tutorialCategory = ref('all')
const tutorialPlatform = ref('all')
const tutorialSearch = ref('')

const filteredTutorials = computed(() => {
  let result = [...tutorials]

  if (tutorialCategory.value !== 'all') {
    result = result.filter(t => t.category === tutorialCategory.value)
  }

  if (tutorialPlatform.value !== 'all') {
    result = result.filter(t => t.platform === tutorialPlatform.value)
  }

  if (tutorialSearch.value.trim()) {
    const kw = tutorialSearch.value.trim().toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(kw) ||
      t.desc.toLowerCase().includes(kw) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(kw)))
    )
  }

  return result
})

// ========== 帖子相关 ==========
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

// 统一头像配色（霓虹体系调色板，按用户名哈希）
const avatarPalette = [
  { c: '#33e6d5', rgb: '51,230,213' },
  { c: '#ffb133', rgb: '255,177,51' },
  { c: '#5ab8ff', rgb: '90,184,255' },
  { c: '#3ddc84', rgb: '61,220,132' },
  { c: '#b18cff', rgb: '177,140,255' },
  { c: '#ff7a59', rgb: '255,122,89' },
  { c: '#ff5c8a', rgb: '255,92,138' }
]
const pickPalette = (name) => {
  const key = name || 'A'
  const hash = key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarPalette[hash % avatarPalette.length]
}
const getAvatarStyle = (post) => {
  const p = pickPalette(post.author?.username)
  return {
    color: p.c,
    background: `rgba(${p.rgb}, 0.14)`,
    borderColor: `rgba(${p.rgb}, 0.55)`
  }
}

const getInitial = (post) => (post.author?.username || 'A')[0].toUpperCase()

const getPostThumbnail = (post) => {
  if (!post.media || post.media.length === 0) return ''
  const url = post.media[0].url || ''
  return url.startsWith('http') ? url : url // 相对路径走 Vite proxy
}

const getAuthorStyle = (lineup) => {
  const p = pickPalette(lineup.author?.username)
  return {
    color: p.c,
    background: `rgba(${p.rgb}, 0.14)`,
    borderColor: `rgba(${p.rgb}, 0.55)`
  }
}

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

// ========== 阵容分享相关 ==========
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
    // 重置表单
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
  // 刷新评论
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

// ========== 赛事资讯相关 ==========
const announcements = ref([])
const announcementLoading = ref(false)
const expandedAnnouncementId = ref(null)

const fetchAnnouncements = async () => {
  announcementLoading.value = true
  try {
    const { data } = await announcementApi.getAnnouncements({ limit: 10 })
    announcements.value = data.data || []
  } catch (error) {
    console.error('获取公告失败:', error)
  } finally {
    announcementLoading.value = false
  }
}

const toggleAnnouncement = (ann) => {
  expandedAnnouncementId.value = expandedAnnouncementId.value === ann._id ? null : ann._id
}

// ========== 工具函数 ==========
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const ts = new Date(timestamp).getTime()
  const now = Date.now()
  const diff = now - ts

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// ========== 初始化 ==========
onMounted(async () => {
  loading.value = true
  try {
    await forumStore.fetchPosts()
  } catch (error) {
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
  fetchLineups()
  fetchAnnouncements()
})
</script>

<style scoped>
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
