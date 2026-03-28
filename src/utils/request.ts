import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

// 1. 创建Axios实例，配置基础信息
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3456', // 从环境变量中获取接口基础地址，区分开发/生产
  timeout: 10000, // 超时时间：10秒，避免请求卡死
  headers: {
    'Content-Type': 'application/json;charset=utf-8' // 统一请求头格式
  }
})

// 2. 定义加载动画实例，用于全局加载提示
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

// 3. 请求拦截器：发送请求前执行（添加token、显示加载动画）
request.interceptors.request.use(
  (config) => {
    // 显示加载动画（全局统一，避免重复出现）
    loadingInstance = ElLoading.service({
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.1)'
    })
    // 自动添加token：从localStorage中获取token，添加到请求头（适配登录后权限验证）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // 格式：Bearer + 空格 + token
    }
    return config
  },
  (error) => {
    // 请求发送失败，关闭加载动画，提示错误
    if (loadingInstance) loadingInstance.close()
    ElMessage.error('请求发送失败，请检查网络连接')
    return Promise.reject(error)
  }
)

// 4. 响应拦截器：接收响应后执行（处理响应数据、关闭加载动画、统一错误提示）
request.interceptors.response.use(
  (response) => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close()
    // 直接返回响应体中的data，避免每次接口都要写 response.data
    return response.data
  },
  (error) => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close()
    // 统一错误提示，区分不同错误场景
    const errorMsg = error.response?.data?.message || error.message || '请求失败，请稍后重试'
    ElMessage.error(errorMsg)
    // 特殊错误处理：401（未登录/Token过期），自动跳转到登录页
    if (error.response?.status === 401) {
      localStorage.removeItem('token') // 清除无效token
      window.location.href = '/login' // 跳转到登录页
    }
    return Promise.reject(error)
  }
)

// 5. 导出请求实例，供全局使用
export default request
