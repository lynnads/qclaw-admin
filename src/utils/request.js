import axios from 'axios'

// ─── 轻量消息提示（原生实现，无第三方依赖）────────────────────────────
let toastTimer = null

const toastColors = {
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
}

const showToast = (msg, type = 'error') => {
  // 移除旧提示
  const old = document.getElementById('toast-box')
  if (old) old.remove()

  const color = toastColors[type] || toastColors.error
  const iconSvg =
    {
      success: `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>`,
      error: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>`,
      warning: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>`,
      info: `<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
    }[type] || toastColors.error

  const html = `
    <div id="toast-box" style="
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      background: #fff;
      border-left: 4px solid ${color};
      border-radius: 6px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      font-size: 14px;
      color: #333;
      animation: toastIn 0.3s ease;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;color:${color};flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        ${iconSvg}
      </svg>
      <span>${msg}</span>
    </div>
    <style>
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(20px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    </style>
  `
  document.body.insertAdjacentHTML('beforeend', html)

  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    const el = document.getElementById('toast-box')
    if (el) el.remove()
  }, 3000)
}

// ─── axios 实例 ──────────────────────────────────────────────────────────
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
      showToast('登录已过期，请重新登录', 'error')
      window.location.href = '/#/login'
      return Promise.reject(response.data)
    }

    showToast(message || '请求失败', 'error')
    return Promise.reject(response.data)
  },
  error => {
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 400:
          showToast(data?.message || '请求参数错误', 'error')
          break
        case 401:
          localStorage.removeItem('token')
          showToast('登录已过期，请重新登录', 'error')
          window.location.href = '/#/login'
          break
        case 403:
          showToast('没有权限访问', 'error')
          break
        case 404:
          showToast('请求资源不存在', 'error')
          break
        case 500:
          showToast('服务器内部错误', 'error')
          break
        default:
          showToast(data?.message || '网络错误', 'error')
      }
    } else {
      showToast('网络连接失败，请检查网络', 'error')
    }
    return Promise.reject(error)
  }
)

export default request
