<template>
  <div class="ai-assistant">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <h1 class="page-title">AI 助手</h1>
        <p class="page-subtitle">智能生成数据、文档、代码片段，提升开发效率</p>
      </div>
      <div class="header-badge">
        <span class="badge-dot"></span>
        <span>基于通义千问</span>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="content-layout">
      <!-- 左侧：输入区 -->
      <div class="input-section">
        <!-- 常用模板 -->
        <div class="templates-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              常用模板
            </h3>
          </div>
          <div class="templates-list">
            <button
              v-for="item in aiStore.commonPrompts"
              :key="item.id"
              class="template-item"
              :class="{ active: activeTemplateId === item.id }"
              @click="useTemplate(item)"
            >
              <span class="template-title">{{ item.title }}</span>
              <span class="template-category">{{ item.category }}</span>
            </button>
          </div>
        </div>

        <!-- 输入区 -->
        <div class="input-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              输入提示词
            </h3>
            <div class="type-selector">
              <button
                v-for="t in typeOptions"
                :key="t.value"
                class="type-btn"
                :class="{ active: selectedType === t.value }"
                @click="selectedType = t.value"
              >
                {{ t.label }}
              </button>
            </div>
          </div>
          <textarea
            v-model="prompt"
            :placeholder="placeholderText"
            class="prompt-textarea"
            rows="8"
          ></textarea>
          <div class="input-actions">
            <button @click="generateText" :disabled="aiStore.loading || !prompt.trim()" class="btn-generate">
              <svg v-if="aiStore.loading" class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ aiStore.loading ? '生成中...' : '生成内容' }}
            </button>
            <button @click="clearInput" class="btn-clear">清空</button>
          </div>
        </div>

        <!-- 历史记录 -->
        <div class="history-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              历史记录
              <span class="history-count">{{ aiStore.historyList.length }}</span>
            </h3>
            <button v-if="aiStore.historyList.length > 0" @click="aiStore.clearAiHistory" class="btn-text">
              清空全部
            </button>
          </div>
          <div class="history-list">
            <div v-if="aiStore.historyList.length === 0" class="history-empty">
              <p>暂无历史记录</p>
            </div>
            <div
              v-for="item in aiStore.historyList"
              :key="item.id"
              class="history-item"
              @click="useHistory(item)"
            >
              <div class="history-content">
                <p class="history-prompt">{{ item.prompt }}</p>
                <span class="history-time">{{ item.createTime }}</span>
              </div>
              <div class="history-actions">
                <button @click.stop="useHistory(item)" class="btn-icon" title="重新生成">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button @click.stop="deleteHistory(item.id)" class="btn-icon danger" title="删除">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：结果展示 -->
      <div class="result-section">
        <div class="result-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              生成结果
            </h3>
            <div class="result-actions" v-if="aiStore.currentResult">
              <button @click="copyToClipboard" class="btn-icon-text">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
              <button @click="downloadResult" class="btn-icon-text">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载
              </button>
            </div>
          </div>

          <div class="result-content">
            <div v-if="aiStore.loading" class="result-loading">
              <div class="loading-spinner"></div>
              <p>AI 正在生成内容，请稍候...</p>
            </div>
            <div v-else-if="aiStore.currentResult" class="result-text">
              <pre class="result-pre">{{ aiStore.currentResult }}</pre>
            </div>
            <div v-else-if="aiStore.error" class="result-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{{ aiStore.error }}</p>
              <button @click="generateText" class="btn-retry">重试</button>
            </div>
            <div v-else class="result-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p>输入提示词，点击「生成内容」</p>
              <p class="placeholder-hint">支持生成 JSON 数据、代码片段、接口文档、正则表达式等</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAiStore } from '@/stores/modules/aiStore'
import { ElMessage } from 'element-plus'

const aiStore = useAiStore()

// 状态
const prompt = ref('')
const activeTemplateId = ref<number | null>(null)
const selectedType = ref('text')

// 类型选项
const typeOptions = [
  { value: 'text', label: '文本' },
  { value: 'code', label: '代码' },
  { value: 'table', label: '表格' },
  { value: 'document', label: '文档' },
]

// 占位符文本
const placeholderText = computed(() => {
  const placeholders: Record<string, string> = {
    text: '请输入AI提示词，例如：生成10条用户测试数据',
    code: '请输入AI提示词，例如：生成一个用户列表的Vue组件',
    table: '请输入AI提示词，例如：生成一个包含5个字段的用户表格JSON数据',
    document: '请输入AI提示词，例如：生成用户管理模块的接口文档',
  }
  return placeholders[selectedType.value] || placeholders.text
})

// 使用模板
const useTemplate = (item: any) => {
  prompt.value = item.content
  activeTemplateId.value = item.id
}

// 使用历史记录
const useHistory = (item: any) => {
  prompt.value = item.prompt
}

// 删除历史
const deleteHistory = (id: number) => {
  aiStore.deleteHistoryItem(id)
}

// 清空输入
const clearInput = () => {
  prompt.value = ''
  activeTemplateId.value = null
}

// 生成内容
const generateText = async () => {
  if (!prompt.value.trim()) {
    ElMessage.warning('请输入提示词')
    return
  }

  try {
    await aiStore.generateTextAction({
      prompt: prompt.value,
      type: selectedType.value,
    })
    ElMessage.success('生成完成')
  } catch {
    ElMessage.error('生成失败，请稍后重试')
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  const success = await aiStore.copyResult()
  if (success) {
    ElMessage.success('已复制到剪贴板')
  } else {
    ElMessage.error('复制失败')
  }
}

// 下载结果
const downloadResult = () => {
  if (!aiStore.currentResult) return
  const blob = new Blob([aiStore.currentResult], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-result-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('下载成功')
}

// 持久化历史
watch(() => aiStore.historyList.length, () => {
  aiStore.persistHistory()
})

// 初始化
onMounted(() => {
  aiStore.getAiHistoryAction()
})
</script>

<style scoped>
.ai-assistant {
  @apply space-y-5;
}

/* 页面头部 */
.page-header {
  @apply flex items-center justify-between p-5 rounded-2xl
         bg-gradient-to-r from-[#7b2ff7]/15 via-[#00d9ff]/10 to-[#f107a3]/10
         border border-white/[0.08] backdrop-blur-xl;
}

.header-info {
  @apply flex flex-col gap-1;
}

.page-title {
  @apply text-xl font-bold text-white;
}

.page-subtitle {
  @apply text-sm text-white/40;
}

.header-badge {
  @apply flex items-center gap-2 px-3 py-1.5 rounded-full
         bg-white/[0.06] border border-white/[0.08] text-xs text-white/50;
}

.badge-dot {
  @apply w-2 h-2 rounded-full bg-emerald-400 animate-pulse;
}

/* 内容布局 */
.content-layout {
  @apply grid grid-cols-1 lg:grid-cols-5 gap-5;
}

.input-section {
  @apply lg:col-span-3 flex flex-col gap-4;
}

.result-section {
  @apply lg:col-span-2;
}

/* 卡片通用 */
.templates-card,
.input-card,
.history-card,
.result-card {
  @apply rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden;
}

.card-header {
  @apply flex items-center justify-between px-5 py-4 border-b border-white/[0.06];
}

.card-title {
  @apply flex items-center gap-2 text-sm font-semibold text-white/90;
}

.card-title svg {
  @apply w-4 h-4 text-[#7b2ff7];
}

/* 模板列表 */
.templates-list {
  @apply grid grid-cols-2 gap-2 p-4;
}

.template-item {
  @apply flex flex-col items-start gap-1 p-3 rounded-xl
         bg-white/[0.03] border border-white/[0.06]
         hover:bg-white/[0.06] hover:border-[#7b2ff7]/30
         transition-all duration-200 text-left;
}

.template-item.active {
  @apply bg-[#7b2ff7]/15 border-[#7b2ff7]/40;
}

.template-title {
  @apply text-xs font-medium text-white/80;
}

.template-category {
  @apply text-xs text-white/30;
}

/* 输入区 */
.input-card .card-header {
  @apply flex-wrap gap-3;
}

.type-selector {
  @apply flex items-center gap-1;
}

.type-btn {
  @apply px-3 py-1 rounded-lg text-xs text-white/40
         hover:text-white/70 hover:bg-white/[0.06]
         transition-all duration-150;
}

.type-btn.active {
  @apply bg-[#7b2ff7]/20 text-[#00d9ff];
}

.prompt-textarea {
  @apply w-full px-5 py-4 bg-transparent text-sm text-white/80
         placeholder-white/25 outline-none resize-none
         border-none focus:ring-0;
  min-height: 180px;
}

.input-actions {
  @apply flex items-center gap-3 px-5 pb-4;
}

.btn-generate {
  @apply flex items-center gap-2 px-5 py-2.5 rounded-xl
         bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff]
         text-white text-sm font-semibold
         shadow-[0_4px_16px_rgba(123,47,247,0.3)]
         hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)]
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-all duration-200;
}

.btn-generate .spinner {
  @apply w-4 h-4 animate-spin;
}

.btn-clear {
  @apply px-4 py-2.5 rounded-xl text-sm text-white/40
         bg-white/[0.06] border border-white/[0.08]
         hover:bg-white/[0.10] hover:text-white/70
         transition-all duration-150;
}

/* 历史记录 */
.history-card .card-header {
  @apply border-b border-white/[0.06];
}

.history-count {
  @apply px-1.5 py-0.5 rounded-full bg-[#7b2ff7]/20 text-[#00d9ff] text-xs font-medium;
}

.btn-text {
  @apply text-xs text-white/30 hover:text-[#00d9ff] transition-colors;
}

.history-list {
  @apply max-h-64 overflow-y-auto p-4 space-y-2;
}

.history-empty {
  @apply py-8 text-center text-xs text-white/25;
}

.history-item {
  @apply flex items-center justify-between p-3 rounded-xl
         bg-white/[0.03] hover:bg-white/[0.06]
         transition-all duration-150 cursor-pointer;
}

.history-content {
  @apply flex flex-col gap-1 flex-1 min-w-0;
}

.history-prompt {
  @apply text-xs text-white/60 truncate;
}

.history-time {
  @apply text-xs text-white/25;
}

.history-actions {
  @apply flex items-center gap-1 flex-shrink-0;
}

.btn-icon {
  @apply p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06]
         transition-all duration-150;
}

.btn-icon.danger {
  @apply hover:text-red-400;
}

/* 结果区 */
.result-actions {
  @apply flex items-center gap-2;
}

.btn-icon-text {
  @apply flex items-center gap-1.5 px-2.5 py-1 rounded-lg
         text-xs text-white/40 bg-white/[0.06]
         hover:bg-white/[0.10] hover:text-white/70
         transition-all duration-150;
}

.result-content {
  @apply p-5 min-h-[300px];
}

.result-loading {
  @apply flex flex-col items-center justify-center gap-4 py-12;
}

.loading-spinner {
  @apply w-8 h-8 rounded-full border-2 border-white/10 border-t-[#7b2ff7] animate-spin;
}

.result-loading p {
  @apply text-sm text-white/40;
}

.result-text {
  @apply overflow-auto;
}

.result-pre {
  @apply text-sm text-white/70 whitespace-pre-wrap break-words
         font-mono leading-relaxed;
}

.result-error {
  @apply flex flex-col items-center justify-center gap-3 py-12 text-center;
}

.result-error svg {
  @apply w-8 h-8 text-red-400;
}

.result-error p {
  @apply text-sm text-white/50;
}

.btn-retry {
  @apply px-4 py-2 rounded-xl text-sm text-white/70
         bg-white/[0.06] border border-white/[0.08]
         hover:bg-white/[0.10] transition-all duration-150;
}

.result-placeholder {
  @apply flex flex-col items-center justify-center gap-3 py-12 text-center;
}

.result-placeholder svg {
  @apply w-12 h-12 text-white/10;
}

.result-placeholder p {
  @apply text-sm text-white/30;
}

.placeholder-hint {
  @apply text-xs text-white/20;
}
</style>
