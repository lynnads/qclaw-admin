<template>
  <div class="login-page">
    <!-- 动态背景 -->
    <div class="login-background">
      <div class="bg-gradient"></div>
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="card-glow"></div>
      <div class="card-content">
        <!-- 顶部装饰条 -->
        <div class="card-header-bar"></div>

        <div class="card-body">
          <!-- Logo -->
          <div class="logo-section">
            <div class="logo">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 class="app-title">QClaw Admin</h1>
            <p class="app-subtitle">后台管理系统</p>
          </div>

          <!-- 登录表单 -->
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label>用户名</label>
              <div class="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="请输入用户名"
                  class="form-input"
                  :class="{ error: errors.username }"
                />
              </div>
              <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
            </div>

            <div class="form-group">
              <label>密码</label>
              <div class="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  class="form-input"
                  :class="{ error: errors.password }"
                />
                <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input v-model="form.remember" type="checkbox" />
                <span>记住我</span>
              </label>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>

            <button type="submit" :disabled="isLoading" class="login-btn">
              <svg v-if="isLoading" class="spinner" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>{{ isLoading ? '登录中...' : '登 录' }}</span>
            </button>
          </form>

          <!-- 分隔线 -->
          <div class="divider">
            <span>安全加密连接</span>
          </div>

          <!-- 测试账号提示（仅开发环境显示） -->
          <div v-if="isDev" class="test-account">
            <p class="test-label">测试账号</p>
            <p class="test-credentials">admin / Test@123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
const auth = useAuthStore()
const uiStore = useUiStore()

const form = reactive({
  username: '',
  password: '',
  remember: false,
})

const errors = reactive({
  username: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const isDev = import.meta.env.DEV

const validate = () => {
  let valid = true
  errors.username = ''
  errors.password = ''

  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    valid = false
  }

  if (!form.password.trim()) {
    errors.password = '请输入密码'
    valid = false
  }

  return valid
}

const handleLogin = async () => {
  if (!validate()) return

  isLoading.value = true

  try {
    await auth.login({
      username: form.username,
      password: form.password,
      remember: form.remember,
    })

    uiStore.showSuccess('登录成功')
    router.push('/')
  } catch (error) {
    errors.password = '用户名或密码错误'
    uiStore.showError('登录失败，请重试')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // 恢复记住的用户名
  const savedUsername = auth.getRememberedUsername()
  if (savedUsername) {
    form.username = savedUsername
    form.remember = true
  }
})
</script>

<style scoped>
.login-page {
  @apply min-h-screen relative flex items-center justify-center p-4 overflow-hidden;
}

.login-background {
  @apply absolute inset-0 -z-10;
}

.bg-gradient {
  @apply absolute inset-0 bg-[#0f0c29];
}

.bg-gradient::after {
  content: '';
  @apply absolute inset-0 bg-gradient-to-br from-[#302b63] via-[#24243e] to-[#0f0c29];
}

.bg-orb {
  @apply absolute rounded-full blur-[120px] animate-pulse;
}

.orb-1 {
  @apply -top-40 -left-40 w-[500px] h-[500px] bg-[#7b2ff7]/30;
}

.orb-2 {
  @apply -bottom-40 -right-40 w-[500px] h-[500px] bg-[#f107a3]/20;
  animation-delay: 1.5s;
}

.orb-3 {
  @apply top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d9ff]/10;
  animation-delay: 0.8s;
}

.bg-grid {
  @apply absolute inset-0 opacity-[0.03];
  background-image:
    linear-gradient(#fff 1px, transparent 1px),
    linear-gradient(90deg, #fff 1px, transparent 1px);
  background-size: 60px 60px;
}

.login-card {
  @apply relative w-full max-w-[420px];
}

.card-glow {
  @apply absolute -inset-1 bg-gradient-to-r from-[#7b2ff7] via-[#00d9ff] to-[#f107a3] rounded-[28px] blur opacity-25;
}

.card-content {
  @apply relative bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden;
}

.card-header-bar {
  @apply h-1 bg-gradient-to-r from-[#7b2ff7] via-[#00d9ff] to-[#f107a3];
}

.card-body {
  @apply px-8 pt-8 pb-8;
}

.logo-section {
  @apply flex flex-col items-center mb-8;
}

.logo {
  @apply w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center shadow-[0_4px_24px_rgba(123,47,247,0.4)];
}

.app-title {
  @apply mt-5 text-2xl font-bold text-white tracking-wide;
}

.app-subtitle {
  @apply mt-1.5 text-sm text-white/40;
}

.login-form {
  @apply space-y-5;
}

.form-group {
  @apply space-y-1.5;
}

.form-group label {
  @apply text-xs font-medium text-white/50 uppercase tracking-wider;
}

.input-wrapper {
  @apply relative flex items-center;
}

.input-icon {
  @apply absolute left-4 w-4 h-4 text-white/30 pointer-events-none;
}

.form-input {
  @apply w-full h-12 pl-11 pr-11 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white
         placeholder-white/25 outline-none transition-all duration-300 focus:bg-white/[0.1]
         focus:border-[#7b2ff7]/50 focus:shadow-[0_0_0_3px_rgba(123,47,247,0.15)] hover:border-white/[0.15];
}

.form-input.error {
  @apply border-red-500/60 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)];
}

.error-text {
  @apply text-xs text-red-400;
}

.password-toggle {
  @apply absolute right-4 text-white/30 hover:text-white/60 transition-colors;
}

.form-options {
  @apply flex items-center justify-between;
}

.remember-me {
  @apply flex items-center gap-2 cursor-pointer select-none;
}

.remember-me input {
  @apply sr-only;
}

.remember-me span {
  @apply text-xs text-white/40;
}

.forgot-password {
  @apply text-xs text-white/40 hover:text-white/70 transition-colors;
}

.login-btn {
  @apply relative w-full h-12 rounded-xl font-semibold text-sm overflow-hidden mt-1;
}

.login-btn::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-[#7b2ff7] via-[#00d9ff] to-[#7b2ff7] bg-[length:200%_100%] transition-all duration-500;
}

.login-btn:hover::before {
  @apply bg-[right];
}

.login-btn::after {
  content: '';
  @apply absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300;
}

.login-btn:hover::after {
  @apply opacity-100;
}

.login-btn span {
  @apply relative flex items-center justify-center gap-2 text-white z-10;
}

.spinner {
  @apply w-4 h-4 animate-spin;
}

.divider {
  @apply flex items-center gap-3 my-6;
}

.divider::before,
.divider::after {
  content: '';
  @apply flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent;
}

.divider span {
  @apply text-xs text-white/20;
}

.test-account {
  @apply bg-white/[0.04] border border-white/[0.06] rounded-xl p-4;
}

.test-label {
  @apply text-center text-xs text-white/25 mb-2;
}

.test-credentials {
  @apply text-center text-xs text-white/35;
}
</style>
