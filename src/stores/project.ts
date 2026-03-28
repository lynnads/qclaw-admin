import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '@/services/projectService'
import type { Project } from '@/types'

export const useProjectStore = defineStore('project', () => {
  // 状态
  const projects = ref<Project[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 缓存
  const cache = ref<Map<string, { data: any; timestamp: number }>>(new Map())

  // 计算属性
  const installedProjects = computed(() => 
    projects.value.filter(p => p.depsInstalled)
  )
  
  const runningProjects = computed(() => 
    projects.value.filter(p => p.running)
  )

  const projectsByFramework = computed(() => {
    const grouped: Record<string, Project[]> = {}
    projects.value.forEach(project => {
      const framework = project.framework || 'Unknown'
      if (!grouped[framework]) grouped[framework] = []
      grouped[framework].push(project)
    })
    return grouped
  })

  // 缓存工具
  const getCache = (key: string) => {
    const item = cache.value.get(key)
    if (!item) return null
    if (Date.now() - item.timestamp > 5 * 60 * 1000) { // 5分钟过期
      cache.value.delete(key)
      return null
    }
    return item.data
  }

  const setCache = (key: string, data: any) => {
    cache.value.set(key, { data, timestamp: Date.now() })
  }

  // Actions
  const scanProjects = async (path?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const cacheKey = `scan_${path || 'default'}`
      const cached = getCache(cacheKey)
      
      if (cached) {
        projects.value = cached.projects
        total.value = cached.total
        return cached
      }

      const response = await projectService.scanProjects(path)
      
      if (response.code === 200) {
        projects.value = response.data.projects
        total.value = response.data.total
        setCache(cacheKey, response.data)
        return response.data
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '扫描失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const installDeps = async (projectPath: string, packageManager: string = 'npm') => {
    const project = projects.value.find(p => p.path === projectPath)
    if (project) project.installing = true

    try {
      const response = await projectService.installDeps(projectPath, packageManager)
      
      if (response.code === 200) {
        // 更新项目状态
        const index = projects.value.findIndex(p => p.path === projectPath)
        if (index !== -1) {
          projects.value[index].depsInstalled = true
          projects.value[index].installing = false
        }
        return response
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      if (project) project.installing = false
      throw err
    }
  }

  const runProject = async (projectPath: string, packageManager: string = 'npm') => {
    const project = projects.value.find(p => p.path === projectPath)
    if (project) project.running = true

    try {
      const response = await projectService.runProject(projectPath, packageManager)
      
      if (response.code === 200) {
        const index = projects.value.findIndex(p => p.path === projectPath)
        if (index !== -1) {
          projects.value[index].running = true
          projects.value[index].pid = response.data.pid
          projects.value[index].port = response.data.port
        }
        return response
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      if (project) project.running = false
      throw err
    }
  }

  const stopProject = async (projectPath: string) => {
    const project = projects.value.find(p => p.path === projectPath)
    if (project) project.running = false

    try {
      const response = await projectService.stopProject(projectPath)
      
      if (response.code === 200) {
        const index = projects.value.findIndex(p => p.path === projectPath)
        if (index !== -1) {
          projects.value[index].running = false
          projects.value[index].pid = undefined
          projects.value[index].port = undefined
        }
        return response
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      if (project) project.running = true
      throw err
    }
  }

  const switchNodeVersion = async (version: string) => {
    try {
      const response = await projectService.switchNodeVersion(version)
      
      if (response.code === 200) {
        // 更新所有项目的 Node 版本
        projects.value.forEach(project => {
          project.nodeVersion = version
        })
        return response
      } else {
        throw new Error(response.message)
      }
    } catch (err) {
      throw err
    }
  }

  // 搜索和过滤
  const searchProjects = (keyword: string) => {
    if (!keyword.trim()) return projects.value
    
    const lowerKeyword = keyword.toLowerCase()
    return projects.value.filter(project => 
      project.name.toLowerCase().includes(lowerKeyword) ||
      project.path.toLowerCase().includes(lowerKeyword) ||
      project.framework.toLowerCase().includes(lowerKeyword)
    )
  }

  const filterProjects = (filters: {
    framework?: string
    packageManager?: string
    depsInstalled?: boolean
  }) => {
    return projects.value.filter(project => {
      if (filters.framework && project.framework !== filters.framework) return false
      if (filters.packageManager && project.packageManager !== filters.packageManager) return false
      if (filters.depsInstalled !== undefined && project.depsInstalled !== filters.depsInstalled) return false
      return true
    })
  }

  return {
    // 状态
    projects,
    total,
    isLoading,
    error,
    
    // 计算属性
    installedProjects,
    runningProjects,
    projectsByFramework,
    
    // Actions
    scanProjects,
    installDeps,
    runProject,
    stopProject,
    switchNodeVersion,
    searchProjects,
    filterProjects,
  }
})
