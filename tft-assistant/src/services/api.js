import axios from 'axios'
import router from '../router'
import { useUserStore } from '../stores/user'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 同步重置 Pinia 用户状态，避免 localStorage 清空后 store 仍保留登录态
      try {
        useUserStore().logout()
      } catch (e) {
        // Pinia 尚未初始化时退回手动清理
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
      // 避免重复跳转（多个请求同时 401）
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export const userApi = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  getUserProfile: (id) => api.get(`/users/${id}`)
}

export const postApi = {
  getPosts: (params) => api.get('/posts', { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (data) => {
    // FormData 自动有正确的 Content-Type（含 boundary），不要手动覆盖
    return api.post('/posts', data)
  },
  likePost: (id) => api.post(`/posts/${id}/like`),
  favoritePost: (id) => api.post(`/posts/${id}/favorite`),
  createComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  likeComment: (id) => api.post(`/posts/comments/${id}/like`)
}

export const socialApi = {
  followUser: (userId) => api.post('/social/follow', { userId }),
  getFollowers: (userId) => api.get(`/social/followers/${userId}`),
  getFollowing: (userId) => api.get(`/social/following/${userId}`),
  checkFollowStatus: (userId) => api.get(`/social/check/${userId}`),
  searchUsers: (q) => api.get('/social/search', { params: { q } }),
  blockUser: (userId) => api.post(`/social/block/${userId}`),
  unblockUser: (userId) => api.post(`/social/unblock/${userId}`),
  getBlocklist: () => api.get('/social/blocklist')
}

export const messageApi = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (userId, content) => api.post(`/messages/${userId}`, { content }),
  getUnreadCount: () => api.get('/messages/unread')
}

export const gameDataApi = {
  getGameData: (params) => api.get('/game-data', { params }),
  getGameDataById: (id) => api.get(`/game-data/${id}`),
  getActiveVersion: () => api.get('/game-data/active-version'),
  createGameData: (data) => api.post('/game-data', data),
  bulkCreateGameData: (data) => api.post('/game-data/bulk', data),
  updateGameData: (id, data) => api.put(`/game-data/${id}`, data),
  deleteGameData: (id) => api.delete(`/game-data/${id}`)
}

export const feedbackApi = {
  create: (data) => api.post('/feedback', data),
  getMy: (params) => api.get('/feedback/my', { params }),
  getAll: (params) => api.get('/feedback/all', { params }),
  reply: (id, data) => api.put(`/feedback/${id}/reply`, data),
  updateStatus: (id, data) => api.put(`/feedback/${id}/status`, data),
  delete: (id) => api.delete(`/feedback/${id}`)
}

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserBan: (id) => api.post(`/admin/users/${id}/toggle-ban`),
  // 内容审核
  getPendingPosts: (params) => api.get('/admin/posts/pending', { params }),
  getAllPosts: (params) => api.get('/admin/posts', { params }),
  approvePost: (id) => api.post(`/admin/posts/${id}/approve`),
  rejectPost: (id, reason) => api.post(`/admin/posts/${id}/reject`, { reason }),
  // 阵容管理
  getAllTeams: (params) => api.get('/admin/teams', { params }),
  updateTeam: (id, data) => api.put(`/admin/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/admin/teams/${id}`),
  // 系统维护
  clearCache: (type) => api.post('/admin/clear-cache', { type })
}

export const lineupApi = {
  getLineups: (params) => api.get('/lineups', { params }),
  getLineupById: (id) => api.get(`/lineups/${id}`),
  createLineup: (data) => api.post('/lineups', data),
  updateLineup: (id, data) => api.put(`/lineups/${id}`, data),
  deleteLineup: (id) => api.delete(`/lineups/${id}`),
  likeLineup: (id) => api.post(`/lineups/${id}/like`),
  addComment: (id, data) => api.post(`/lineups/${id}/comments`, data),
  getComments: (id) => api.get(`/lineups/${id}/comments`)
}

export const announcementApi = {
  getAnnouncements: (params) => api.get('/announcements', { params }),
  getAnnouncementById: (id) => api.get(`/announcements/${id}`),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
  getAllAnnouncements: (params) => api.get('/announcements/admin/all', { params })
}

export const tftDataApi = {
  checkStatus: () => api.get('/tft/status'),
  getOverview: (count = 20) => api.get('/tft/overview', { params: { count } }),
  getMatches: (count = 20) => api.get('/tft/matches', { params: { count } }),
  getMatchDetail: (gameId) => api.get(`/tft/match/${gameId}`)
}

export const recordApi = {
  create: (data) => api.post('/records', data),
  getList: (params) => api.get('/records', { params }),
  getDetail: (id) => api.get(`/records/${id}`),
  delete: (id) => api.delete(`/records/${id}`),
  // 从本机金铲铲客户端自动同步最近对局
  syncLCU: () => api.post('/records/sync-lcu'),
  // A3: ScreenShare OCR + AI 复盘自动入库（upsert by videoId+timestamp）
  // 用于把 ScreenShare 页识别完的 AI 建议持久化到 MatchRecord，便于 MyRecord 列表回看
  upsertOcrAdvice: (payload) => api.post('/records/ocr', payload)
}

export const aiApi = {
  // 服务端代理调用，浏览器不接触密钥
  chat: (data) => api.post('/ai/chat', data),
  getStatus: () => api.get('/ai/status')
}

export default api
