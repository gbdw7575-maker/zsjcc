import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '../services/api.js'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)
  const errorCount = ref(0)
  const lockTime = ref(null)
  const loading = ref(false)

  const login = async (formData) => {
    loading.value = true
    try {
      const { data } = await userApi.login(formData)
      token.value = data.data.token
      userInfo.value = data.data
      errorCount.value = 0
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('userInfo', JSON.stringify(data.data))
      return data.data
    } catch (error) {
      errorCount.value++
      if (errorCount.value >= 5) {
        lockTime.value = Date.now() + 30 * 60 * 1000
      }
      throw new Error(error.response?.data?.message || '登录失败')
    } finally {
      loading.value = false
    }
  }

  const register = async (formData) => {
    loading.value = true
    try {
      const { data } = await userApi.register(formData)
      return data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '注册失败')
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    // C4: 登出时清除"已触发同步"标记，下次登录后会重新触发后台同步
    sessionStorage.removeItem('syncTriggered')
  }

  const fetchUserInfo = async () => {
    if (!token.value) return
    try {
      const { data } = await userApi.getMe()
      userInfo.value = data.data
      localStorage.setItem('userInfo', JSON.stringify(data.data))
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const updateProfile = async (updateData) => {
    try {
      const { data } = await userApi.updateProfile(updateData)
      userInfo.value = data.data
      localStorage.setItem('userInfo', JSON.stringify(data.data))
      return data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新失败')
    }
  }

  const isLocked = () => {
    return lockTime.value && Date.now() < lockTime.value
  }

  const getRemainingLockTime = () => {
    if (!lockTime.value) return 0
    const remaining = Math.floor((lockTime.value - Date.now()) / 1000)
    return remaining > 0 ? remaining : 0
  }

  const loadFromStorage = () => {
    token.value = localStorage.getItem('token') || ''
    const saved = localStorage.getItem('userInfo')
    if (saved) {
      userInfo.value = JSON.parse(saved)
    }
  }

  return {
    token,
    userInfo,
    errorCount,
    lockTime,
    loading,
    login,
    register,
    logout,
    fetchUserInfo,
    updateProfile,
    isLocked,
    getRemainingLockTime,
    loadFromStorage
  }
})
