// 项目类型定义
export interface Project {
  name: string
  path: string
  nodeVersion: string
  depsInstalled: boolean
  packageManager: 'npm' | 'pnpm' | 'yarn'
  version: string
  framework: string
  installing?: boolean
  running?: boolean
  pid?: number
  port?: number
}

export interface ScanResult {
  code: number
  message: string
  data: {
    projects: Project[]
    total: number
  }
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 用户角色和状态类型
export type UserRole = '管理员' | '用户' | '访客'
export type UserStatus = 'active' | 'disabled'

// 用户类型
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createTime: string
}

export interface UserListResponse {
  list: User[]
  total: number
  page: number
  pageSize: number
}

// 登录类型
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  token: string
  userInfo: {
    id: number
    name: string
    role: string
  }
}

// UI 状态类型
export interface UiState {
  sidebarCollapsed: boolean
  theme: 'dark' | 'light'
  loading: {
    scanning: boolean
    installing: boolean
    running: boolean
  }
}

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
