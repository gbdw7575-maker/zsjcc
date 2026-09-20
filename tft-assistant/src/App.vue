<template>
  <div 
    class="app-container min-h-screen"
    :style="appStyle"
  >
    <nav v-if="showNav" class="backdrop-blur-lg border-b sticky top-0 z-50" :style="{ background: themeColors['--nav-bg'], borderColor: themeColors['--border-color'] }">
      <div class="max-w-7xl mx-auto px-4 py-2">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg" :style="{ background: `linear-gradient(135deg, ${themeColors['--accent-color']}, ${themeColors['--accent-hover']})`, boxShadow: `0 4px 12px ${themeColors['--shadow-color']}` }">
              <span class="text-white font-bold text-base">TFT</span>
            </div>
            <span class="font-bold text-lg hidden sm:block" :style="{ color: themeColors['--text-primary'] }">掌上金铲铲</span>
          </div>
          
          <!-- 导航链接 -->
          <div class="flex items-center gap-6">
            <router-link 
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :class="link.hidden ? 'hidden md:block' : ''"
              class="text-sm font-medium transition-colors duration-200 hover:opacity-100"
              :style="navLinkStyle(link.to)"
            >
              {{ link.label }}
            </router-link>
            <router-link 
              v-if="userStore.userInfo?.role === 'admin'"
              to="/admin"
              class="text-sm font-medium"
              :style="navLinkStyle('/admin')"
            >
              管理后台
            </router-link>
          </div>
          
          <!-- 用户操作 -->
          <div class="flex items-center gap-3">
            <!-- 主题切换按钮 -->
            <button 
              @click="showThemeDialog = true"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
              :style="{ background: themeColors['--bg-card-hover'], color: themeColors['--text-primary'] }"
              title="主题设置"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </button>
            <div v-if="userStore.userInfo" class="flex items-center gap-3">
              <router-link to="/profile" class="w-8 h-8 rounded-full flex items-center justify-center hover:ring-2 transition-all" :style="{ background: `linear-gradient(135deg, ${themeColors['--accent-color']}, ${themeColors['--accent-hover']})` }">
                <span class="text-white text-xs font-bold">{{ userStore.userInfo.username.charAt(0) }}</span>
              </router-link>
              <span class="text-sm font-medium hidden sm:block" :style="{ color: themeColors['--text-primary'] }">{{ userStore.userInfo.username }}</span>
              <button @click="handleLogout" class="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors">退出</button>
            </div>
            <div v-else class="flex items-center gap-2">
              <router-link to="/login" class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" :style="{ background: themeColors['--accent-color'] + '20', color: themeColors['--accent-color'], ':hover': { background: themeColors['--accent-color'] + '30' } }">登录</router-link>
              <router-link to="/register" class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80" :style="{ border: `1px solid ${themeColors['--border-color']}`, color: themeColors['--text-secondary'] }">注册</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="min-h-screen">
      <router-view />
    </main>

    <!-- 主题设置对话框 -->
    <el-dialog v-model="showThemeDialog" title="主题设置" width="540px" :close-on-click-modal="false">
      <div class="space-y-6">
        <!-- 预设主题选择 -->
        <div>
          <h4 class="text-sm font-medium mb-3" :style="{ color: themeColors['--text-primary'] }">预设主题</h4>
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="theme in themeStore.themes"
              :key="theme.name"
              @click="themeStore.setTheme(theme.name)"
              class="relative p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer group"
              :class="themeStore.currentTheme === theme.name ? 'ring-2 ring-offset-1' : 'hover:scale-105'"
              :style="{
                background: theme.colors['--bg-primary'],
                borderColor: themeStore.currentTheme === theme.name ? theme.colors['--accent-color'] : theme.colors['--border-color'],
                '--tw-ring-color': theme.colors['--accent-color'],
                '--tw-ring-offset-color': 'transparent',
              }"
            >
              <!-- 色块预览 -->
              <div class="flex flex-wrap gap-1 mb-2">
                <span class="w-4 h-4 rounded-full" :style="{ background: theme.colors['--bg-card'] }"></span>
                <span class="w-4 h-4 rounded-full" :style="{ background: theme.colors['--accent-color'] }"></span>
                <span class="w-4 h-4 rounded-full" :style="{ background: theme.colors['--text-primary'] }"></span>
                <span class="w-4 h-4 rounded-full" :style="{ background: theme.colors['--text-secondary'] }"></span>
              </div>
              <div class="text-xs font-medium truncate" :style="{ color: theme.colors['--text-primary'] }">
                {{ theme.name }}
              </div>
              <div v-if="themeStore.currentTheme === theme.name" class="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center" :style="{ background: theme.colors['--accent-color'] }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- 自定义背景 -->
        <div>
          <h4 class="text-sm font-medium mb-3" :style="{ color: themeColors['--text-primary'] }">自定义背景</h4>
          <div class="flex items-center gap-3">
            <label class="flex-1 px-4 py-3 rounded-lg border border-dashed cursor-pointer transition-colors hover:opacity-80 text-center" :style="{ borderColor: themeColors['--border-color'], background: themeColors['--bg-card'] }">
              <input type="file" class="hidden" accept="image/*" @change="handleBgUpload" />
              <span :style="{ color: themeColors['--text-secondary'] }">
                {{ themeStore.customBackground ? '更换背景图片' : '点击上传背景图片' }}
              </span>
            </label>
            <button
              v-if="themeStore.customBackground"
              @click="handleClearBg"
              class="px-4 py-3 rounded-lg transition-colors hover:opacity-80"
              :style="{ background: themeColors['--bg-card-hover'], color: '#ef4444' }"
            >
              清除
            </button>
          </div>
          <!-- 背景预览 -->
          <div
            v-if="themeStore.customBackground"
            class="mt-3 rounded-lg h-20 bg-cover bg-center border"
            :style="{
              backgroundImage: `url(${themeStore.customBackground})`,
              borderColor: themeColors['--border-color']
            }"
          ></div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showThemeDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useUserStore } from './stores/user'
import { useThemeStore } from './stores/theme'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { gameData } from './services/gameDataService'

const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

const showThemeDialog = ref(false)

const showNav = computed(() => {
  const hideRoutes = ['/login', '/register']
  return !hideRoutes.includes(router.currentRoute.value.path)
})

const themeColors = computed(() => themeStore.themeColors)

// 导航链接配置
const navLinks = computed(() => [
  { to: '/', label: '首页' },
  { to: '/teamfight', label: '阵容模拟器' },
  { to: '/equipment', label: '装备合成' },
  { to: '/pool', label: '卡池概率' },
  { to: '/economy', label: '经济计算' },
  { to: '/augments', label: '海克斯' },
  { to: '/synergies', label: '羁绊' },
  { to: '/forum', label: '论坛' },
  { to: '/screenshare', label: '实时指导' },
  { to: '/record', label: '我的战绩' },
  { to: '/feedback', label: '意见反馈' },
  { to: '/dashboard', label: '数据统计', hidden: true },
])

// 导航链接样式
const navLinkStyle = (to) => {
  const colors = themeColors.value
  const isActive = router.currentRoute.value.path === to
  return {
    color: isActive ? colors['--accent-color'] : colors['--text-secondary'],
    position: 'relative',
  }
}

// 应用全局样式
const appStyle = computed(() => {
  const colors = themeColors.value
  const bg = themeStore.customBackground
  return {
    backgroundColor: colors['--bg-primary'],
    backgroundImage: bg ? `url(${bg})` : 'none',
    backgroundSize: bg ? 'cover' : 'auto',
    backgroundPosition: 'center',
    backgroundAttachment: bg ? 'fixed' : 'scroll',
    transition: 'background-color 0.3s ease',
  }
})

// 将 CSS 变量应用到 document.documentElement
function applyTheme() {
  const colors = themeStore.themeColors
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  // 设置自定义背景变量
  root.style.setProperty('--custom-bg-image', themeStore.customBackground ? `url(${themeStore.customBackground})` : 'none')
}

// 监听主题变化
watch(() => themeStore.currentTheme, applyTheme, { immediate: true })
watch(() => themeStore.customBackground, applyTheme)

// 上传背景图片
const handleBgUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      ElMessage.warning('请选择图片文件')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.warning('图片大小不能超过 5MB')
      return
    }
    themeStore.setCustomBackground(file)
    ElMessage.success('背景图片上传成功')
  }
}

// 清除背景
const handleClearBg = () => {
  themeStore.clearCustomBackground()
  ElMessage.success('背景图片已清除')
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  userStore.loadFromStorage()
  applyTheme()
  gameData.load()
})
</script>

<style scoped>
/* 主题过渡效果 */
.app-container {
  transition: background-color 0.3s ease, background-image 0.3s ease;
}
</style>
