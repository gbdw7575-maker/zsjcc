import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// 预设主题配色方案
const presetThemes = [
  {
    name: '暗夜金铲铲',
    colors: {
      '--bg-primary': '#080d16',
      '--bg-secondary': '#0e1524',
      '--bg-card': '#101a2e',
      '--bg-card-hover': '#16233c',
      '--text-primary': '#e8eef9',
      '--text-secondary': '#93a2bf',
      '--accent-color': '#33e6d5',
      '--accent-hover': '#17d0be',
      '--border-color': '#1e2c49',
      '--nav-bg': 'rgba(5, 8, 14, 0.72)',
      '--shadow-color': 'rgba(51, 230, 213, 0.16)',
    }
  },
  {
    name: '墨绿深林',
    colors: {
      '--bg-primary': '#0d1f0d',
      '--bg-secondary': '#152915',
      '--bg-card': '#152915',
      '--bg-card-hover': '#1e3a1e',
      '--text-primary': '#d1fae5',
      '--text-secondary': '#6ee7b7',
      '--accent-color': '#34d399',
      '--accent-hover': '#10b981',
      '--border-color': '#1a3a1a',
      '--nav-bg': 'rgba(13, 31, 13, 0.85)',
      '--shadow-color': 'rgba(52, 211, 153, 0.12)',
    }
  },
  {
    name: '深海暗流',
    colors: {
      '--bg-primary': '#0a1929',
      '--bg-secondary': '#001e3c',
      '--bg-card': '#001e3c',
      '--bg-card-hover': '#002e58',
      '--text-primary': '#ccf7ff',
      '--text-secondary': '#66d9e8',
      '--accent-color': '#06b6d4',
      '--accent-hover': '#0891b2',
      '--border-color': '#103c5c',
      '--nav-bg': 'rgba(10, 25, 41, 0.85)',
      '--shadow-color': 'rgba(6, 182, 212, 0.15)',
    }
  },
  {
    name: '赛博朋克',
    colors: {
      '--bg-primary': '#0a0a0f',
      '--bg-secondary': '#131320',
      '--bg-card': '#131320',
      '--bg-card-hover': '#1c1c2e',
      '--text-primary': '#f0f0f5',
      '--text-secondary': '#ff8a5c',
      '--accent-color': '#ff6b35',
      '--accent-hover': '#e85a25',
      '--border-color': '#2a2a3e',
      '--nav-bg': 'rgba(10, 10, 15, 0.85)',
      '--shadow-color': 'rgba(255, 107, 53, 0.2)',
    }
  },
  {
    name: '日落荒漠',
    colors: {
      '--bg-primary': '#1c1917',
      '--bg-secondary': '#292524',
      '--bg-card': '#292524',
      '--bg-card-hover': '#383432',
      '--text-primary': '#fef3c7',
      '--text-secondary': '#d6b660',
      '--accent-color': '#f59e0b',
      '--accent-hover': '#d97706',
      '--border-color': '#44403c',
      '--nav-bg': 'rgba(28, 25, 23, 0.85)',
      '--shadow-color': 'rgba(245, 158, 11, 0.15)',
    }
  },
  {
    name: '暗夜绯红',
    colors: {
      '--bg-primary': '#1a0808',
      '--bg-secondary': '#2d1010',
      '--bg-card': '#2d1010',
      '--bg-card-hover': '#3d1818',
      '--text-primary': '#fff5f5',
      '--text-secondary': '#fca5a5',
      '--accent-color': '#ef4444',
      '--accent-hover': '#dc2626',
      '--border-color': '#5a2020',
      '--nav-bg': 'rgba(26, 8, 8, 0.85)',
      '--shadow-color': 'rgba(239, 68, 68, 0.15)',
    }
  },
  {
    name: '石墨暗灰',
    colors: {
      '--bg-primary': '#18181b',
      '--bg-secondary': '#27272a',
      '--bg-card': '#27272a',
      '--bg-card-hover': '#3f3f46',
      '--text-primary': '#f4f4f5',
      '--text-secondary': '#a1a1aa',
      '--accent-color': '#8b9dc3',
      '--accent-hover': '#6b7c9d',
      '--border-color': '#3f3f46',
      '--nav-bg': 'rgba(24, 24, 27, 0.85)',
      '--shadow-color': 'rgba(0, 0, 0, 0.2)',
    }
  },
  {
    name: '午夜蓝',
    colors: {
      '--bg-primary': '#0f1d36',
      '--bg-secondary': '#162a4a',
      '--bg-card': '#162a4a',
      '--bg-card-hover': '#1d385e',
      '--text-primary': '#dbeafe',
      '--text-secondary': '#93a3d4',
      '--accent-color': '#60a5fa',
      '--accent-hover': '#3b82f6',
      '--border-color': '#1e3a5f',
      '--nav-bg': 'rgba(15, 29, 54, 0.85)',
      '--shadow-color': 'rgba(96, 165, 250, 0.12)',
    }
  }
]

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 恢复
  const savedTheme = localStorage.getItem('app-theme')
  const savedBg = localStorage.getItem('custom-background')

  const currentTheme = ref(savedTheme || '暗夜金铲铲')
  const customBackground = ref(savedBg || '')

  // 获取所有预设主题
  const themes = computed(() => presetThemes)

  // 根据当前主题名返回配色对象
  const themeColors = computed(() => {
    const theme = presetThemes.find(t => t.name === currentTheme.value)
    return theme ? theme.colors : presetThemes[0].colors
  })

  // 切换主题
  function setTheme(name) {
    const theme = presetThemes.find(t => t.name === name)
    if (theme) {
      currentTheme.value = name
      localStorage.setItem('app-theme', name)
    }
  }

  // 设置自定义背景（接受 URL 字符串或 File 对象）
  function setCustomBackground(source) {
    if (source instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        customBackground.value = e.target.result
        localStorage.setItem('custom-background', e.target.result)
      }
      reader.readAsDataURL(source)
    } else if (typeof source === 'string') {
      customBackground.value = source
      localStorage.setItem('custom-background', source)
    }
  }

  // 清除自定义背景
  function clearCustomBackground() {
    customBackground.value = ''
    localStorage.removeItem('custom-background')
  }

  return {
    currentTheme,
    customBackground,
    themes,
    themeColors,
    setTheme,
    setCustomBackground,
    clearCustomBackground
  }
})
