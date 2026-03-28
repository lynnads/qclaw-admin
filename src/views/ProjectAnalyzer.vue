<template>
  <div class="project-analyzer">
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索项目名称、路径..."
            class="search-input"
          />
        </div>
        <CustomSelect v-model="filterFramework" :options="frameworkOptions" placeholder="全部框架" />
        <CustomSelect v-model="filterPackageManager" :options="packageManagerOptions" placeholder="全部包管理器" />
      </div>
      <div class="toolbar-right">
        <button @click="scanProjects" class="scan-btn" :class="{ loading: projectStore.isLoading }">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ projectStore.isLoading ? '扫描中...' : '重新扫描' }}
        </button>
      </div>
    </div>

    <!-- 项目统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">项目总数</span>
        <span class="stat-value">{{ filteredProjects.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">已安装依赖</span>
        <span class="stat-value text-emerald-400">{{ installedCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">运行中</span>
        <span class="stat-value text-blue-400">{{ runningCount }}</span>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="projects-grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.path"
        :project="project"
        @install="handleInstall"
        @run="handleRun"
        @stop="handleStop"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProjects.length === 0 && !projectStore.isLoading" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
      <p>暂无项目，请扫描目录</p>
    </div>

    <!-- 加载遮罩 -->
    <LoadingOverlay :visible="projectStore.isLoading" text="扫描项目中..." />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useUiStore } from '@/stores/ui'
import { ProjectCard, LoadingOverlay, CustomSelect } from '@/components'
import type { Project } from '@/types'

const projectStore = useProjectStore()
const uiStore = useUiStore()

// 过滤条件
const searchKeyword = ref('')
const filterFramework = ref('')
const filterPackageManager = ref('')

// 计算属性
const frameworks = computed(() => {
  const set = new Set(projectStore.projects.map(p => p.framework))
  return Array.from(set).sort()
})

const frameworkOptions = computed(() => [
  { value: '', label: '全部框架' },
  ...frameworks.value.map(f => ({ value: f, label: f }))
])

const packageManagerOptions = [
  { value: '', label: '全部包管理器' },
  { value: 'npm', label: 'npm' },
  { value: 'pnpm', label: 'pnpm' },
  { value: 'yarn', label: 'yarn' },
]

const filteredProjects = computed(() => {
  let projects = projectStore.projects

  // 搜索过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    projects = projects.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.path.toLowerCase().includes(keyword)
    )
  }

  // 框架过滤
  if (filterFramework.value) {
    projects = projects.filter(p => p.framework === filterFramework.value)
  }

  // 包管理器过滤
  if (filterPackageManager.value) {
    projects = projects.filter(p => p.packageManager === filterPackageManager.value)
  }

  return projects
})

const installedCount = computed(() =>
  filteredProjects.value.filter(p => p.depsInstalled).length
)

const runningCount = computed(() =>
  filteredProjects.value.filter(p => p.running).length
)

// 方法
const scanProjects = async () => {
  try {
    await projectStore.scanProjects()
    uiStore.showSuccess('项目扫描完成')
  } catch (error) {
    uiStore.showError('扫描失败，请重试')
  }
}

const handleInstall = async (project: Project) => {
  try {
    await projectStore.installDeps(project.path, project.packageManager)
    uiStore.showSuccess(`${project.name} 依赖安装完成`)
  } catch (error) {
    uiStore.showError(`${project.name} 依赖安装失败`)
  }
}

const handleRun = async (project: Project) => {
  try {
    await projectStore.runProject(project.path, project.packageManager)
    uiStore.showSuccess(`${project.name} 已启动`)
  } catch (error) {
    uiStore.showError(`${project.name} 启动失败`)
  }
}

const handleStop = async (project: Project) => {
  try {
    await projectStore.stopProject(project.path)
    uiStore.showInfo(`${project.name} 已停止`)
  } catch (error) {
    uiStore.showError(`${project.name} 停止失败`)
  }
}

// 初始化
onMounted(() => {
  scanProjects()
})
</script>

<style scoped>
.project-analyzer {
  @apply space-y-4;
}

.toolbar {
  @apply flex items-center justify-between gap-4 flex-wrap;
}

.toolbar-left {
  @apply flex items-center gap-3 flex-wrap;
}

.search-box {
  @apply relative flex items-center;
}

.search-box svg {
  @apply absolute left-3 text-white/30 pointer-events-none;
}

.search-input {
  @apply w-64 h-10 pl-10 pr-4 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white
         placeholder-white/25 outline-none focus:bg-white/[0.09] focus:border-[#7b2ff7]/40
         focus:shadow-[0_0_0_3px_rgba(123,47,247,0.12)] hover:border-white/[0.14] transition-all duration-200;
}

.toolbar-right {
  @apply flex items-center gap-3;
}

.scan-btn {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white
         bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] shadow-[0_4px_16px_rgba(123,47,247,0.3)]
         hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)] hover:scale-[1.02] active:scale-[0.98]
         transition-all duration-200;
}

.scan-btn.loading {
  @apply animate-pulse opacity-80;
}

.stats-bar {
  @apply flex items-center gap-6 p-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08];
}

.stat-item {
  @apply flex items-center gap-2;
}

.stat-label {
  @apply text-sm text-white/40;
}

.stat-value {
  @apply text-sm font-semibold text-white/90;
}

.projects-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-16 text-white/25;
}
</style>
