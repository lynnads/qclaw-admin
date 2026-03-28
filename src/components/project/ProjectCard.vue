<template>
  <div class="project-card" :class="{ running: project.running }">
    <!-- 项目头部 -->
    <div class="project-header">
      <div class="project-info">
        <div class="project-icon" :style="{ background: frameworkColor }">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div class="project-details">
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-path">{{ truncatedPath }}</p>
        </div>
      </div>
      <div class="project-status">
        <span v-if="project.running" class="status-badge running">
          <span class="status-dot"></span>
          运行中
        </span>
        <span v-else class="status-badge stopped">
          <span class="status-dot"></span>
          已停止
        </span>
      </div>
    </div>

    <!-- 项目信息 -->
    <div class="project-info-grid">
      <div class="info-item">
        <span class="info-label">框架</span>
        <span class="info-value">{{ project.framework }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Node</span>
        <span class="info-value">{{ project.nodeVersion }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">包管理器</span>
        <span class="info-value">{{ project.packageManager }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">依赖状态</span>
        <span class="info-value" :class="{ installed: project.depsInstalled }">
          {{ project.depsInstalled ? '已安装' : '未安装' }}
        </span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="project-actions">
      <button
        v-if="!project.depsInstalled"
        @click="$emit('install', project)"
        :disabled="project.installing"
        class="action-btn install"
        :class="{ loading: project.installing }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        安装依赖
      </button>

      <button
        v-else
        @click="project.running ? $emit('stop', project) : $emit('run', project)"
        :disabled="project.running && !project.installing"
        class="action-btn"
        :class="project.running ? 'stop' : 'run'"
      >
        <svg v-if="project.running" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ project.running ? '停止' : '运行' }}
      </button>

      <button
        v-if="project.running && project.port"
        @click="openInBrowser(project.port)"
        class="action-btn view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        访问
      </button>
    </div>

    <!-- 运行信息 -->
    <div v-if="project.running && project.port" class="project-running-info">
      <div class="info-badge">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span>http://localhost:{{ project.port }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'

interface Props {
  project: Project
}

const props = defineProps<Props>()

const emit = defineEmits<{
  install: [project: Project]
  run: [project: Project]
  stop: [project: Project]
}>()

const truncatedPath = computed(() => {
  const path = props.project.path
  if (path.length > 40) {
    return '...' + path.slice(-37)
  }
  return path
})

const frameworkColor = computed(() => {
  const colors: Record<string, string> = {
    Vue: 'linear-gradient(135deg, #42b883 0%, #35495e 100%)',
    React: 'linear-gradient(135deg, #61dafb 0%, #282c34 100%)',
    'Next.js': 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    Nuxt: 'linear-gradient(135deg, #00c58e 0%, #2f495e 100%)',
    Angular: 'linear-gradient(135deg, #dd0031 0%, #c3002f 100%)',
    Svelte: 'linear-gradient(135deg, #ff3e00 0%, #ff8c00 100%)',
  }
  return colors[props.project.framework] || 'linear-gradient(135deg, #7b2ff7 0%, #00d9ff 100%)'
})

const openInBrowser = (port: number) => {
  window.open(`http://localhost:${port}`, '_blank')
}
</script>

<style scoped>
.project-card {
  @apply relative overflow-hidden rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
         shadow-[0_4px_24px_rgba(0,0,0,0.15)] p-4 transition-all duration-200;
}

.project-card.running {
  @apply border-emerald-500/30 shadow-[0_4px_24px_rgba(16,185,129,0.2)];
}

.project-header {
  @apply flex items-center justify-between mb-4;
}

.project-info {
  @apply flex items-center gap-3 flex-1 min-w-0;
}

.project-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0;
}

.project-details {
  @apply min-w-0;
}

.project-name {
  @apply text-sm font-semibold text-white/90 truncate;
}

.project-path {
  @apply text-xs text-white/40 truncate;
}

.project-status {
  @apply flex-shrink-0;
}

.status-badge {
  @apply inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium;
}

.status-badge.running {
  @apply bg-emerald-500/15 text-emerald-400 border border-emerald-500/20;
}

.status-badge.stopped {
  @apply bg-white/10 text-white/40 border border-white/10;
}

.status-dot {
  @apply w-1.5 h-1.5 rounded-full;
}

.status-badge.running .status-dot {
  @apply bg-emerald-400 animate-pulse;
}

.status-badge.stopped .status-dot {
  @apply bg-white/30;
}

.project-info-grid {
  @apply grid grid-cols-4 gap-2 mb-4;
}

.info-item {
  @apply flex flex-col gap-0.5;
}

.info-label {
  @apply text-xs text-white/30;
}

.info-value {
  @apply text-xs text-white/60;
}

.info-value.installed {
  @apply text-emerald-400;
}

.project-actions {
  @apply flex items-center gap-2;
}

.action-btn {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
         bg-white/[0.06] text-white/60 border border-white/[0.08]
         hover:bg-white/[0.1] hover:text-white/80 transition-all duration-150;
}

.action-btn.install {
  @apply bg-gradient-to-r from-[#7b2ff7]/20 to-[#00d9ff]/20 text-[#00d9ff]
         border-[#7b2ff7]/30 hover:from-[#7b2ff7]/30 hover:to-[#00d9ff]/30;
}

.action-btn.run {
  @apply bg-emerald-500/15 text-emerald-400 border-emerald-500/20
         hover:bg-emerald-500/20;
}

.action-btn.stop {
  @apply bg-red-500/15 text-red-400 border-red-500/20
         hover:bg-red-500/20;
}

.action-btn.view {
  @apply bg-blue-500/15 text-blue-400 border-blue-500/20
         hover:bg-blue-500/20;
}

.action-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.action-btn.loading {
  @apply animate-pulse;
}

.project-running-info {
  @apply mt-3 pt-3 border-t border-white/[0.06];
}

.info-badge {
  @apply inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs
         bg-white/[0.06] text-white/50 border border-white/[0.08];
}
</style>
