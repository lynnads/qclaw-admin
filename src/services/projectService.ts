import request from '@/utils/request'
import { API_ENDPOINTS } from '@/constants'
import { mockProjectService } from './mockService'

class ProjectService {
  private useMock = import.meta.env.DEV

  async scanProjects(path?: string): Promise<any> {
    if (this.useMock) {
      return mockProjectService.scanProjects(path)
    }
    try {
      const response = await request.get(API_ENDPOINTS.PROJECTS_SCAN, { params: { path } })
      return response
    } catch (error) {
      console.error('扫描项目失败:', error)
      return mockProjectService.scanProjects(path)
    }
  }

  async installDeps(projectPath: string, packageManager: string = 'npm'): Promise<any> {
    if (this.useMock) {
      return mockProjectService.installDeps(projectPath, packageManager)
    }
    try {
      const response = await request.post(API_ENDPOINTS.PROJECTS_INSTALL, { projectPath, packageManager })
      return response
    } catch (error) {
      console.error('安装依赖失败:', error)
      return mockProjectService.installDeps(projectPath, packageManager)
    }
  }

  async runProject(projectPath: string, packageManager: string = 'npm'): Promise<any> {
    if (this.useMock) {
      return mockProjectService.runProject(projectPath, packageManager)
    }
    try {
      const response = await request.post(API_ENDPOINTS.PROJECTS_RUN, { projectPath, packageManager })
      return response
    } catch (error) {
      console.error('运行项目失败:', error)
      return mockProjectService.runProject(projectPath, packageManager)
    }
  }

  async stopProject(projectPath: string): Promise<any> {
    if (this.useMock) {
      return mockProjectService.stopProject(projectPath)
    }
    try {
      const response = await request.post(API_ENDPOINTS.PROJECTS_STOP, { projectPath })
      return response
    } catch (error) {
      console.error('停止项目失败:', error)
      return mockProjectService.stopProject(projectPath)
    }
  }

  async switchNodeVersion(version: string): Promise<any> {
    if (this.useMock) {
      return mockProjectService.switchNodeVersion(version)
    }
    try {
      const response = await request.post(API_ENDPOINTS.PROJECTS_SWITCH_NODE, { version })
      return response
    } catch (error) {
      console.error('切换 Node 版本失败:', error)
      return mockProjectService.switchNodeVersion(version)
    }
  }
}

export const projectService = new ProjectService()
export default projectService
