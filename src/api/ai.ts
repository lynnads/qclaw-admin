/**
 * AI助手相关接口封装
 * 适配主流AI接口（阿里云通义千问、百度文心一言）
 * 复用 request 实例，自动携带 token、显示加载动画、统一错误处理
 */
import request from '@/utils/request'

export interface AiGenerateParams {
  prompt: string
  model?: string
  type?: 'text' | 'code' | 'table' | 'document'
}

export interface AiSearchParams {
  keyword: string
  module: string
}

export interface AiHistoryItem {
  id: number
  prompt: string
  result: string
  type: string
  createTime: string
}

export interface AiPromptTemplate {
  id: number
  title: string
  content: string
  icon?: string
  category?: string
}

export const aiApi = {
  /**
   * 智能文本生成
   * 适用场景：生成表格数据、接口文档、代码片段、报告文案
   */
  generateText: (params: AiGenerateParams) => {
    return request({
      url: '/api/ai/generate',
      method: 'post',
      data: params
    })
  },

  /**
   * AI智能搜索
   * 适用场景：后台模块的智能模糊搜索、语义联想
   */
  aiSearch: (params: AiSearchParams) => {
    return request({
      url: '/api/ai/search',
      method: 'get',
      params
    })
  },

  /**
   * 获取AI请求历史记录
   */
  getAiHistory: () => {
    return request({
      url: '/api/ai/history',
      method: 'get'
    })
  },

  /**
   * 获取常用Prompt模板列表
   */
  getPromptTemplates: () => {
    return request({
      url: '/api/ai/templates',
      method: 'get'
    })
  },

  /**
   * 删除单条历史记录
   */
  deleteHistory: (id: number) => {
    return request({
      url: `/api/ai/history/${id}`,
      method: 'delete'
    })
  }
}

export default aiApi
