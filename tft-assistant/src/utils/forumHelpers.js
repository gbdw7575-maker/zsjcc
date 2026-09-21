// Forum 共用工具函数：头像配色、首字母、缩略图、相对时间
// 抽自 Forum.vue 巨石组件，供 ForumPosts / ForumLineups / ForumTournament 等子组件复用

// 霓虹体系调色板
export const avatarPalette = [
  { c: '#33e6d5', rgb: '51,230,213' },
  { c: '#ffb133', rgb: '255,177,51' },
  { c: '#5ab8ff', rgb: '90,184,255' },
  { c: '#3ddc84', rgb: '61,220,132' },
  { c: '#b18cff', rgb: '177,140,255' },
  { c: '#ff7a59', rgb: '255,122,89' },
  { c: '#ff5c8a', rgb: '255,92,138' }
]

// 按用户名哈希取色
export function pickPalette(name) {
  const key = name || 'A'
  const hash = key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarPalette[hash % avatarPalette.length]
}

// 头像样式（统一接口：传 username 字符串）
export function avatarStyleFor(name) {
  const p = pickPalette(name)
  return {
    color: p.c,
    background: `rgba(${p.rgb}, 0.14)`,
    borderColor: `rgba(${p.rgb}, 0.55)`
  }
}

// 取首字母大写
export function initialFor(name) {
  return (name || 'A')[0].toUpperCase()
}

// 帖子缩略图 URL（兼容 http 与相对路径，相对路径走 Vite proxy）
export function getPostThumbnail(post) {
  if (!post.media || post.media.length === 0) return ''
  const url = post.media[0].url || ''
  return url
}

// 相对时间格式化（刚刚 / x分钟前 / x小时前 / M/D）
export function formatTime(timestamp) {
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
