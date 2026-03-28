import request from '@/utils/request'
import { API_ENDPOINTS } from '@/constants'
import type { User } from '@/types'
import { mockUserService } from './mockService'

class UserService {
  private useMock = import.meta.env.DEV

  async login(params: any): Promise<any> {
    if (this.useMock) {
      return mockUserService.login(params.username, params.password)
    }
    try {
      const response = await request.post(API_ENDPOINTS.USERS_LOGIN, params)
      return response
    } catch (error) {
      console.error('登录失败:', error)
      return mockUserService.login(params.username, params.password)
    }
  }

  async getUserList(params?: any): Promise<any> {
    if (this.useMock) {
      return mockUserService.getUserList(params?.page || 1, params?.pageSize || 10)
    }
    try {
      const response = await request.get(API_ENDPOINTS.USERS_LIST, { params })
      return response
    } catch (error) {
      console.error('获取用户列表失败:', error)
      return mockUserService.getUserList(params?.page || 1, params?.pageSize || 10)
    }
  }

  async addUser(userData: Partial<User>): Promise<any> {
    if (this.useMock) {
      return mockUserService.createUser(userData)
    }
    try {
      const response = await request.post(API_ENDPOINTS.USERS_ADD, userData)
      return response
    } catch (error) {
      console.error('新增用户失败:', error)
      return mockUserService.createUser(userData)
    }
  }

  async editUser(id: number | string, userData: Partial<User>): Promise<any> {
    if (this.useMock) {
      return mockUserService.updateUser(String(id), userData)
    }
    try {
      const response = await request.put(`${API_ENDPOINTS.USERS_EDIT}/${id}`, userData)
      return response
    } catch (error) {
      console.error('编辑用户失败:', error)
      return mockUserService.updateUser(String(id), userData)
    }
  }

  async deleteUser(id: number | string): Promise<any> {
    if (this.useMock) {
      return mockUserService.deleteUser(String(id))
    }
    try {
      const response = await request.delete(`${API_ENDPOINTS.USERS_DELETE}/${id}`)
      return response
    } catch (error) {
      console.error('删除用户失败:', error)
      return mockUserService.deleteUser(String(id))
    }
  }
}

export const userService = new UserService()
export default userService
