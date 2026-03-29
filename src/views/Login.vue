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
              <el-input
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                :prefix-icon="UserIcon"
                size="large"
                :class="{ 'is-error': errors.username }"
                @keyup.enter="handleLogin"
              />
              <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
            </div>

            <div class="form-group">
              <label>密码</label>
              <el-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                :prefix-icon="LockIcon"
                size="large"
                :class="{ 'is-error': errors.password }"
                @keyup.enter="handleLogin"
              >
                <template #suffix>
                  <el-icon class="password-toggle" @click="showPassword = !showPassword">
                    <View v-if="!showPassword" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
              <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
            </div>

            <div class="form-options">
              <el-checkbox v-model="form.remember" size="small">记住我</el-checkbox>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>

            <el-button
              type="primary"
              native-type="submit"
              :loading="isLoading"
              size="large"
              class="login-btn"
            >
              <span>{{ isLoading ? '登录中...' : '登 录' }}</span>
            </el-button>
          </form>

          <!-- 分隔线 -->
          <div class="divider">
            <el-divider>安全加密连接</el-divider>
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
import { reactive, ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { View, Hide } from '@element-plus/icons-vue'

const router = useRouter()
const auth = useAuthStore()
const uiStore = useUiStore()

// 内联 SVG 图标组件（保留原有 SVG 样式，无 el-icon 依赖）
const UserIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  'stroke-width': '2',
  class: 'input-icon-svg',
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  }),
])

const LockIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  'stroke-width': '2',
  class: 'input-icon-svg',
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  }),
])

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
  const savedUsername = auth.getRememberedUsername()
  if (savedUsername) {
    form.username = savedUsername
    form.remember = true
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
}

.login-background {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: #0f0c29;
}

.bg-gradient::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #302b63 0%, #24243e 50%, #0f0c29 100%);
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: pulse 4s ease-in-out infinite;
}

.orb-1 {
  top: -160px;
  left: -160px;
  width: 500px;
  height: 500px;
  background: rgba(123, 47, 247, 0.3);
}

.orb-2 {
  bottom: -160px;
  right: -160px;
  width: 500px;
  height: 500px;
  background: rgba(240, 7, 163, 0.2);
  animation-delay: 1.5s;
}

.orb-3 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: rgba(0, 217, 255, 0.1);
  animation-delay: 0.8s;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.bg-grid {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: linear-gradient(#fff 1px, transparent 1px),
    linear-gradient(90deg, #fff 1px, transparent 1px);
  background-size: 60px 60px;
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
}

.card-glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, #7b2ff7, #00d9ff, #f107a3);
  border-radius: 28px;
  filter: blur(12px);
  opacity: 0.25;
}

.card-content {
  position: relative;
  background: rgba(20, 16, 48, 0.9);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.card-header-bar {
  height: 4px;
  background: linear-gradient(90deg, #7b2ff7, #00d9ff, #f107a3);
}

.card-body {
  padding: 32px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.logo {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #7b2ff7, #00d9ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px rgba(123, 47, 247, 0.4);
}

.app-title {
  margin-top: 20px;
  font-size: 24px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.05em;
}

.app-subtitle {
  margin-top: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* 登录表单 — 统一继承全局变量，仅覆盖高度（48px 略大于标准 40px） */
.login-form :deep(.el-input__wrapper) {
  height: 48px !important;
  min-height: 48px !important;
}

.login-form :deep(.el-input__inner) {
  height: 48px !important;
  line-height: 48px !important;
}

/* 错误态 */
.login-form :deep(.el-input__wrapper.is-error) {
  border-color: rgba(239, 68, 68, 0.6) !important;
}
.login-form :deep(.el-input__wrapper.is-error.is-focus) {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

/* SVG 图标尺寸 */
.input-icon-svg {
  width: 16px;
  height: 16px;
  display: block;
}

/* 密码切换按钮 */
.password-toggle {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.15s ease;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.password-toggle:hover {
  color: rgba(255, 255, 255, 0.6);
}

/* Checkbox */
.form-options :deep(.el-checkbox__label) {
  color: rgba(255, 255, 255, 0.4) !important;
  font-size: 12px;
}
.form-options :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.error-text {
  font-size: 12px;
  color: #f87171;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.forgot-password {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}

.forgot-password:hover {
  color: rgba(255, 255, 255, 0.7);
}

/* 登录按钮 — 渐变 + 动效（全局 .el-button 不含渐变） */
.login-btn {
  width: 100%;
  height: 48px !important;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px !important;
  border: none !important;
  background: linear-gradient(135deg, #7b2ff7, #00d9ff) !important;
  color: white !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(123, 47, 247, 0.3);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  margin-top: 4px;
}

.login-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.login-btn:hover {
  box-shadow: 0 6px 24px rgba(123, 47, 247, 0.4);
  transform: translateY(-1px);
}

.login-btn:hover::before {
  opacity: 1;
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(123, 47, 247, 0.3);
}

.login-btn span {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.divider {
  margin: 24px 0;
}

.divider :deep(.el-divider) {
  border-color: rgba(255, 255, 255, 0.06) !important;
}

.divider :deep(.el-divider__text) {
  background: transparent !important;
  color: rgba(255, 255, 255, 0.2);
  font-size: 12px;
}

.test-account {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
}

.test-label {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.25);
  margin-bottom: 8px;
}

.test-credentials {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}
</style>
