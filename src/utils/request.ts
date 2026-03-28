import axios from 'axios'
import { useUiStore } from '@/stores/ui'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// 请求拦截器：附加 token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const { code, message } = response.data

    // 业务层成功
    if (code === 200 || code === undefined) {
      return response.data
    }

    // token 失效
    if (code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      const uiStore = useUiStore()
      uiStore.showError('登录已过期，请重新登录')
      window.location.href = '/login'
      return Promise.reject(response.data)
    }

    // 其他业务错误
    const uiStore = useUiStore()
    uiStore.showError(message || '请求失败')
    return Promise.reject(response.data)
  },
  error => {
    const uiStore = useUiStore()
    
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 400:
          uiStore.showError(data?.message || '请求参数错误')
          break
        case 401:
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          uiStore.showError('登录已过期，请重新登录')
          window.location.href = '/login'
          break
        case 403:
          uiStore.showError('没有权限访问')
          break
        case 404:
          uiStore.showError('请求资源不存在')
          break
        case 500:
          uiStore.showError('服务器内部错误')
          break
        default:
          uiStore.showError(data?.message || '网络错误')
      }
    } else {
      uiStore.showError('网络连接失败，请检查网络')
    }
    
    return Promise.reject(error)
  }
)

// 简单的 web_fetch 函数（用于 GitHub 趋势页面）
export const web_fetch = async (url: string) => {
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    console.error('web_fetch error:', error)
    throw error
  }
}

export default request
