<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
    <!-- 动态背景底图 -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-[#0f0c29]"></div>
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#302b63] via-[#24243e] to-[#0f0c29]"
      ></div>
      <!-- 动态光球 -->
      <div
        class="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#7b2ff7]/30 blur-[120px] animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#f107a3]/20 blur-[120px] animate-pulse"
        style="animation-delay: 1.5s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00d9ff]/10 blur-[150px] animate-pulse"
        style="animation-delay: 0.8s"
      ></div>
      <!-- 网格线 -->
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="
          background-image:
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px);
          background-size: 60px 60px;
        "
      ></div>
    </div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-[420px]">
      <div class="relative group">
        <!-- 外层光晕 -->
        <div
          class="absolute -inset-1 bg-gradient-to-r from-[#7b2ff7] via-[#00d9ff] to-[#f107a3] rounded-[28px] blur opacity-25 group-hover:opacity-40 transition duration-700"
        ></div>

        <!-- 玻璃卡片 -->
        <div
          class="relative bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
        >
          <!-- 顶部装饰条 -->
          <div class="h-1 bg-gradient-to-r from-[#7b2ff7] via-[#00d9ff] to-[#f107a3]"></div>

          <div class="px-8 pt-8 pb-8">
            <!-- Logo -->
            <div class="flex flex-col items-center mb-8">
              <div class="relative">
                <div
                  class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center shadow-[0_4px_24px_rgba(123,47,247,0.4)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <!-- Logo 外圈 -->
                <div class="absolute inset-0 rounded-2xl border-2 border-white/10 scale-105"></div>
              </div>
              <h1 class="mt-5 text-2xl font-bold text-white tracking-wide">QClaw Admin</h1>
              <p class="mt-1.5 text-sm text-white/40">后台管理系统</p>
            </div>

            <!-- 表单 -->
            <form @submit.prevent="handleLogin" class="space-y-5">
              <!-- 用户名 -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-white/50 uppercase tracking-wider"
                  >用户名</label
                >
                <div class="relative group/input">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-white/30 group-focus-within/input:text-[#7b2ff7] transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="form.username"
                    type="text"
                    placeholder="请输入用户名"
                    class="w-full h-12 pl-11 pr-4 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-300 focus:bg-white/[0.1] focus:border-[#7b2ff7]/50 focus:shadow-[0_0_0_3px_rgba(123,47,247,0.15)] hover:border-white/15"
                    :class="{
                      'border-red-500/60 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]':
                        errors.username,
                    }"
                  />
                </div>
                <p v-if="errors.username" class="text-xs text-red-400">{{ errors.username }}</p>
              </div>

              <!-- 密码 -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-white/50 uppercase tracking-wider"
                  >密码</label
                >
                <div class="relative group/input">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-white/30 group-focus-within/input:text-[#7b2ff7] transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="请输入密码"
                    class="w-full h-12 pl-11 pr-11 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-300 focus:bg-white/[0.1] focus:border-[#7b2ff7]/50 focus:shadow-[0_0_0_3px_rgba(123,47,247,0.15)] hover:border-white/15"
                    :class="{
                      'border-red-500/60 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]':
                        errors.password,
                    }"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg
                      v-if="!showPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.password" class="text-xs text-red-400">{{ errors.password }}</p>
              </div>

              <!-- 记住我 & 忘记密码 -->
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <div class="relative">
                    <input v-model="form.remember" type="checkbox" class="peer sr-only" />
                    <div
                      class="w-9 h-5 bg-white/10 peer-checked:bg-[#7b2ff7]/60 rounded-full transition-colors duration-300"
                    ></div>
                    <div
                      class="absolute top-0.5 left-0.5 w-4 h-4 bg-white/40 peer-checked:translate-x-4 peer-checked:bg-white rounded-full transition-all duration-300 shadow"
                    ></div>
                  </div>
                  <span class="text-xs text-white/40">记住我</span>
                </label>
                <a href="#" class="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >忘记密码？</a
                >
              </div>

              <!-- 登录按钮 -->
              <button
                type="submit"
                :disabled="isLoading"
                class="relative w-full h-12 rounded-xl font-semibold text-sm overflow-hidden group/btn mt-1"
              >
                <!-- 按钮背景渐变 -->
                <span
                  class="absolute inset-0 bg-gradient-to-r from-[#7b2ff7] via-[#00d9ff] to-[#7b2ff7] bg-[length:200%_100%] group-hover/btn:bg-[right] transition-all duration-500"
                ></span>
                <!-- 按钮光效 -->
                <span
                  class="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                ></span>
                <!-- 文字 -->
                <span class="relative flex items-center justify-center gap-2 text-white">
                  <svg
                    v-if="isLoading"
                    class="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  <span>{{ isLoading ? '登录中...' : '登 录' }}</span>
                </span>
              </button>
            </form>

            <!-- 分隔线 -->
            <div class="flex items-center gap-3 my-6">
              <div
                class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
              ></div>
              <span class="text-xs text-white/20">安全加密连接</span>
              <div
                class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
              ></div>
            </div>

            <!-- 测试账号 -->
            <!-- <div class="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
              <p class="text-center text-xs text-white/25 mb-2">测试账号</p>
              <div class="flex justify-center gap-6 text-xs">
                <span class="text-white/35">admin / 123456</span>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/user'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  const t = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', t)
  
  // 恢复记住的用户名
  const savedUsername = localStorage.getItem('rememberUsername')
  if (savedUsername) {
    form.username = savedUsername
    form.remember = true
  }
})

const form = reactive({ username: '', password: '', remember: false })
const errors = reactive({ username: '', password: '' })
const showPassword = ref(false)
const isLoading = ref(false)

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
    const res = await login(form.username, form.password)
    if (res.code !== 200) {
      errors.password = res.message || '登录失败'
      return
    }
    auth.setToken(res.data.token)
    auth.setUserInfo(res.data.userInfo)
    
    // 记住我功能
    if (form.remember) {
      localStorage.setItem('rememberUsername', form.username)
    } else {
      localStorage.removeItem('rememberUsername')
    }
    
    router.push('/')
  } catch {
    errors.password = '发生错误，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>
