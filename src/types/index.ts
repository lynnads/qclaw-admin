// 用户类型
export interface User {
  id: string | number
  name: string
  username?: string
  email: string
  avatar?: string
  role?: string
  status?: 'active' | 'disabled'
  createdAt?: string
  createTime?: string  // 兼容字段别名
  updatedAt?: string
}

// 项目类型
export interface Project {
  id: string
  name: string
  path?: string
  description?: string
  owner?: string
  framework?: string
  packageManager?: string
  depsInstalled?: boolean
  running?: boolean
  nodeVersion?: string
  port?: number
  pid?: number
  installing?: boolean
  status?: 'active' | 'inactive' | 'archived'
  createdAt?: string
  updatedAt?: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

// 用户列表响应
export interface UserListResponse {
  list: User[]
  users?: User[]
  total: number
  page?: number
  pageSize?: number
}

// 项目扫描结果
export interface ScanResult extends ApiResponse {
  data?: {
    projects: Project[]
    total: number
  }
}

// 分页类型
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

// 登录请求类型
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应类型
export interface LoginResponse {
  token: string
  userInfo?: User
  user?: User
}

// 登录参数
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

