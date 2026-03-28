import request from '@/utils/request'
import { API_ENDPOINTS } from '@/constants'
import type { Project, ApiResponse, ScanResult } from '@/types'

/**
 * 项目服务类
 * 统一管理所有项目相关 API 调用
 */
class ProjectService {
  /**
   * 扫描项目
   * @param path 扫描路径（可选）
   */
  async scanProjects(path?: string): Promise<ScanResult> {
    const response = await request.get(API_ENDPOINTS.PROJECTS_SCAN, {
      params: { path },
    })
    return response
  }

  /**
   * 安装项目依赖
   * @param projectPath 项目路径
   * @param packageManager 包管理器
   */
  async installDeps(
    projectPath: string,
    packageManager: string = 'npm'
  ): Promise<ApiResponse> {
    const response = await request.post(API_ENDPOINTS.PROJECTS_INSTALL, {
      projectPath,
      packageManager,
    })
    return response
  }

  /**
   * 运行项目
   * @param projectPath 项目路径
   * @param packageManager 包管理器
   */
  async runProject(
    projectPath: string,
    packageManager: string = 'npm'
  ): Promise<ApiResponse<{ pid: number; port: number }>> {
    const response = await request.post(API_ENDPOINTS.PROJECTS_RUN, {
      projectPath,
      packageManager,
    })
    return response
  }

  /**
   * 停止项目
   * @param projectPath 项目路径
   */
  async stopProject(projectPath: string): Promise<ApiResponse> {
    const response = await request.post(API_ENDPOINTS.PROJECTS_STOP, {
      projectPath,
    })
    return response
  }

  /**
   * 切换 Node 版本
   * @param version Node 版本
   */
  async switchNodeVersion(version: string): Promise<ApiResponse> {
    const response = await request.post(API_ENDPOINTS.PROJECTS_SWITCH_NODE, {
      version,
    })
    return response
  }
}

export const projectService = new ProjectService()
export default projectService
