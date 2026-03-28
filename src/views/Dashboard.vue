<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <StatCard
        title="用户总数"
        :value="stats.users"
        icon-path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        :trend="12"
        clickable
        @click="navigateTo('/user')"
      />
      <StatCard
        title="项目总数"
        :value="stats.projects"
        icon-path="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        :trend="8"
        clickable
        @click="navigateTo('/project')"
      />
      <StatCard
        title="运行中"
        :value="stats.running"
        icon-path="M13 10V3L4 14h7v7l9-11h-7z"
        :trend="5"
      />
      <StatCard
        title="依赖安装"
        :value="stats.installed"
        icon-path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        :trend="15"
      />
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">项目技术栈分布</h3>
        </div>
        <div class="chart-content">
          <div class="framework-stats">
            <div
              v-for="(count, framework) in frameworkStats"
              :key="framework"
              class="framework-item"
            >
              <div class="framework-info">
                <span class="framework-name">{{ framework }}</span>
                <span class="framework-count">{{ count }}</span>
              </div>
              <div class="framework-bar">
                <div
                  class="framework-fill"
                  :style="{ width: getPercentage(count) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">最近活动</h3>
        </div>
        <div class="chart-content">
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="activity.type === 'project'" stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  <path v-else-if="activity.type === 'user'" stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <h3 class="section-title">快捷入口</h3>
      <div class="actions-grid">
        <button
          v-for="action in quickActions"
          :key="action.path"
          @click="navigateTo(action.path)"
          class="action-btn"
        >
          <div class="action-icon" :style="{ background: action.color }">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="action.icon" />
            </svg>
          </div>
          <span class="action-text">{{ action.title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { StatCard } from '@/components'

const router = useRouter()
const projectStore = useProjectStore()

// 统计数据
const stats = ref({
  users: 8,
  projects: 0,
  running: 0,
  installed: 0,
})

// 框架统计
const frameworkStats = computed(() => {
  const grouped: Record<string, number> = {}
  projectStore.projects.forEach(project => {
    const framework = project.framework || 'Unknown'
    grouped[framework] = (grouped[framework] || 0) + 1
  })
  return grouped
})

// 最近活动
const recentActivities = ref([
  { id: 1, type: 'project', text: 'qclaw-admin 项目已启动', time: '2分钟前' },
  { id: 2, type: 'user', text: '新用户 张三 已注册', time: '15分钟前' },
  { id: 3, type: 'project', text: 'my-vue-app 依赖安装完成', time: '30分钟前' },
  { id: 4, type: 'run', text: 'react-project 运行中', time: '1小时前' },
])

// 快捷入口
const quickActions = [
  {
    title: '扫描项目',
    path: '/project',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    color: 'linear-gradient(135deg, #7b2ff7 0%, #00d9ff 100%)',
  },
  {
    title: '用户管理',
    path: '/user',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    title: 'GitHub趋势',
    path: '/github',
    icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
    color: 'linear-gradient(135deg, #333 0%, #666 100%)',
  },
]

// 计算百分比
const getPercentage = (count: number): number => {
  const total = Object.values(frameworkStats.value).reduce((a, b) => a + b, 0)
  return total > 0 ? Math.round((count / total) * 100) : 0
}

// 导航
const navigateTo = (path: string) => {
  router.push(path)
}

// 加载数据
onMounted(async () => {
  try {
    await projectStore.scanProjects()
    stats.value.projects = projectStore.total
    stats.value.running = projectStore.runningProjects.length
    stats.value.installed = projectStore.installedProjects.length
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})
</script>

<style scoped>
.dashboard {
  @apply space-y-6;
}

.stats-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4;
}

.charts-section {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-4;
}

.chart-card {
  @apply rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)];
}

.chart-header {
  @apply px-5 py-4 border-b border-white/[0.06];
}

.chart-title {
  @apply text-sm font-semibold text-white/90;
}

.chart-content {
  @apply p-5;
}

.framework-stats {
  @apply space-y-3;
}

.framework-item {
  @apply space-y-1.5;
}

.framework-info {
  @apply flex items-center justify-between;
}

.framework-name {
  @apply text-sm text-white/60;
}

.framework-count {
  @apply text-sm text-white/90 font-medium;
}

.framework-bar {
  @apply h-2 bg-white/[0.06] rounded-full overflow-hidden;
}

.framework-fill {
  @apply h-full bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] rounded-full transition-all duration-300;
}

.activity-list {
  @apply space-y-3;
}

.activity-item {
  @apply flex items-center gap-3;
}

.activity-icon {
  @apply w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0;
}

.activity-icon.project {
  @apply bg-[#7b2ff7]/20 text-[#7b2ff7];
}

.activity-icon.user {
  @apply bg-emerald-500/20 text-emerald-400;
}

.activity-icon.run {
  @apply bg-blue-500/20 text-blue-400;
}

.activity-content {
  @apply flex-1 min-w-0;
}

.activity-text {
  @apply text-sm text-white/80 truncate;
}

.activity-time {
  @apply text-xs text-white/40;
}

.quick-actions {
  @apply space-y-4;
}

.section-title {
  @apply text-base font-semibold text-white/90;
}

.actions-grid {
  @apply grid grid-cols-2 sm:grid-cols-4 gap-4;
}

.action-btn {
  @apply flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
         hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200;
}

.action-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(123,47,247,0.3)];
}

.action-text {
  @apply text-sm text-white/70;
}
</style>
