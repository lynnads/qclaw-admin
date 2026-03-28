import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { THEMES } from '@/constants'
import type { Notification } from '@/types'

export const useUiStore = defineStore('ui', () => {
  // 状态
  const sidebarCollapsed = ref(false)
  const theme = ref(localStorage.getItem('theme') || THEMES.DARK)
  const mobileMenuOpen = ref(false)
  const notifications = ref<Notification[]>([])
  
  // 加载状态
  const loading = ref({
    scanning: false,
    installing: false,
    running: false,
    saving: false,
  })

  // 计算属性
  const isDarkTheme = computed(() => theme.value === THEMES.DARK)
  
  const hasNotifications = computed(() => notifications.value.length > 0)

  // 主题管理
  const setTheme = (newTheme: typeof THEMES[keyof typeof THEMES]) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    setTheme(newTheme)
  }

  // 侧边栏管理
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  // 移动端菜单
  const openMobileMenu = () => {
    mobileMenuOpen.value = true
  }

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  // 通知管理
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 3000,
    }
    
    notifications.value.push(newNotification)
    
    // 自动移除
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
    
    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  // 快捷通知方法
  const showSuccess = (message: string, duration?: number) => {
    return addNotification({ type: 'success', message, duration })
  }

  const showError = (message: string, duration?: number) => {
    return addNotification({ type: 'error', message, duration })
  }

  const showWarning = (message: string, duration?: number) => {
    return addNotification({ type: 'warning', message, duration })
  }

  const showInfo = (message: string, duration?: number) => {
    return addNotification({ type: 'info', message, duration })
  }

  // 加载状态管理
  const setLoading = (key: keyof typeof loading.value, value: boolean) => {
    loading.value[key] = value
  }

  // 响应式处理
  const handleResize = () => {
    const isMobile = window.innerWidth < 1024
    if (isMobile) {
      sidebarCollapsed.value = true
    }
  }

  // 初始化
  const init = () => {
    // 应用主题
    document.documentElement.setAttribute('data-theme', theme.value)
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    handleResize() // 初始检查
  }

  const destroy = () => {
    window.removeEventListener('resize', handleResize)
  }

  return {
    // 状态
    sidebarCollapsed,
    theme,
    mobileMenuOpen,
    notifications,
    loading,
    
    // 计算属性
    isDarkTheme,
    hasNotifications,
    
    // 主题管理
    setTheme,
    toggleTheme,
    
    // 侧边栏管理
    toggleSidebar,
    setSidebarCollapsed,
    
    // 移动端菜单
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    
    // 通知管理
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // 加载状态
    setLoading,
    
    // 生命周期
    init,
    destroy,
  }
})
