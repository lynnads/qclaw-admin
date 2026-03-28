/**
 * AI助手状态管理
 * 使用 Pinia 管理 AI 请求历史、Prompt 模板、加载状态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { aiApi, type AiHistoryItem, type AiPromptTemplate } from '@/api/ai'

export const useAiStore = defineStore('ai', () => {
  // 状态
  const historyList = ref<AiHistoryItem[]>([])
  const commonPrompts = ref<AiPromptTemplate[]>([
    {
      id: 1,
      title: '生成用户测试数据',
      content: '生成10条用户测试数据，包含id、账号、姓名、手机号、状态，格式为JSON数组',
      icon: 'User',
      category: '测试数据',
    },
    {
      id: 2,
      title: '生成接口文档',
      content: '根据用户管理模块的CRUD接口，生成标准的接口文档，包含请求地址、参数、响应格式',
      icon: 'Document',
      category: '开发文档',
    },
    {
      id: 3,
      title: 'Vue3表单组件',
      content: '生成一个基于Element Plus的用户表单组件，包含账号、姓名、手机号输入框，支持表单验证',
      icon: 'Code',
      category: '代码生成',
    },
    {
      id: 4,
      title: '生成Mock数据',
      content: '为项目分析模块生成20条模拟项目数据，包含项目名、框架、状态、包管理器',
      icon: 'Box',
      category: '测试数据',
    },
    {
      id: 5,
      title: 'SQL查询语句',
      content: '生成查询用户列表的SQL语句，支持分页、关键词搜索、状态筛选',
      icon: 'Database',
      category: '数据库',
    },
    {
      id: 6,
      title: '正则表达式',
      content: '生成验证手机号、邮箱、身份证号的正则表达式，并给出验证示例',
      icon: 'Key',
      category: '工具',
    },
  ])
  const loading = ref(false)
  const currentResult = ref('')
  const error = ref<string | null>(null)

  // Actions
  /**
   * 调用AI文本生成
   */
  const generateTextAction = async (params: { prompt: string; model?: string; type?: string }) => {
    loading.value = true
    error.value = null
    currentResult.value = ''

    try {
      const res = await aiApi.generateText(params as any)
      const resultText = res?.data || ''

      // 添加到历史记录
      historyList.value.unshift({
        id: Date.now(),
        prompt: params.prompt,
        result: resultText,
        type: params.type || 'text',
        createTime: new Date().toLocaleString('zh-CN'),
      })

      currentResult.value = resultText
      return resultText
    } catch (err: any) {
      error.value = err.message || '生成失败，请稍后重试'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取历史记录
   */
  const getAiHistoryAction = async () => {
    try {
      const res = await aiApi.getAiHistory()
      historyList.value = res.data || []
    } catch (err) {
      console.error('获取AI历史失败：', err)
      // 失败时使用本地缓存
      const cached = localStorage.getItem('ai_history')
      if (cached) {
        try {
          historyList.value = JSON.parse(cached)
        } catch {
          historyList.value = []
        }
      }
    }
  }

  /**
   * 清空历史记录
   */
  const clearAiHistory = () => {
    historyList.value = []
    localStorage.removeItem('ai_history')
  }

  /**
   * 删除单条历史
   */
  const deleteHistoryItem = (id: number) => {
    historyList.value = historyList.value.filter(item => item.id !== id)
  }

  /**
   * 保存当前结果到剪贴板
   */
  const copyResult = async () => {
    if (!currentResult.value) return
    try {
      await navigator.clipboard.writeText(currentResult.value)
      return true
    } catch {
      return false
    }
  }

  /**
   * 持久化历史记录到 localStorage
   */
  const persistHistory = () => {
    try {
      localStorage.setItem('ai_history', JSON.stringify(historyList.value.slice(0, 50)))
    } catch {
      // 忽略存储失败
    }
  }

  return {
    // 状态
    historyList,
    commonPrompts,
    loading,
    currentResult,
    error,

    // Actions
    generateTextAction,
    getAiHistoryAction,
    clearAiHistory,
    deleteHistoryItem,
    copyResult,
    persistHistory,
  }
})
