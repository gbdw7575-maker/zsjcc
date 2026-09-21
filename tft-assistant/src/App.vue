<template>
  <div 
    class="app-container min-h-screen"
    :style="appStyle"
  >
    <nav v-if="showNav" class="nav-hud backdrop-blur-xl sticky top-0 z-50" :style="{ background: themeColors['--nav-bg'] }">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2.5">
            <div class="logo-mark">
              <span>TFT</span>
              <i class="logo-dot"></i>
            </div>
            <span class="font-display font-bold text-[15px] hidden sm:block tracking-wide" :style="{ color: 'var(--text-primary)' }">掌上金铲铲</span>
          </router-link>

          <!-- 导航链接（桌面） -->
          <div class="hidden lg:flex items-center gap-5">
            <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :class="['nav-link', link.hidden ? 'hidden xl:block' : '', isActive(link.to) ? 'is-active' : '']"
            >
              {{ link.label }}
            </router-link>
            <router-link
              v-if="userStore.userInfo?.role === 'admin'"
              to="/admin"
              :class="['nav-link', isActive('/admin') ? 'is-active' : '']"
            >
              管理后台
            </router-link>
          </div>

          <!-- 用户操作 -->
          <div class="flex items-center gap-2.5">
            <!-- 移动端汉堡按钮 -->
            <button
              class="icon-btn lg:hidden"
              @click="mobileNavOpen = !mobileNavOpen"
              title="菜单"
            >
              <svg v-if="!mobileNavOpen" xmlns="http://www.w3.org/2000/svg" class="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <!-- 主题设置 -->
            <button
              @click="showThemeDialog = true"
              class="icon-btn"
              title="主题设置"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </button>
            <div v-if="userStore.userInfo" class="flex items-center gap-2.5">
              <router-link to="/profile" class="avatar-circle">
                <span>{{ userStore.userInfo.username.charAt(0) }}</span>
              </router-link>
              <span class="text-[13px] font-medium hidden sm:block" :style="{ color: 'var(--text-secondary)' }">{{ userStore.userInfo.username }}</span>
              <button @click="handleLogout" class="logout-btn">退出</button>
            </div>
            <div v-else class="flex items-center gap-2">
              <router-link to="/login" class="login-btn">登录</router-link>
              <router-link to="/register" class="register-btn">注册</router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 移动端下拉导航 -->
      <div v-show="mobileNavOpen" class="mobile-nav lg:hidden">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="m-nav-link"
          @click="mobileNavOpen = false"
        >
          <span>{{ link.label }}</span>
          <i v-if="isActive(link.to)" class="m-active-dot"></i>
        </router-link>
        <router-link
          v-if="userStore.userInfo?.role === 'admin'"
          to="/admin"
          class="m-nav-link"
          @click="mobileNavOpen = false"
        >
          <span>管理后台</span>
          <i v-if="isActive('/admin')" class="m-active-dot"></i>
        </router-link>
      </div>
    </nav>
    <main class="min-h-screen">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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
const mobileNavOpen = ref(false)

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

// 路由链接是否精确活跃
const isActive = (to) => router.currentRoute.value.path === to

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

// 将 hex 颜色转为 "r, g, b"，用于 rgba() 变量
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  if (!m) return null
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`
}

// 将 CSS 变量应用到 document.documentElement
function applyTheme() {
  const colors = themeStore.themeColors
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  // 按当前主题主色同步推导 RGB，保证光晕/发光在任何预设下都自洽
  const rgb = hexToRgb(colors['--accent-color'])
  if (rgb) root.style.setProperty('--accent-rgb', rgb)
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
.app-container {
  transition: background-color 0.3s ease, background-image 0.3s ease;
}

/* ---- 导航：底部一条渐变光线 ---- */
.nav-hud {
  position: sticky;
}
.nav-hud::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent 8%, rgba(var(--accent-rgb), 0.55) 50%, transparent 92%);
}

/* ---- Logo 切角标识 ---- */
.logo-mark {
  position: relative;
  width: 40px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--accent-rgb), 0.1);
  border: 1px solid rgba(var(--accent-rgb), 0.55);
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
.logo-mark span {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 12px;
  color: var(--accent-color);
  letter-spacing: 0.06em;
}
.logo-dot {
  position: absolute;
  top: 3px;
  right: 4px;
  width: 4px;
  height: 4px;
  background: var(--accent-gold);
  box-shadow: 0 0 8px rgba(var(--gold-rgb), 0.9);
}

/* ---- 导航链接 ---- */
.nav-link {
  position: relative;
  padding: 4px 2px;
  font-family: var(--font-display);
  font-size: 0.83rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}
.nav-link:hover {
  color: var(--text-primary);
}
.nav-link.is-active {
  color: var(--accent-color);
}
.nav-link.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -3px;
  transform: translateX(-50%);
  width: 18px;
  height: 2px;
  background: var(--accent-color);
  box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.85);
}

/* ---- 图标按钮 ---- */
.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  color: var(--text-secondary);
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}
.icon-btn:hover {
  color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.08);
  border-color: rgba(var(--accent-rgb), 0.3);
}

/* ---- 头像 ---- */
.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--accent-rgb), 0.6);
  background: rgba(var(--accent-rgb), 0.12);
  color: var(--accent-color);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 12px;
  text-decoration: none;
  transition: box-shadow 0.2s ease;
}
.avatar-circle:hover {
  box-shadow: 0 0 16px -2px rgba(var(--accent-rgb), 0.7);
}

/* ---- 退出 ---- */
.logout-btn {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: var(--r-sm);
  color: var(--danger);
  background: rgba(255, 77, 108, 0.1);
  border: 1px solid rgba(255, 77, 108, 0.35);
  cursor: pointer;
  transition: background 0.2s ease;
}
.logout-btn:hover {
  background: rgba(255, 77, 108, 0.2);
}

/* ---- 登录 / 注册 ---- */
.login-btn,
.register-btn {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: var(--r-sm);
  text-decoration: none;
  transition: all 0.2s ease;
}
.login-btn {
  color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.1);
  border: 1px solid rgba(var(--accent-rgb), 0.45);
}
.login-btn:hover {
  background: rgba(var(--accent-rgb), 0.18);
  box-shadow: 0 0 16px -4px rgba(var(--accent-rgb), 0.7);
}
.register-btn {
  color: var(--text-secondary);
  border: 1px solid var(--line-strong);
}
.register-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

/* ---- 移动端下拉导航 ---- */
.mobile-nav {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 40;
  padding: 10px 16px 14px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--line-strong);
  box-shadow: 0 24px 40px -24px rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
}
.m-nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 6px;
  font-family: var(--font-display);
  font-size: 0.86rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  border-bottom: 1px solid var(--line-soft);
}
.m-nav-link:last-child { border-bottom: none; }
.m-nav-link:active { color: var(--accent-color); }
.m-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.9);
}

/* ---- 页面切换过渡 ---- */
.page-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-leave-active {
  transition: opacity 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
}
</style>
