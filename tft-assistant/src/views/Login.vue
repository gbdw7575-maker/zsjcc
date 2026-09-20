<template>
  <div class="min-h-screen flex items-center justify-center overflow-hidden relative">
    <div class="bg-container"></div>
    <div class="gradient-overlay"></div>
    <div class="stars-container">
      <div v-for="i in 80" :key="'star-' + i" class="star" :style="starStyle(i)"></div>
    </div>
    <div class="particles-container">
      <div v-for="i in 20" :key="'particle-' + i" class="particle" :style="particleStyle(i)"></div>
    </div>
    <div class="floating-items">
      <div class="float-item item-1">🪙</div>
      <div class="float-item item-2">⚔️</div>
      <div class="float-item item-3">🛡️</div>
      <div class="float-item item-4">💎</div>
      <div class="float-item item-5">✨</div>
      <div class="float-item item-6">🐉</div>
      <div class="float-item item-7">🦊</div>
      <div class="float-item item-8">🤖</div>
    </div>
    
    <div class="relative z-10 login-box">
      <div class="text-center mb-8">
        <div class="logo-container">
          <div class="logo-shape">
            <span class="logo-icon">⚔️</span>
            <span class="logo-crown">👑</span>
          </div>
        </div>
        <h1 class="game-title">金铲铲之战</h1>
        <p class="game-subtitle">云顶之弈 · 掌上对决</p>
      </div>
      
      <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
        <el-form-item prop="username">
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <el-input v-model="form.username" placeholder="召唤师名称" class="custom-input" />
          </div>
        </el-form-item>
        
        <el-form-item prop="password">
          <div class="input-wrapper">
            <span class="input-icon">🔑</span>
            <el-input v-model="form.password" type="password" placeholder="密码" class="custom-input" />
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="login-btn">
            开始游戏
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="text-center mt-6">
        <span class="text-gray-400">还没有账号？</span>
        <router-link to="/register" class="register-link">创建账号</router-link>
      </div>
      
      <div v-if="lockMessage" class="lock-message">
        <p>{{ lockMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入召唤师名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const formRef = ref(null)
const loading = ref(false)

const lockMessage = computed(() => {
  if (userStore.isLocked()) {
    const remaining = Math.floor(userStore.getRemainingLockTime() / 60)
    return `账号已锁定，请${remaining}分钟后再试`
  }
  return ''
})

const starStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${2 + Math.random() * 3}s`
  }
}

const particleStyle = (i) => {
  const colors = ['#a855f7', '#ec4899', '#3b82f6', '#fbbf24', '#22d3ee']
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${4 + Math.random() * 8}px`,
    height: `${4 + Math.random() * 8}px`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 5}s`
  }
}

const handleLogin = async () => {
  if (userStore.isLocked()) {
    ElMessage.error(lockMessage.value)
    return
  }
  
  await formRef.value.validate()
  
  try {
    loading.value = true
    await userStore.login(form.value)
    ElMessage.success('登录成功，欢迎来到金铲铲之战！')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-container {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%),
    linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #1a0a2e 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(180deg, transparent 0%, rgba(168, 85, 247, 0.05) 50%, transparent 100%),
    linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.05) 50%, transparent 100%);
  pointer-events: none;
}

.stars-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  animation: floatParticle 8s ease-in-out infinite;
}

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.2; }
  25% { transform: translateY(-50px) translateX(20px) scale(1.2); opacity: 0.6; }
  50% { transform: translateY(-30px) translateX(-20px) scale(0.8); opacity: 0.4; }
  75% { transform: translateY(-80px) translateX(10px) scale(1.1); opacity: 0.5; }
}

.floating-items {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.float-item {
  position: absolute;
  font-size: 2.5rem;
  opacity: 0.25;
  animation: float 10s ease-in-out infinite;
}

.item-1 { top: 10%; left: 10%; animation-delay: 0s; }
.item-2 { top: 20%; right: 15%; animation-delay: 2s; }
.item-3 { bottom: 25%; left: 20%; animation-delay: 4s; }
.item-4 { top: 60%; right: 25%; animation-delay: 1s; }
.item-5 { bottom: 15%; right: 10%; animation-delay: 3s; }
.item-6 { top: 35%; left: 60%; animation-delay: 5s; }
.item-7 { bottom: 40%; right: 50%; animation-delay: 2.5s; }
.item-8 { top: 70%; left: 30%; animation-delay: 4.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-40px) rotate(180deg); }
}

.login-box {
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(168, 85, 247, 0.4);
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  box-shadow: 
    0 0 80px rgba(168, 85, 247, 0.25),
    0 0 120px rgba(236, 72, 153, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-shape {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #fbbf24 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 40px rgba(168, 85, 247, 0.6),
    0 0 80px rgba(236, 72, 153, 0.3);
  animation: pulse 3s ease-in-out infinite;
  transform: rotate(-15deg);
}

@keyframes pulse {
  0%, 100% { transform: rotate(-15deg) scale(1); box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(236, 72, 153, 0.3); }
  50% { transform: rotate(-15deg) scale(1.08); box-shadow: 0 0 60px rgba(168, 85, 247, 0.8), 0 0 120px rgba(236, 72, 153, 0.5); }
}

.logo-icon {
  font-size: 3rem;
  position: relative;
  z-index: 2;
}

.logo-crown {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: bounce 1.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.game-subtitle {
  color: #94a3b8;
  font-size: 1rem;
}

.login-form {
  margin-top: 20px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  z-index: 1;
}

.custom-input {
  width: 100%;
  height: 48px;
  padding-left: 48px;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  color: white !important;
  font-size: 1rem;
}

.custom-input::placeholder {
  color: rgba(255, 255, 255, 0.5) !important;
}

.custom-input:focus {
  border-color: #a855f7 !important;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3) !important;
}

.login-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-size: 1.1rem;
  font-weight: bold;
  color: white !important;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(168, 85, 247, 0.6);
}

.register-link {
  color: #a855f7;
  margin-left: 8px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #c084fc;
}

.lock-message {
  margin-top: 20px;
  padding: 12px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  text-align: center;
}

.lock-message p {
  color: #f87171;
  font-size: 0.9rem;
}
</style>
