import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
  // 状态
  const projectList = ref<any[]>([])
  const currentProject = ref<any>(null)
  const loading = ref<boolean>(false)

  // 方法
  const setProjectList = (list: any[]) => {
    projectList.value = list
  }

  const setCurrentProject = (project: any) => {
    currentProject.value = project
  }

  const setLoading = (status: boolean) => {
    loading.value = status
  }

  return {
    projectList,
    currentProject,
    loading,
    setProjectList,
    setCurrentProject,
    setLoading
  }
})
