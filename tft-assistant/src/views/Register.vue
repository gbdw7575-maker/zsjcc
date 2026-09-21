<template>
  <div class="register-page">
    <div class="page-bg">
      <div class="bg-rings"></div>
      <div class="bg-grid"></div>
      <div class="bg-sweep"></div>
    </div>

    <div class="register-card animate-fade-up">
      <i class="corner corner--tl"></i>
      <i class="corner corner--tr"></i>
      <i class="corner corner--bl"></i>
      <i class="corner corner--br"></i>

      <div class="card-topbar">
        <span class="topbar-label">CREATE ACCOUNT</span>
        <span class="topbar-status">
          <i class="topbar-dot"></i>
          新用户注册
        </span>
      </div>

      <div class="brand">
        <div class="brand-mark">
          <span>TFT</span>
          <i class="brand-dot"></i>
        </div>
        <h1 class="brand-title">创建账号</h1>
        <p class="brand-sub">加入掌上金铲铲</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" class="register-form" @submit.prevent>
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

        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" size="large">
            <template #prefix>
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="m3 7 9 6 9-6"/>
              </svg>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" size="large">
            <template #prefix>
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="10" width="16" height="11" rx="2"/>
                <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
              </svg>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" size="large" @keyup.enter="handleRegister">
            <template #prefix>
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="type">
          <div class="role-select">
            <button type="button" class="role-btn" :class="{ active: form.type === 'player' }" @click="form.type = 'player'">
              <svg class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 12h4M8 10v4"/>
                <circle cx="15" cy="11" r="1"/><circle cx="17.5" cy="13.5" r="1"/>
                <rect x="2" y="6" width="20" height="12" rx="6"/>
              </svg>
              <span class="role-name">普通玩家</span>
            </button>
            <button type="button" class="role-btn" :class="{ active: form.type === 'creator' }" @click="form.type = 'creator'">
              <svg class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="M2 2l7.6 7.6"/>
                <circle cx="11" cy="11" r="2"/>
              </svg>
              <span class="role-name">内容创作者</span>
            </button>
          </div>
        </el-form-item>

        <el-form-item>
          <button class="submit-btn" :disabled="loading" @click="handleRegister">
            <span v-if="!loading">创 建 账 号</span>
            <span v-else class="flex items-center gap-2">
              <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12a9 9 0 1 1-6.2-8.6" stroke-linecap="round"/>
              </svg>
              创建中
            </span>
          </button>
        </el-form-item>
      </el-form>

      <div class="switch-line">
        <span>已有账号？</span>
        <router-link to="/login" class="switch-link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: 'player'
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ required: true, message: '请输入召唤师名称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择角色类型', trigger: 'change' }]
}

const formRef = ref(null)
const loading = ref(false)

const handleRegister = async () => {
  await formRef.value.validate()

  try {
    loading.value = true
    await userStore.register(form.value)

    // 注册成功后自动登录
    await userStore.login({
      username: form.value.username,
      password: form.value.password
    })

    ElMessage.success('注册成功，欢迎来到掌上金铲铲！')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  overflow: hidden;
}

/* ============ 背景 ============ */
.page-bg { position: absolute; inset: 0; pointer-events: none; }
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

/* ============ 注册卡 ============ */
.register-card {
  position: relative;
  width: 100%;
  max-width: 440px;
  padding: 38px 40px 32px;
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

/* 状态条 */
.card-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  margin-bottom: 24px;
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
  margin-bottom: 26px;
}
.brand-mark {
  position: relative;
  width: 58px;
  height: 44px;
  margin: 0 auto 16px;
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
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.1em;
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
.field-icon {
  width: 17px;
  height: 17px;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
}
:deep(.el-input__wrapper.is-focus) .field-icon {
  color: var(--accent-color);
}

/* 角色选择 */
.role-select {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}
.role-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--line-soft);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.role-btn:hover {
  border-color: rgba(var(--accent-rgb), 0.4);
  color: var(--text-primary);
}
.role-btn.active {
  border-color: var(--accent-color);
  background: rgba(var(--accent-rgb), 0.09);
  color: var(--accent-color);
  box-shadow: 0 0 22px -8px rgba(var(--accent-rgb), 0.6);
}
.role-icon {
  width: 26px;
  height: 26px;
}
.role-name {
  font-family: var(--font-display);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
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
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.22em;
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

/* 切换登录 */
.switch-line {
  margin-top: 16px;
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

@media (max-width: 480px) {
  .register-card { padding: 30px 22px 26px; }
}
</style>
