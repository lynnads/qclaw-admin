import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '@/services/userService'
import type { LoginParams, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<User | null>(null)
  const isLoading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  
  const username = computed(() => userInfo.value?.name || 'Admin')
  const userRole = computed(() => userInfo.value?.role || 'user')

  // 安全解析 userInfo
  const getUserInfo = (): User | null => {
    try {
      const raw = localStorage.getItem('userInfo')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  // 初始化用户信息
  const initUserInfo = () => {
    const savedUserInfo = getUserInfo()
    if (savedUserInfo) {
      userInfo.value = savedUserInfo
    }
  }

  // Actions
  const login = async (params: LoginParams): Promise<boolean> => {
    isLoading.value = true
    
    try {
      const response = await userService.login(params)
      
      if (response.code === 200 && response.data) {
        const newToken = response.data.token || ''
        const newUserInfo = response.data.userInfo || response.data.user || { name: params.username }
        
        // 保存 token
        token.value = newToken
        localStorage.setItem('token', newToken)
        
        // 保存用户信息
        userInfo.value = newUserInfo
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
        
        // 记住用户名
        if (params.remember) {
          localStorage.setItem('rememberUsername', params.username)
        } else {
          localStorage.removeItem('rememberUsername')
        }
        
        return true
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info: User | null) => {
    userInfo.value = info
    if (info) {
      localStorage.setItem('userInfo', JSON.stringify(info))
    } else {
      localStorage.removeItem('userInfo')
    }
  }

  // 获取记住的用户名
  const getRememberedUsername = (): string => {
    return localStorage.getItem('rememberUsername') || ''
  }

  return {
    // 状态
    token,
    userInfo,
    isLoading,
    
    // 计算属性
    isLoggedIn,
    username,
    userRole,
    
    // Actions
    login,
    logout,
    setToken,
    setUserInfo,
    initUserInfo,
    getRememberedUsername,
  }
})
