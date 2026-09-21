<template>
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
            <h4 class="balance-title">S18 苍林秘境赛季平衡调整回顾</h4>
            <ul class="balance-list">
              <li>绽放 Wisps 神火增益数值提升</li>
              <li>裂隙兽 Alpha Mark 强化属性小幅加强</li>
              <li>苍木植物生命值与成长系数上调</li>
              <li>巫会 Essence 累积效率重新平衡</li>
            </ul>
          </div>
          <div class="cfg-block balance-block">
            <div class="balance-head">
              <span class="balance-badge nerf">削弱</span>
              <span class="balance-date">持续关注</span>
            </div>
            <h4 class="balance-title">S18 返场版本调整</h4>
            <ul class="balance-list">
              <li>灵巧兽 BFF 加成数值回调</li>
              <li>部分四费卡技能伤害系数小幅下调</li>
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

<script setup>
import { ref, onMounted } from 'vue'
import { announcementApi } from '../../services/api'
import { formatTime } from '../../utils/forumHelpers'

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

onMounted(() => {
  fetchAnnouncements()
})
</script>
