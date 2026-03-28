import request from '@/utils/request'

// 用户相关接口
export const userApi = {
  // 登录
  login: (data: { username: string; password: string }) =>
    request.post('/api/login', data),
  
  // 获取用户列表
  getUserList: (params?: any) =>
    request.get('/api/users', { params }),
  
  // 获取用户详情
  getUserDetail: (id: string) =>
    request.get(`/api/users/${id}`),
  
  // 更新用户
  updateUser: (id: string, data: any) =>
    request.put(`/api/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id: string) =>
    request.delete(`/api/users/${id}`)
}

// 项目相关接口
export const projectApi = {
  // 获取项目列表
  getProjectList: (params?: any) =>
    request.get('/api/projects', { params }),
  
  // 获取项目详情
  getProjectDetail: (id: string) =>
    request.get(`/api/projects/${id}`),
  
  // 创建项目
  createProject: (data: any) =>
    request.post('/api/projects', data),
  
  // 更新项目
  updateProject: (id: string, data: any) =>
    request.put(`/api/projects/${id}`, data),
  
  // 删除项目
  deleteProject: (id: string) =>
    request.delete(`/api/projects/${id}`)
}

// 其他接口可继续添加...
export default {
  userApi,
  projectApi
}
