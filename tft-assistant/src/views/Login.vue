<template>
  <div class="login-page">
    <!-- 背景：同心瞄准环 + 扫描网格（纯CSS） -->
    <div class="login-bg">
      <div class="bg-rings"></div>
      <div class="bg-grid"></div>
      <div class="bg-sweep"></div>
    </div>

    <div class="login-card animate-fade-up">
      <!-- 四角准星 -->
      <i class="corner corner--tl"></i>
      <i class="corner corner--tr"></i>
      <i class="corner corner--bl"></i>
      <i class="corner corner--br"></i>

      <!-- 顶部状态条 -->
      <div class="card-topbar">
        <span class="topbar-label">SYSTEM LOGIN</span>
        <span class="topbar-status">
          <i class="topbar-dot"></i>
          身份验证
        </span>
      </div>

      <!-- 品牌 -->
      <div class="brand">
        <div class="brand-mark">
          <span>TFT</span>
          <i class="brand-dot"></i>
        </div>
        <h1 class="brand-title">掌上金铲铲</h1>
        <p class="brand-sub">云顶之弈 · 掌上对决</p>
      </div>

      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="formRef" class="login-form" @submit.prevent>
        <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="召唤师名称" size="large">
              <template #prefix>
                <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>
                </svg>
              </template>
            </el-input>
        </el-form-item>

        <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password @keyup.enter="handleLogin">
              <template #prefix>
                <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="10" width="16" height="11" rx="2"/>
                  <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                </svg>
              </template>
            </el-input>
        </el-form-item>

        <el-form-item>
          <button class="submit-btn" :disabled="loading" @click="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else class="flex items-center gap-2">
              <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12a9 9 0 1 1-6.2-8.6" stroke-linecap="round"/>
              </svg>
              验证中
            </span>
          </button>
        </el-form-item>
      </el-form>

      <div class="switch-line">
        <span>还没有账号？</span>
        <router-link to="/register" class="switch-link">创建账号</router-link>
      </div>

      <div v-if="lockMessage" class="lock-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="4" y="10" width="16" height="11" rx="2"/>
          <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
        </svg>
        <span>{{ lockMessage }}</span>
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

const handleLogin = async () => {
  if (userStore.isLocked()) {
    ElMessage.error(lockMessage.value)
    return
  }

  await formRef.value.validate()

  try {
    loading.value = true
    await userStore.login(form.value)
    ElMessage.success('登录成功，欢迎回来！')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  overflow: hidden;
}

/* ============ 背景 ============ */
.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-rings {
  position: absolute;
  width: 760px;
  height: 760px;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(circle, transparent 60%, rgba(var(--accent-rgb), 0.05) 60.5%, transparent 62%),
    radial-gradient(circle, transparent 68%, rgba(var(--accent-rgb), 0.04) 68.5%, transparent 70%),
    radial-gradient(circle, transparent 78%, rgba(var(--gold-rgb), 0.05) 78.5%, transparent 80%);
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(var(--accent-rgb), 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--accent-rgb), 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse at 50% 42%, black 0%, transparent 72%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 42%, black 0%, transparent 72%);
}
.bg-sweep {
  position: absolute;
  left: -30%;
  right: -30%;
  height: 140px;
  top: 0;
  background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.06), transparent);
  animation: sweep 7s linear infinite;
}
@keyframes sweep {
  from { transform: translateY(-160px); }
  to { transform: translateY(100vh); }
}

/* ============ 登录卡 ============ */
.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 40px 40px 34px;
  background: linear-gradient(180deg, rgba(16, 26, 46, 0.92), rgba(9, 14, 25, 0.95));
  border: 1px solid var(--line-strong);
  box-shadow:
    0 30px 80px -30px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
}

/* 四角准星 */
.corner {
  position: absolute;
  width: 14px;
  height: 14px;
  pointer-events: none;
}
.corner::before,
.corner::after {
  content: '';
  position: absolute;
  background: var(--accent-color);
}
.corner::before { width: 14px; height: 1.5px; }
.corner::after { width: 1.5px; height: 14px; }
.corner--tl { top: 10px; left: 10px; }
.corner--tr { top: 10px; right: 10px; transform: rotate(90deg); }
.corner--bl { bottom: 10px; left: 10px; transform: rotate(-90deg); }
.corner--br { bottom: 10px; right: 10px; transform: rotate(180deg); }

/* 顶部状态条 */
.card-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  margin-bottom: 26px;
  border-bottom: 1px solid var(--line-soft);
}
.topbar-label {
  font-family: var(--font-display);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: var(--text-tertiary);
}
.topbar-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 10.5px;
  color: var(--text-secondary);
  letter-spacing: 0.12em;
}
.topbar-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-color);
  box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.9);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  50% { opacity: 0.3; }
}

/* 品牌 */
.brand {
  text-align: center;
  margin-bottom: 28px;
}
.brand-mark {
  position: relative;
  width: 58px;
  height: 44px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--accent-rgb), 0.1);
  border: 1px solid rgba(var(--accent-rgb), 0.6);
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
.brand-mark span {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.08em;
  color: var(--accent-color);
}
.brand-dot {
  position: absolute;
  top: 5px;
  right: 7px;
  width: 5px;
  height: 5px;
  background: var(--accent-gold);
  box-shadow: 0 0 8px rgba(var(--gold-rgb), 0.9);
}
.brand-title {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.brand-sub {
  font-family: var(--font-display);
  font-size: 11px;
  letter-spacing: 0.24em;
  color: var(--text-tertiary);
}

/* 表单 */
.login-form {
  margin-top: 4px;
}
.field-icon {
  width: 17px;
  height: 17px;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
}
:deep(.el-input__wrapper.is-focus) .field-icon {
  color: var(--accent-color);
}

/* 提交按钮 */
.submit-btn {
  position: relative;
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: #03201d;
  background: var(--accent-color);
  border: none;
  cursor: pointer;
  overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  transition: background 0.2s ease, box-shadow 0.2s ease;
}
.submit-btn::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  left: -50px;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  transition: none;
}
.submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  box-shadow: 0 0 28px -6px rgba(var(--accent-rgb), 0.75);
}
.submit-btn:hover:not(:disabled)::after {
  animation: btn-shine 0.9s ease;
}
@keyframes btn-shine {
  to { left: 110%; }
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}
.spinner {
  width: 17px;
  height: 17px;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 切换注册 */
.switch-line {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
  color: var(--text-tertiary);
}
.switch-link {
  margin-left: 6px;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--accent-color);
  text-decoration: none;
  position: relative;
}
.switch-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: var(--accent-color);
  opacity: 0.4;
  transition: opacity 0.2s ease;
}
.switch-link:hover::after { opacity: 1; }

/* 锁定提示 */
.lock-message {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding: 12px 14px;
  background: rgba(255, 77, 108, 0.08);
  border: 1px solid rgba(255, 77, 108, 0.35);
  color: var(--danger);
  font-size: 12.5px;
}
.lock-message svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .login-card { padding: 32px 24px 28px; }
}
</style>
