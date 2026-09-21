import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/teamfight',
    name: 'Teamfight',
    component: () => import('../views/Teamfight.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('../views/Equipment.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/:id',
    name: 'TeamDetail',
    component: () => import('../views/TeamDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pool',
    name: 'PoolTracker',
    component: () => import('../views/PoolTracker.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/economy',
    name: 'Economy',
    component: () => import('../views/Economy.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/augments',
    name: 'Augments',
    component: () => import('../views/Augments.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/synergies',
    name: 'Synergies',
    component: () => import('../views/Synergies.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('../views/Forum.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forum/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forum/new',
    name: 'CreatePost',
    component: () => import('../views/CreatePost.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/screenshare',
    name: 'ScreenShare',
    component: () => import('../views/ScreenShare.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/record',
    name: 'MyRecord',
    component: () => import('../views/MyRecord.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('../views/Social.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/game-data',
    name: 'AdminGameData',
    component: () => import('../views/AdminGameData.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: () => import('../views/AdminPanel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin && userInfo.role !== 'admin') {
    ElMessage.error('需要管理员权限')
    next('/')
  } else if (to.path === '/login' && token) {
    next('/')
  } else if (to.path === '/register' && token) {
    next('/')
  } else {
    // C4: 登录态进入受保护页面时异步触发一次后台战绩同步
    //   - 用 sessionStorage 标记防重，每个浏览器会话只触发一次
    //   - 动态 import api.js 避免循环依赖（api.js 顶部静态 import router）
    //   - fire-and-forget：不 await，不阻塞路由跳转
    if (to.meta.requiresAuth && token && !sessionStorage.getItem('syncTriggered')) {
      sessionStorage.setItem('syncTriggered', '1')
      import('../services/api.js')
        .then(({ recordApi }) => recordApi.triggerSync())
        .catch(() => { /* 静默：同步失败不影响正常浏览 */ })
    }
    next()
  }
})

export default router
