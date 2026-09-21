<template>
  <div class="home-skeleton">
    <!-- Hero skeleton -->
    <section class="skel-hero">
      <div class="skel-badge"></div>
      <div class="skel-title"></div>
      <div class="skel-title-en"></div>
      <div class="skel-desc"></div>
      <div class="skel-actions">
        <div class="skel-btn"></div>
        <div class="skel-btn"></div>
      </div>
      <div class="skel-stats">
        <div class="skel-stat" v-for="i in 3" :key="i"></div>
      </div>
    </section>

    <!-- 功能入口 skeleton -->
    <section class="skel-block">
      <div class="skel-head"></div>
      <div class="skel-grid skel-grid-3">
        <div class="skel-card" v-for="i in 6" :key="i"></div>
      </div>
    </section>

    <!-- 公告 skeleton -->
    <section class="skel-block">
      <div class="skel-head"></div>
      <div class="skel-ann-list">
        <div class="skel-ann" v-for="i in 2" :key="i"></div>
      </div>
    </section>

    <!-- 赛季横幅 skeleton -->
    <section class="skel-block">
      <div class="skel-banner"></div>
    </section>

    <!-- 热门阵容 skeleton -->
    <section class="skel-block">
      <div class="skel-head"></div>
      <div class="skel-grid skel-grid-4">
        <div class="skel-card" v-for="i in 8" :key="i"></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-skeleton {
  padding-bottom: 64px;
}

/* Hero */
.skel-hero {
  padding: 72px 24px 56px;
  max-width: 1152px;
  margin: 0 auto;
}
.skel-badge {
  width: 220px;
  height: 26px;
  margin-bottom: 28px;
  border-radius: 4px;
}
.skel-title {
  width: 320px;
  height: 56px;
  margin-bottom: 6px;
  border-radius: 6px;
}
.skel-title-en {
  width: 180px;
  height: 16px;
  margin-bottom: 22px;
  border-radius: 4px;
}
.skel-desc {
  width: 100%;
  max-width: 560px;
  height: 14px;
  margin-bottom: 12px;
  border-radius: 4px;
}
.skel-desc::after {
  content: '';
  display: block;
  width: 70%;
  height: 14px;
  margin-top: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
}
.skel-actions {
  display: flex;
  gap: 12px;
  margin: 28px 0 44px;
}
.skel-btn {
  width: 130px;
  height: 40px;
  border-radius: 6px;
}
.skel-stats {
  display: flex;
  gap: 28px;
}
.skel-stat {
  width: 90px;
  height: 36px;
  border-radius: 4px;
}

/* Block */
.skel-block {
  max-width: 1152px;
  margin: 0 auto;
  padding: 36px 24px 0;
}
.skel-head {
  width: 180px;
  height: 24px;
  margin-bottom: 22px;
  border-radius: 4px;
}

/* Grids */
.skel-grid {
  display: grid;
  gap: 16px;
}
.skel-grid-3 { grid-template-columns: repeat(3, 1fr); }
.skel-grid-4 { grid-template-columns: repeat(4, 1fr); }
.skel-card {
  height: 180px;
  border-radius: 12px;
}

/* Announcements */
.skel-ann-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skel-ann {
  height: 110px;
  border-radius: 12px;
}

/* Season banner */
.skel-banner {
  height: 110px;
  border-radius: 12px;
}

/* Shimmer animation */
.skel-badge,
.skel-title,
.skel-title-en,
.skel-desc,
.skel-btn,
.skel-stat,
.skel-head,
.skel-card,
.skel-ann,
.skel-banner {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(var(--accent-rgb), 0.08) 50%,
    rgba(255, 255, 255, 0.03) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Responsive */
@media (max-width: 900px) {
  .skel-grid-3 { grid-template-columns: repeat(2, 1fr); }
  .skel-grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .skel-hero { padding: 48px 24px 40px; }
  .skel-grid-3,
  .skel-grid-4 { grid-template-columns: 1fr; }
  .skel-stats { gap: 18px; }
}
</style>
