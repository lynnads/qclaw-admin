<template>
  <div class="ai-assistant">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <h1 class="page-title">AI 助手</h1>
        <p class="page-subtitle">智能生成数据、文档、代码、股票量化策略，提升开发及投资效率</p>
      </div>
      <div class="header-badge">
        <span class="badge-dot"></span>
        <span>通义千问 + Mock引擎</span>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="content-layout">
      <!-- 左侧：输入区 -->
      <div class="input-section">
        <!-- 模板分类切换 -->
        <div class="tabs-card">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'dev' }"
            @click="activeTab = 'dev'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            开发模板
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'quant' }"
            @click="activeTab = 'quant'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            股票量化模板
          </button>
        </div>

        <!-- 常用模板列表 -->
        <div class="templates-card">
          <div class="card-header">
            <h3 class="card-title">常用模板</h3>
          </div>
          <div class="templates-grid">
            <button
              v-for="item in filteredPrompts"
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

        <!-- 股票量化参数区（仅量化模式显示） -->
        <Transition name="slide">
          <div v-if="activeTab === 'quant'" class="quant-card">
            <div class="card-header">
              <h3 class="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                量化策略参数
              </h3>
            </div>
            <div class="quant-form">
              <div class="form-row">
                <div class="form-group">
                  <label>股票代码</label>
                  <input
                    v-model="quantForm.stockCode"
                    type="text"
                    placeholder="如 000001"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>策略类型</label>
                  <el-select 
                    v-model="quantForm.strategyType" 
                    placeholder="请选择策略"
                    class="w-full"
                    size="medium"
                    :popper-class="'quant-strategy-select'"
                  >
                    <el-option 
                      v-for="item in strategyOptions" 
                      :key="item.value" 
                      :label="item.label" 
                      :value="item.value"
                    >
                      <div class="strategy-option">
                        <span class="strategy-label">{{ item.label }}</span>
                        <span class="strategy-desc">{{ item.desc }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>开始日期</label>
                  <input v-model="quantForm.startDate" type="date" class="form-input" />
                </div>
                <div class="form-group">
                  <label>结束日期</label>
                  <input v-model="quantForm.endDate" type="date" class="form-input" />
                </div>
              </div>
              <div class="form-actions">
                <button
                  class="btn-quant"
                  :disabled="aiStore.loading || !quantForm.stockCode || !quantForm.strategyType"
                  @click="runQuantPipeline"
                >
                  <svg v-if="aiStore.loading" class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ aiStore.loading ? '生成中...' : '生成策略 + 回测' }}
                </button>
                <button class="btn-clear-small" @click="clearQuant">清空参数</button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 提示词输入区（开发模式） -->
        <Transition name="slide">
          <div v-if="activeTab === 'dev'" class="input-card">
            <div class="card-header">
              <h3 class="card-title">输入提示词</h3>
              <div class="type-selector">
                <button
                  v-for="t in typeOptions"
                  :key="t.value"
                  class="type-btn"
                  :class="{ active: selectedType === t.value }"
                  @click="selectedType = t.value"
                >{{ t.label }}</button>
              </div>
            </div>
            <textarea
              v-model="prompt"
              :placeholder="placeholderText"
              class="prompt-textarea"
            ></textarea>
            <div class="input-actions">
              <button class="btn-generate" :disabled="aiStore.loading || !prompt.trim()" @click="generateText">
                <svg v-if="aiStore.loading" class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ aiStore.loading ? '生成中...' : '生成内容' }}
              </button>
              <button class="btn-clear-small" @click="clearPrompt">清空</button>
            </div>
          </div>
        </Transition>

        <!-- 历史记录 -->
        <div class="history-card">
          <div class="card-header">
            <h3 class="card-title">
              历史记录
              <span class="history-count">{{ aiStore.historyList.length }}</span>
            </h3>
            <button v-if="aiStore.historyList.length > 0" @click="aiStore.clearAiHistory" class="btn-text">清空全部</button>
          </div>
          <div class="history-list">
            <div v-if="aiStore.historyList.length === 0" class="history-empty">暂无历史记录</div>
            <div v-for="item in aiStore.historyList" :key="item.id" class="history-item">
              <div class="history-content" @click="useHistory(item)">
                <p class="history-prompt">{{ item.prompt }}</p>
                <span class="history-meta">{{ item.type }} · {{ item.createTime }}</span>
              </div>
              <button @click.stop="aiStore.deleteHistoryItem(item.id)" class="btn-delete">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：结果展示 -->
      <div class="result-section">
        <!-- 量化策略结果 -->
        <div v-if="activeTab === 'quant'" class="result-card quant-result">
          <div class="card-header">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              量化策略代码
            </h3>
            <div class="result-actions">
              <button v-if="aiStore.quantStrategy" @click="copyStrategy" class="btn-icon-text">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制代码
              </button>
              <button v-if="aiStore.quantStrategy" @click="exportStrategy" class="btn-icon-text">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出
              </button>
            </div>
          </div>
          <div class="result-content">
            <div v-if="aiStore.loading" class="result-loading">
              <div class="loading-spinner"></div>
              <p>AI 正在生成策略代码...</p>
            </div>
            <pre v-else-if="aiStore.quantStrategy" class="result-code">{{ aiStore.quantStrategy }}</pre>
            <div v-else class="result-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p>填写股票代码和策略参数，点击「生成策略 + 回测」</p>
            </div>
          </div>

          <!-- 回测结果表格 -->
          <Transition name="fade">
            <div v-if="aiStore.backtestResult && !aiStore.loading" class="backtest-section">
              <div class="card-header">
                <h3 class="card-title">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  回测结果
                </h3>
              </div>
              <div class="backtest-grid">
                <div class="backtest-item">
                  <span class="backtest-label">年化收益率</span>
                  <span class="backtest-value" :class="{ positive: Number(aiStore.backtestResult.annualReturn) > 0, negative: Number(aiStore.backtestResult.annualReturn) < 0 }">
                    {{ aiStore.backtestResult.annualReturn }}
                  </span>
                </div>
                <div class="backtest-item">
                  <span class="backtest-label">最大回撤</span>
                  <span class="backtest-value negative">{{ aiStore.backtestResult.maxDrawdown }}</span>
                </div>
                <div class="backtest-item">
                  <span class="backtest-label">胜率</span>
                  <span class="backtest-value">{{ aiStore.backtestResult.winRate }}</span>
                </div>
                <div class="backtest-item">
                  <span class="backtest-label">夏普比率</span>
                  <span class="backtest-value">{{ aiStore.backtestResult.sharpRatio }}</span>
                </div>
                <div class="backtest-item">
                  <span class="backtest-label">盈亏比</span>
                  <span class="backtest-value">{{ aiStore.backtestResult.profitFactor }}</span>
                </div>
                <div class="backtest-item">
                  <span class="backtest-label">总交易次数</span>
                  <span class="backtest-value">{{ aiStore.backtestResult.totalTrades }}</span>
                </div>
              </div>
              <div class="backtest-period">回测周期：{{ aiStore.backtestResult.backtestPeriod }}</div>
              <div class="backtest-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                回测结果仅供参考，不代表实盘收益，请谨慎决策
              </div>
            </div>
          </Transition>
        </div>

        <!-- 开发模式结果 -->
        <div v-if="activeTab === 'dev'" class="result-card">
          <div class="card-header">
            <h3 class="card-title">生成结果</h3>
            <div class="result-actions" v-if="aiStore.currentResult">
              <button @click="copyResult" class="btn-icon-text">
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
              <p>AI 正在生成内容...</p>
            </div>
            <pre v-else-if="aiStore.error" class="result-error">{{ aiStore.error }}</pre>
            <pre v-else-if="aiStore.currentResult" class="result-pre">{{ aiStore.currentResult }}</pre>
            <div v-else class="result-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p>输入提示词，点击「生成内容」</p>
              <p class="placeholder-hint">支持 JSON 数据、代码片段、接口文档、正则表达式等</p>
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
import { saveAs } from 'file-saver'

const aiStore = useAiStore()

// 状态
const prompt = ref('')
const activeTab = ref<'dev' | 'quant'>('dev')
const selectedType = ref('text')
const activeTemplateId = ref<number | null>(null)

// 量化表单
const quantForm = ref({
  stockCode: '',
  strategyType: '',
  startDate: '',
  endDate: '',
})

// 类型选项
const typeOptions = [
  { value: 'text', label: '文本' },
  { value: 'code', label: '代码' },
  { value: 'table', label: '表格' },
  { value: 'document', label: '文档' },
]

// 策略选项
const strategyOptions = [
  { value: '双均线', label: '双均线策略', desc: '5日/20日均线金叉死叉' },
  { value: 'MACD', label: 'MACD策略', desc: 'DIF/DEA交叉信号' },
  { value: 'RSI', label: 'RSI超买超卖', desc: 'RSI<30买入 >70卖出' },
  { value: '市盈率单因子', label: '市盈率单因子', desc: 'PE<10买入 >20卖出' },
  { value: '技术指标', label: '布林带策略', desc: '价格突破上下轨' },
]

// 占位符
const placeholderText = computed(() => {
  const map: Record<string, string> = {
    text: '请输入AI提示词，例如：生成10条用户测试数据',
    code: '请输入AI提示词，例如：生成一个Vue3分页组件',
    table: '请输入AI提示词，例如：生成用户表格JSON数据',
    document: '请输入AI提示词，例如：生成用户管理模块接口文档',
  }
  return map[selectedType.value] || map.text
})

// 过滤模板
const filteredPrompts = computed(() => {
  return aiStore.commonPrompts.filter(p => p.category2 === activeTab.value)
})

// 使用模板
const useTemplate = (item: any) => {
  prompt.value = item.content
  activeTemplateId.value = item.id
}

// 使用历史
const useHistory = (item: any) => {
  prompt.value = item.prompt
  selectedType.value = item.type || 'text'
}

// 清空提示词
const clearPrompt = () => {
  prompt.value = ''
  activeTemplateId.value = null
}

// 清空量化参数
const clearQuant = () => {
  quantForm.value = { stockCode: '', strategyType: '', startDate: '', endDate: '' }
  aiStore.clearQuantResult()
}

// 生成开发内容
const generateText = async () => {
  if (!prompt.value.trim()) {
    ElMessage.warning('请输入提示词')
    return
  }
  try {
    await aiStore.generateTextAction({ prompt: prompt.value, type: selectedType.value })
    ElMessage.success('生成完成')
  } catch {
    ElMessage.error('生成失败')
  }
}

// 运行量化全流程
const runQuantPipeline = async () => {
  if (!quantForm.value.stockCode || !quantForm.value.strategyType) {
    ElMessage.warning('请填写完整的股票代码和策略类型')
    return
  }

  // 设置默认日期
  if (!quantForm.value.startDate) quantForm.value.startDate = '2022-01-01'
  if (!quantForm.value.endDate) quantForm.value.endDate = new Date().toISOString().split('T')[0]

  try {
    ElMessage.info('正在获取股票数据...')
    await aiStore.getStockDataAction({
      stockCode: quantForm.value.stockCode,
      startDate: quantForm.value.startDate,
      endDate: quantForm.value.endDate,
    })

    ElMessage.info('正在生成量化策略...')
    await aiStore.generateQuantStrategyAction({
      strategyType: quantForm.value.strategyType,
      stockCode: quantForm.value.stockCode,
    })

    ElMessage.info('正在执行回测...')
    await aiStore.backtestStrategyAction()

    ElMessage.success('量化策略生成及回测完成')
  } catch {
    ElMessage.error('量化流程执行失败，请重试')
  }
}

// 复制开发结果
const copyResult = async () => {
  const ok = await aiStore.copyResult()
  ElMessage.success(ok ? '已复制到剪贴板' : '复制失败')
}

// 复制策略代码
const copyStrategy = async () => {
  const ok = await aiStore.copyResult(aiStore.quantStrategy)
  ElMessage.success(ok ? '已复制到剪贴板' : '复制失败')
}

// 下载开发结果
const downloadResult = () => {
  if (!aiStore.currentResult) return
  const blob = new Blob([aiStore.currentResult], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, `ai-result-${Date.now()}.txt`)
  ElMessage.success('下载成功')
}

// 导出量化策略
const exportStrategy = () => {
  if (!aiStore.quantStrategy) return
  const content = `股票量化策略\n股票代码：${quantForm.value.stockCode}\n策略类型：${quantForm.value.strategyType}\n回测周期：${quantForm.value.startDate} ~ ${quantForm.value.endDate}\n\n=== 策略代码 ===\n${aiStore.quantStrategy}\n\n=== 回测结果 ===\n年化收益率：${aiStore.backtestResult?.annualReturn}\n最大回撤：${aiStore.backtestResult?.maxDrawdown}\n胜率：${aiStore.backtestResult?.winRate}\n夏普比率：${aiStore.backtestResult?.sharpRatio}\n盈亏比：${aiStore.backtestResult?.profitFactor}\n总交易次数：${aiStore.backtestResult?.totalTrades}\n\n⚠️ 风险提示：回测结果仅供参考，不代表实盘收益，请谨慎决策。`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, `量化策略_${quantForm.value.stockCode}_${Date.now()}.txt`)
  ElMessage.success('导出成功')
}

// 持久化历史
watch(() => aiStore.historyList.length, () => aiStore.persistHistory())

onMounted(() => {
  aiStore.getAiHistoryAction()
})
</script>

<style scoped>
.ai-assistant { @apply space-y-5; }

/* 页面头部 */
.page-header {
  @apply flex items-center justify-between p-5 rounded-2xl
         bg-gradient-to-r from-[#7b2ff7]/15 via-[#00d9ff]/10 to-[#f107a3]/10
         border border-white/[0.08] backdrop-blur-xl;
}

.page-title { @apply text-xl font-bold text-white; }
.page-subtitle { @apply text-sm text-white/40; }

.header-badge {
  @apply flex items-center gap-2 px-3 py-1.5 rounded-full
         bg-white/[0.06] border border-white/[0.08] text-xs text-white/50;
}

.badge-dot { @apply w-2 h-2 rounded-full bg-emerald-400 animate-pulse; }

/* 布局 */
.content-layout { @apply grid grid-cols-1 lg:grid-cols-5 gap-5; }
.input-section { @apply lg:col-span-3 flex flex-col gap-4; }
.result-section { @apply lg:col-span-2 flex flex-col gap-4; }

/* 通用卡片 */
.templates-card, .input-card, .history-card, .result-card, .quant-card, .tabs-card {
  @apply rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden;
}

.card-header {
  @apply flex items-center justify-between px-5 py-4 border-b border-white/[0.06];
}

.card-title {
  @apply flex items-center gap-2 text-sm font-semibold text-white/90;
}

.card-title svg { @apply w-4 h-4 text-[#7b2ff7]; }

/* 标签切换 */
.tabs-card {
  @apply flex p-1.5 gap-1;
}

.tab-btn {
  @apply flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
         text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200;
}

.tab-btn.active {
  @apply bg-[#7b2ff7]/20 text-[#00d9ff] shadow-[0_2px_12px_rgba(123,47,247,0.2)];
}

/* 模板列表 */
.templates-grid { @apply grid grid-cols-2 gap-2 p-4; }

.template-item {
  @apply flex flex-col gap-1 p-3 rounded-xl
         bg-white/[0.03] border border-white/[0.06]
         hover:bg-white/[0.06] hover:border-[#7b2ff7]/30
         transition-all duration-200 text-left;
}

.template-item.active {
  @apply bg-[#7b2ff7]/15 border-[#7b2ff7]/40;
}

.template-title { @apply text-xs font-medium text-white/80; }
.template-category { @apply text-xs text-white/30; }

/* 量化表单 */
.quant-form { @apply p-5 space-y-4; }

.form-row { @apply grid grid-cols-2 gap-3; }

/* 下拉选项样式 */
.strategy-option {
  @apply flex flex-col gap-1;
}

.strategy-label {
  @apply text-sm text-white/80;
}

.strategy-desc {
  @apply text-xs text-white/40;
}

.form-group { @apply flex flex-col gap-1.5; }

.form-group label { @apply text-xs text-white/40 font-medium; }

.form-input, .form-select {
  @apply h-10 px-3 rounded-xl bg-white/[0.06] border border-white/[0.08]
         text-sm text-white placeholder-white/25 outline-none
         focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 transition-all duration-200;
}

/* Element Plus Select 与 input 保持一致 */
.quant-form :deep(.el-select) {
  --el-select-border-color-hover: rgba(123, 47, 247, 0.4);
  width: 100%;
}

.quant-form :deep(.el-select .el-input__wrapper) {
  height: 40px !important;
  padding: 0 12px !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: none !important;
}

.quant-form :deep(.el-select .el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.09) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.quant-form :deep(.el-select .el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.09) !important;
  border-color: rgba(123, 47, 247, 0.4) !important;
  box-shadow: none !important;
}

.quant-form :deep(.el-select .el-input__inner) {
  height: 38px !important;
  line-height: 38px !important;
  font-size: 14px !important;
  color: rgba(255, 255, 255, 0.8) !important;
}

.quant-form :deep(.el-select .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.25) !important;
}

.quant-form :deep(.el-select .el-input__suffix) {
  height: 38px !important;
}

.quant-form :deep(.el-select .el-icon) {
  color: rgba(255, 255, 255, 0.3) !important;
}

.form-actions { @apply flex items-center gap-3 pt-2; }

.btn-quant {
  @apply flex items-center gap-2 px-5 py-2.5 rounded-xl
         bg-gradient-to-r from-emerald-500 to-teal-400
         text-white text-sm font-semibold
         shadow-[0_4px_16px_rgba(16,185,129,0.3)]
         disabled:opacity-50 disabled:cursor-not-allowed
         hover:shadow-[0_6px_24px_rgba(16,185,129,0.4)]
         transition-all duration-200;
}

.btn-quant .spinner { @apply w-4 h-4 animate-spin; }

/* 输入区 */
.input-card .card-header { @apply flex-wrap gap-3; }

.type-selector { @apply flex items-center gap-1; }

.type-btn {
  @apply px-3 py-1 rounded-lg text-xs text-white/40
         hover:text-white/70 hover:bg-white/[0.06] transition-all duration-150;
}

.type-btn.active { @apply bg-[#7b2ff7]/20 text-[#00d9ff]; }

.prompt-textarea {
  @apply w-full px-5 py-4 bg-transparent text-sm text-white/80
         placeholder-white/25 outline-none resize-none border-none focus:ring-0;
  min-height: 160px;
}

.input-actions { @apply flex items-center gap-3 px-5 pb-4; }

.btn-generate {
  @apply flex items-center gap-2 px-5 py-2.5 rounded-xl
         bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff]
         text-white text-sm font-semibold
         shadow-[0_4px_16px_rgba(123,47,247,0.3)]
         disabled:opacity-50 disabled:cursor-not-allowed
         hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)]
         transition-all duration-200;
}

.btn-generate .spinner { @apply w-4 h-4 animate-spin; }

.btn-clear-small {
  @apply px-4 py-2.5 rounded-xl text-sm text-white/40
         bg-white/[0.06] border border-white/[0.08]
         hover:bg-white/[0.10] hover:text-white/70 transition-all duration-150;
}

/* 历史 */
.history-count {
  @apply px-1.5 py-0.5 rounded-full bg-[#7b2ff7]/20 text-[#00d9ff] text-xs font-medium;
}

.btn-text { @apply text-xs text-white/30 hover:text-[#00d9ff] transition-colors; }

.history-list { @apply max-h-56 overflow-y-auto p-4 space-y-2; }
.history-empty { @apply py-8 text-center text-xs text-white/25; }

.history-item {
  @apply flex items-center justify-between p-3 rounded-xl
         bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-150;
}

.history-content { @apply flex flex-col gap-1 flex-1 min-w-0 cursor-pointer; }

.history-prompt { @apply text-xs text-white/60 truncate; }
.history-meta { @apply text-xs text-white/25; }

.btn-delete {
  @apply p-1.5 rounded-lg text-white/30
         hover:text-red-400 hover:bg-white/[0.06] transition-all duration-150;
}

/* 结果区 */
.result-card { @apply flex-1; }

.result-actions { @apply flex items-center gap-2; }

.btn-icon-text {
  @apply flex items-center gap-1.5 px-2.5 py-1 rounded-lg
         text-xs text-white/40 bg-white/[0.06]
         hover:bg-white/[0.10] hover:text-white/70 transition-all duration-150;
}

.result-content { @apply p-5 min-h-[200px]; }

/* 量化结果 */
.quant-result { @apply flex flex-col; }

.result-code {
  @apply text-sm text-emerald-300/90 whitespace-pre-wrap break-words font-mono leading-relaxed bg-black/20 rounded-xl p-4 overflow-auto
}
/* Loading */
.result-loading { @apply flex flex-col items-center justify-center gap-4 py-12; }
.loading-spinner { @apply w-8 h-8 rounded-full border-2 border-white/10 border-t-[#7b2ff7] animate-spin; }
.result-loading p { @apply text-sm text-white/40; }

/* Error */
.result-error { @apply text-sm text-red-400 whitespace-pre-wrap; }

/* Pre / Text */
.result-pre { @apply text-sm text-white/70 whitespace-pre-wrap break-words font-mono leading-relaxed; }

/* Placeholder */
.result-placeholder { @apply flex flex-col items-center justify-center gap-3 py-12 text-center; }
.result-placeholder svg { @apply w-12 h-12 text-white/10; }
.result-placeholder p { @apply text-sm text-white/30; }
.placeholder-hint { @apply text-xs text-white/20; }

/* 回测结果 */
.backtest-section { @apply border-t border-white/[0.06]; }
.backtest-grid { @apply grid grid-cols-3 gap-4 p-5; }
.backtest-item { @apply flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]; }
.backtest-label { @apply text-xs text-white/30; }
.backtest-value { @apply text-base font-bold text-white/90; }
.backtest-value.positive { @apply text-emerald-400; }
.backtest-value.negative { @apply text-red-400; }
.backtest-period { @apply px-5 pb-3 text-xs text-white/25; }
.backtest-warning {
  @apply flex items-center gap-2 mx-5 mb-5 px-3 py-2 rounded-xl
         bg-amber-500/10 border border-amber-500/20
         text-xs text-amber-400/80;
}

/* 动画 */
.slide-enter-active, .slide-leave-active { @apply transition-all duration-300 overflow-hidden; }
.slide-enter-from, .slide-leave-to { @apply opacity-0 max-h-0; }
.slide-enter-to { @apply opacity-100 max-h-[500px]; }
.slide-leave-from { @apply opacity-100 max-h-[500px]; }

.fade-enter-active, .fade-leave-active { @apply transition-all duration-300; }
.fade-enter-from { @apply opacity-0; }
.fade-leave-to { @apply opacity-0; }
</style>

<!-- 全局样式：下拉框弹出层 -->
<style>
/* Element Plus Select 下拉框全局样式 */
.quant-strategy-select {
  background: #1a1a2e !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

.quant-strategy-select .el-select-dropdown__item {
  height: auto !important;
  padding: 10px 16px !important;
  line-height: 1.4 !important;
}

.quant-strategy-select .el-select-dropdown__item.is-selected {
  background: rgba(123, 47, 247, 0.15) !important;
  color: #00d9ff !important;
}

.quant-strategy-select .el-select-dropdown__item:hover {
  background: rgba(255, 255, 255, 0.06) !important;
}

.quant-strategy-select .el-popper__arrow::before {
  background: #1a1a2e !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}
</style>
