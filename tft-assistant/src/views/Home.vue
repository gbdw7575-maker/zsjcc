<template>
  <!-- D5: Suspense 包裹数据预取，骨架屏 fallback 缩短 LCP -->
  <Suspense>
    <template #default>
      <HomeContent />
    </template>
    <template #fallback>
      <HomeSkeleton />
    </template>
  </Suspense>
</template>

<script setup>
import HomeContent from '../components/home/HomeContent.vue'
import HomeSkeleton from '../components/home/HomeSkeleton.vue'
</script>
