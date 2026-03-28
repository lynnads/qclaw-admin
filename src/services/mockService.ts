/**
 * Mock 数据服务
 * 用于开发环境模拟后端接口
 * 生产环境应替换为真实后端接口
 */

import type { Project, ApiResponse, ScanResult, User } from '@/types'

// 模拟项目数据
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'qclaw-admin',
    path: 'D:\\workProject\\sele_project\\qclaw-admin',
    framework: 'Vue',
    packageManager: 'npm',
    depsInstalled: true,
    running: false,
    nodeVersion: 'v22.10.0',
    description: '企业级后台管理系统',
  },
  {
    id: '2',
    name: 'edict-dashboard',
    path: 'E:\\小龙虾项目\\edict\\dashboard',
    framework: 'Vue',
    packageManager: 'npm',
    depsInstalled: true,
    running: true,
    nodeVersion: 'v22.10.0',
    port: 7891,
    description: '三省六部看板系统',
  },
  {
    id: '3',
    name: 'react-app',
    path: 'D:\\projects\\react-app',
    framework: 'React',
    packageManager: 'npm',
    depsInstalled: false,
    running: false,
    nodeVersion: 'v22.10.0',
    description: 'React 示例项目',
  },
  {
    id: '4',
    name: 'next-blog',
    path: 'D:\\projects\\next-blog',
    framework: 'Next.js',
    packageManager: 'pnpm',
    depsInstalled: true,
    running: false,
    nodeVersion: 'v22.10.0',
    description: 'Next.js 博客系统',
  },
  {
    id: '5',
    name: 'express-api',
    path: 'D:\\projects\\express-api',
    framework: 'Express',
    packageManager: 'npm',
    depsInstalled: true,
    running: true,
    nodeVersion: 'v22.10.0',
    port: 3456,
    description: 'Express 后端 API',
  },
]

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    name: 'admin',
    username: 'admin',
    email: 'admin@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    name: 'user1',
    username: 'user1',
    email: 'user1@example.com',
    role: '用户',
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: '3',
    name: 'user2',
    username: 'user2',
    email: 'user2@example.com',
    role: '用户',
    status: 'active',
    createdAt: '2026-02-01',
  },
]

/**
 * Mock 项目服务
 */
export class MockProjectService {
  /**
   * 扫描项目
   */
  async scanProjects(path?: string): Promise<ScanResult> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    const filteredProjects = path
      ? mockProjects.filter(p => p.path?.includes(path))
      : mockProjects

    return {
      code: 200,
      message: '扫描成功',
      data: {
        projects: filteredProjects,
        total: filteredProjects.length,
      },
    }
  }

  /**
   * 安装依赖
   */
  async installDeps(projectPath: string, _packageManager: string = 'npm'): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const project = mockProjects.find(p => p.path === projectPath)
    if (project) {
      project.depsInstalled = true
    }

    return {
      code: 200,
      message: '依赖安装成功',
      data: { success: true },
    }
  }

  /**
   * 运行项目
   */
  async runProject(
    projectPath: string,
    _packageManager: string = 'npm'
  ): Promise<ApiResponse<{ pid: number; port: number }>> {
    await new Promise(resolve => setTimeout(resolve, 800))

    const project = mockProjects.find(p => p.path === projectPath)
    const port = 3000 + Math.floor(Math.random() * 1000)
    const pid = Math.floor(Math.random() * 10000)

    if (project) {
      project.running = true
      project.port = port
      project.pid = pid
    }

    return {
      code: 200,
      message: '项目启动成功',
      data: { pid, port },
    }
  }

  /**
   * 停止项目
   */
  async stopProject(projectPath: string): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const project = mockProjects.find(p => p.path === projectPath)
    if (project) {
      project.running = false
      project.port = undefined
      project.pid = undefined
    }

    return {
      code: 200,
      message: '项目已停止',
      data: { success: true },
    }
  }

  /**
   * 切换 Node 版本
   */
  async switchNodeVersion(version: string): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    mockProjects.forEach(project => {
      project.nodeVersion = version
    })

    return {
      code: 200,
      message: 'Node 版本切换成功',
      data: { success: true },
    }
  }
}

/**
 * Mock 用户服务
 */
export class MockUserService {
  /**
   * 登录
   */
  async login(username: string, password: string): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (username === 'admin' && password === '123456') {
      return {
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock_token_' + Date.now(),
          user: mockUsers[0],
        },
      }
    }

    return {
      code: 401,
      message: '用户名或密码错误',
    }
  }

  /**
   * 获取用户列表
   */
  async getUserList(page: number = 1, pageSize: number = 10): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      code: 200,
      message: '获取成功',
      data: {
        list: mockUsers.slice(start, end),
        users: mockUsers.slice(start, end),
        total: mockUsers.length,
        page,
        pageSize,
      },
    }
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(id: string): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const user = mockUsers.find(u => String(u.id) === String(id))
    if (user) {
      return {
        code: 200,
        message: '获取成功',
        data: user,
      }
    }

    return {
      code: 404,
      message: '用户不存在',
    }
  }

  /**
   * 创建用户
   */
  async createUser(userData: any): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: userData.name || userData.username,
      username: userData.username || userData.name,
      email: userData.email,
      role: userData.role || '用户',
      status: userData.status || 'active',
      createdAt: new Date().toISOString().split('T')[0],
    }

    mockUsers.push(newUser)

    return {
      code: 200,
      message: '创建成功',
      data: newUser,
    }
  }

  /**
   * 更新用户
   */
  async updateUser(id: string, userData: any): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = mockUsers.find(u => String(u.id) === String(id))
    if (user) {
      Object.assign(user, userData)
      return {
        code: 200,
        message: '更新成功',
        data: user,
      }
    }

    return {
      code: 404,
      message: '用户不存在',
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const index = mockUsers.findIndex(u => String(u.id) === String(id))
    if (index !== -1) {
      mockUsers.splice(index, 1)
      return {
        code: 200,
        message: '删除成功',
        data: { success: true },
      }
    }

    return {
      code: 404,
      message: '用户不存在',
    }
  }
}

export const mockProjectService = new MockProjectService()
export const mockUserService = new MockUserService()

