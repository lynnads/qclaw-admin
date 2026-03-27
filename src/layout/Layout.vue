<template>
  <div class="min-h-screen flex text-white">

    <!-- ════════════════ 深色渐变背景 ════════════════ -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute inset-0 bg-[#0f0c29]"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-[#302b63] via-[#24243e] to-[#0f0c29]"></div>
      <div class="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#7b2ff7]/20 blur-[120px] animate-pulse"></div>
      <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#f107a3]/15 blur-[120px] animate-pulse" style="animation-delay:1.5s"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00d9ff]/8 blur-[150px] animate-pulse" style="animation-delay:0.8s"></div>
      <div class="absolute inset-0 opacity-[0.02]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:60px 60px"></div>
    </div>

    <!-- ════════════════ 侧边栏 ════════════════ -->
    <aside
      :class="[
        'fixed top-0 left-0 z-30 h-screen flex flex-col',
        'bg-white/[0.05] backdrop-blur-xl border-r border-white/[0.08]',
        'transition-all duration-300 ease-in-out overflow-hidden',
        isSidebarOpen ? 'w-60' : 'w-16',
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-4 border-b border-white/[0.08] flex-shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(123,47,247,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span
          class="ml-3 text-sm font-bold whitespace-nowrap overflow-hidden transition-all duration-300"
          :style="{ opacity: isSidebarOpen ? 1 : 0 }"
        >QClaw Admin</span>
      </div>

      <!-- 菜单 -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <router-link
          v-for="item in menuItems" :key="item.path" :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
            'hover:bg-white/[0.08]',
            isActive(item.path)
              ? 'bg-gradient-to-r from-[#7b2ff7]/30 to-[#00d9ff]/20 text-white border border-[#7b2ff7]/30'
              : 'text-white/60',
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path v-for="(d,i) in item.icon" :key="i" stroke-linecap="round" stroke-linejoin="round" :d="d" />
          </svg>
          <span class="whitespace-nowrap transition-all duration-300" :style="{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }">
            {{ item.title }}
          </span>
        </router-link>
      </nav>

      <!-- 折叠按钮 -->
      <div class="flex-shrink-0 border-t border-white/[0.08] p-2">
        <button
          @click="toggleSidebar"
          class="w-full flex items-center justify-center py-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 transition-transform duration-300"
            :class="isSidebarOpen ? '' : 'rotate-180'"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- ════════════════ 主内容区 ════════════════ -->
    <div
      :class="[
        'flex flex-col min-h-screen transition-all duration-300 flex-1',
        isSidebarOpen ? 'ml-60' : 'ml-16',
      ]"
    >
      <!-- 顶部导航 -->
      <header class="sticky top-0 z-20 h-16 flex items-center justify-between px-6
        bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06]">
        <!-- 页面标题 -->
        <h1 class="text-base font-semibold text-white/90">{{ pageTitle }}</h1>

        <!-- 右侧 -->
        <div class="flex items-center gap-2">
          <!-- 主题切换 -->
          <button
            @click="toggleTheme"
            class="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] flex items-center justify-center transition-all duration-200"
            :title="theme === 'dark' ? '浅色模式' : '深色模式'"
          >
            <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- 通知 -->
          <button class="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] flex items-center justify-center transition-all duration-200 relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f107a3] rounded-full ring-2 ring-[#0f0c29]"></span>
          </button>

          <!-- 用户 -->
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] cursor-pointer transition-all duration-200">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center text-white text-xs font-bold">
                {{ userInitial }}
              </div>
              <span class="text-sm text-white/70 hidden sm:inline">{{ username }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <ul tabindex="0" class="dropdown-content z-50 mt-2 w-52 rounded-2xl overflow-hidden
              bg-[#1a1630]/90 backdrop-blur-2xl border border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <li class="px-4 py-3 border-b border-white/[0.08]">
                <p class="text-sm font-semibold text-white">{{ username }}</p>
                <p class="text-xs text-white/40 mt-0.5">管理员</p>
              </li>
              <li>
                <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-150">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  退出登录
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <!-- 内容 -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>

    <!-- ════════════════ 移动端侧边栏 ════════════════ -->
    <Transition name="fade">
      <div v-if="mobileOpen" class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="mobileOpen = false"></div>
        <aside class="absolute top-0 left-0 h-full w-60 bg-[#1a1630]/95 backdrop-blur-2xl border-r border-white/[0.10] flex flex-col">
          <div class="h-16 flex items-center px-4 border-b border-white/[0.08]">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center shadow-[0_4px_16px_rgba(123,47,247,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="ml-3 text-sm font-bold text-white">QClaw Admin</span>
          </div>
          <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <router-link
              v-for="item in menuItems" :key="item.path" :to="item.path" @click="mobileOpen = false"
              :class="[
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                'hover:bg-white/[0.08]',
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#7b2ff7]/30 to-[#00d9ff]/20 text-white border border-[#7b2ff7]/30'
                  : 'text-white/60',
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path v-for="(d,i) in item.icon" :key="i" stroke-linecap="round" stroke-linejoin="round" :d="d" />
              </svg>
              {{ item.title }}
            </router-link>
          </nav>
        </aside>
      </div>
    </Transition>

    <!-- 移动端汉堡按钮 -->
    <button
      @click="mobileOpen = true"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] shadow-[0_4px_24px_rgba(123,47,247,0.4)] flex items-center justify-center lg:hidden hover:scale-110 transition-transform duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const theme = ref(localStorage.getItem('theme') || 'dark')
const applyTheme = t => {
  theme.value = t
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('theme', t)
}
watch(theme, t => applyTheme(t))

const isSidebarOpen = ref(true)
const mobileOpen = ref(false)
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }

const menuItems = [
  {
    path: '/', title: '首页',
    icon: ['M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'],
  },
  {
    path: '/user', title: '用户列表',
    icon: ['M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'],
  },
  {
    path: '/project', title: '项目分析',
    icon: ['M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', 'M9 12l2 2 4-4'],
  },
  {
    path: '/github', title: 'GitHub热门',
    icon: ['M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'],
  },
]

const isActive = path => path === '/' ? route.path === '/' : route.path.startsWith(path)
const pageTitle = computed(() => {
  const item = menuItems.find(m => isActive(m.path))
  return item?.title || '后台管理'
})

const username = computed(() => auth.userInfo?.name || 'Admin')
const userInitial = computed(() => username.value.charAt(0).toUpperCase())

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

let _t = null
const showToast = (msg, type = 'success') => {
  const c = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b' }[type] || '#3b82f6'
  const ic = {
    success: `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>`,
    error: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>`,
  }[type] || `<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`
  document.getElementById('_t')?.remove()
  document.body.insertAdjacentHTML('beforeend', `<div id="_t" style="position:fixed;top:20px;right:20px;z-index:99999;display:flex;align-items:center;gap:10px;padding:12px 18px;background:#1e1b4b;border-left:4px solid ${c};border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.4);font-size:14px;color:#fff;animation:_ta .3s ease"><svg xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;color:${c};flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${ic}</svg><span>${msg}</span></div><style>@keyframes _ta{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}</style>`)
  clearTimeout(_t)
  _t = setTimeout(() => document.getElementById('_t')?.remove(), 3000)
}

const onResize = () => { isSidebarOpen.value = window.innerWidth >= 1024 }
onMounted(() => { applyTheme(theme.value); onResize(); window.addEventListener('resize', onResize) })
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
aside::-webkit-scrollbar { display: none }
aside { -ms-overflow-style: none; scrollbar-width: none }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
