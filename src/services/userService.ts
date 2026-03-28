import request from '@/utils/request'
import { API_ENDPOINTS } from '@/constants'
import type { 
  User, 
  UserListResponse, 
  LoginParams, 
  LoginResponse, 
  ApiResponse 
} from '@/types'

/**
 * 用户服务类
 * 统一管理所有用户相关 API 调用
 */
class UserService {
  /**
   * 用户登录
   * @param params 登录参数
   */
  async login(params: LoginParams): Promise<ApiResponse<LoginResponse>> {
    const response = await request.post(API_ENDPOINTS.USERS_LOGIN, params)
    return response
  }

  /**
   * 获取用户列表
   * @param params 查询参数
   */
  async getUserList(params?: {
    keyword?: string
    role?: string
    status?: string
    page?: number
    pageSize?: number
  }): Promise<ApiResponse<UserListResponse>> {
    const response = await request.get(API_ENDPOINTS.USERS_LIST, { params })
    return response
  }

  /**
   * 新增用户
   * @param userData 用户数据
   */
  async addUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await request.post(API_ENDPOINTS.USERS_ADD, userData)
    return response
  }

  /**
   * 编辑用户
   * @param id 用户ID
   * @param userData 用户数据
   */
  async editUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await request.put(`${API_ENDPOINTS.USERS_EDIT}/${id}`, userData)
    return response
  }

  /**
   * 删除用户
   * @param id 用户ID
   */
  async deleteUser(id: number): Promise<ApiResponse> {
    const response = await request.delete(`${API_ENDPOINTS.USERS_DELETE}/${id}`)
    return response
  }
}

export const userService = new UserService()
export default userService
