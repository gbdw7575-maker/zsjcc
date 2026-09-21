<template>
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

<script setup>
import { ref, computed } from 'vue'
import { tutorials, tutorialCategories, tutorialPlatforms } from '../../data/tutorialData'

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
</script>
