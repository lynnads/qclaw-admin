<template>
  <div class="layout">
    <!-- 背景 -->
    <div class="layout-background">
      <div class="bg-gradient"></div>
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="logo-text" v-show="!sidebarCollapsed">QClaw Admin</span>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path v-for="(d, i) in item.icon" :key="i" stroke-linecap="round" stroke-linejoin="round" :d="d" />
          </svg>
          <span class="nav-text" v-show="!sidebarCollapsed">{{ item.title }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="toggleSidebar" class="toggle-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="{ 'rotate-180': !sidebarCollapsed }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- 顶部导航 -->
      <header class="top-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="header-actions">
          <!-- 主题切换 -->
          <button @click="toggleTheme" class="action-btn" :title="isDarkTheme ? '浅色模式' : '深色模式'">
            <svg v-if="isDarkTheme" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- 通知 -->
          <button class="action-btn relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="notification-dot"></span>
          </button>

          <!-- 用户下拉 -->
          <div class="user-dropdown">
            <div class="user-trigger">
              <div class="user-avatar">{{ userInitial }}</div>
              <span class="user-name">{{ username }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div class="user-menu">
              <div class="user-info">
                <p class="user-fullname">{{ username }}</p>
                <p class="user-role">管理员</p>
              </div>
              <button @click="handleLogout" class="logout-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <div class="page-content">
        <router-view />
      </div>
    </main>

    <!-- 移动端菜单按钮 -->
    <button @click="openMobileMenu" class="mobile-menu-btn">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- 移动端侧边栏 -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu">
        <aside class="mobile-sidebar" @click.stop>
          <div class="sidebar-header">
            <div class="logo">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="logo-text">QClaw Admin</span>
          </div>
          <nav class="sidebar-nav">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ active: isActive(item.path) }"
              @click="closeMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path v-for="(d, i) in item.icon" :key="i" stroke-linecap="round" stroke-linejoin="round" :d="d" />
              </svg>
              <span class="nav-text">{{ item.title }}</span>
            </router-link>
          </nav>
        </aside>
      </div>
    </Transition>

    <!-- 通知组件 -->
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { NotificationToast } from '@/components'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const uiStore = useUiStore()

const sidebarCollapsed = computed(() => uiStore.sidebarCollapsed)
const mobileMenuOpen = computed(() => uiStore.mobileMenuOpen)
const isDarkTheme = computed(() => uiStore.isDarkTheme)
const username = computed(() => auth.username)
const userInitial = computed(() => username.value.charAt(0).toUpperCase())

const menuItems = [
  {
    path: '/home',
    title: '首页',
    icon: ['M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'],
  },
  {
    path: '/dashboard',
    title: '仪表盘',
    icon: ['M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'],
  },
  {
    path: '/user',
    title: '用户管理',
    icon: ['M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'],
  },
  {
    path: '/project',
    title: '项目分析',
    icon: ['M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', 'M9 12l2 2 4-4'],
  },
  {
    path: '/github',
    title: 'GitHub趋势',
    icon: ['M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'],
  },
  {
    path: '/ai-assistant',
    title: 'AI助手',
    icon: ['M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'],
  },
]

const isActive = (path: string) => {
  if (path === '/home') return route.path === '/home'
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const pageTitle = computed(() => {
  const item = menuItems.find(m => {
    if (m.path === '/home') return route.path === '/home'
    return route.path.startsWith(m.path)
  })
  return item?.title || '后台管理'
})

const toggleSidebar = () => uiStore.toggleSidebar()
const toggleTheme = () => uiStore.toggleTheme()
const openMobileMenu = () => uiStore.openMobileMenu()
const closeMobileMenu = () => uiStore.closeMobileMenu()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    uiStore.closeMobileMenu()
  }
}

onMounted(() => {
  uiStore.init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  uiStore.destroy()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.layout {
  @apply min-h-screen flex text-white;
}

.layout-background {
  @apply fixed inset-0 -z-10;
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
  @apply -top-40 -left-40 w-[500px] h-[500px] bg-[#7b2ff7]/20;
}

.orb-2 {
  @apply -bottom-40 -right-40 w-[500px] h-[500px] bg-[#f107a3]/15;
  animation-delay: 1.5s;
}

.orb-3 {
  @apply top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d9ff]/10;
  animation-delay: 0.8s;
}

.bg-grid {
  @apply absolute inset-0 opacity-[0.02];
  background-image:
    linear-gradient(#fff 1px, transparent 1px),
    linear-gradient(90deg, #fff 1px, transparent 1px);
  background-size: 60px 60px;
}

/* 侧边栏 */
.sidebar {
  @apply fixed top-0 left-0 z-30 h-screen flex flex-col
         bg-white/[0.05] backdrop-blur-xl border-r border-white/[0.08]
         transition-all duration-300 ease-in-out overflow-hidden;
  width: 240px;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  @apply h-16 flex items-center px-4 border-b border-white/[0.08] flex-shrink-0;
}

.logo {
  @apply w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(123,47,247,0.3)];
}

.logo-text {
  @apply ml-3 text-sm font-bold whitespace-nowrap overflow-hidden transition-all duration-300;
}

.sidebar-nav {
  @apply flex-1 overflow-y-auto py-4 px-3 space-y-1;
}

.nav-item {
  @apply flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
         hover:bg-white/[0.08] text-white/60;
}

.nav-item.active {
  @apply bg-gradient-to-r from-[#7b2ff7]/30 to-[#00d9ff]/20 text-white border border-[#7b2ff7]/30;
}

.nav-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.nav-text {
  @apply whitespace-nowrap transition-all duration-300;
}

.sidebar-footer {
  @apply flex-shrink-0 border-t border-white/[0.08] p-2;
}

.toggle-btn {
  @apply w-full flex items-center justify-center py-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.08] transition-all duration-200;
}

/* 主内容区 */
.main-content {
  @apply flex flex-col min-h-screen transition-all duration-300 flex-1 ml-60;
}

.main-content.sidebar-collapsed {
  @apply ml-16;
}

.top-header {
  @apply sticky top-0 z-20 h-16 flex items-center justify-between px-6
         bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06];
}

.page-title {
  @apply text-base font-semibold text-white/90;
}

.header-actions {
  @apply flex items-center gap-2;
}

.action-btn {
  @apply w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08]
         flex items-center justify-center transition-all duration-200 text-white/60 hover:text-white;
}

.notification-dot {
  @apply absolute top-1.5 right-1.5 w-2 h-2 bg-[#f107a3] rounded-full ring-2 ring-[#0f0c29];
}

.user-dropdown {
  @apply relative;
}

.user-trigger {
  @apply flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] cursor-pointer transition-all duration-200;
}

.user-avatar {
  @apply w-7 h-7 rounded-full bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center text-white text-xs font-bold;
}

.user-name {
  @apply text-sm text-white/70;
}

.user-menu {
  @apply absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden
         bg-[#1a1630]/90 backdrop-blur-2xl border border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.4)]
         opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200;
}

.user-info {
  @apply px-4 py-3 border-b border-white/[0.08];
}

.user-fullname {
  @apply text-sm font-semibold text-white;
}

.user-role {
  @apply text-xs text-white/40 mt-0.5;
}

.logout-btn {
  @apply w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-150;
}

.page-content {
  @apply flex-1 p-6;
}

/* 移动端 */
.mobile-menu-btn {
  @apply fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff]
         shadow-[0_4px_24px_rgba(123,47,247,0.4)] flex items-center justify-center lg:hidden
         hover:scale-110 transition-transform duration-200;
}

.mobile-overlay {
  @apply fixed inset-0 z-50 lg:hidden;
}

.mobile-overlay::before {
  content: '';
  @apply absolute inset-0 bg-black/60 backdrop-blur-sm;
}

.mobile-sidebar {
  @apply absolute top-0 left-0 h-full w-60 bg-[#1a1630]/95 backdrop-blur-2xl border-r border-white/[0.10] flex flex-col;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-200;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .sidebar {
    @apply -translate-x-full;
  }
  
  .main-content {
    @apply ml-0;
  }
}
</style>
