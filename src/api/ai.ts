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
  category2?: 'dev' | 'quant'
}

// ============ 股票量化相关接口 ============

/** 股票日线数据 */
export interface StockKLine {
  date: string
  open: number
  close: number
  high: number
  low: number
  volume: number
  amount: number
}

/** 回测结果 */
export interface BacktestResult {
  annualReturn: string    // 年化收益率
  maxDrawdown: string     // 最大回撤
  winRate: string         // 胜率
  backtestPeriod: string   // 回测周期
  totalTrades: number     // 总交易次数
  sharpRatio: string      // 夏普比率
  profitFactor: string    // 盈亏比
}

/** 量化策略参数 */
export interface QuantStrategyParams {
  strategyType: '双均线' | '市盈率单因子' | '技术指标' | 'RSI' | 'MACD'
  stockCode?: string
}

/** 股票数据参数 */
export interface StockDataParams {
  stockCode: string
  startDate: string
  endDate: string
}

export const aiApi = {
  // ========== 通用AI接口 ==========
  generateText: (params: AiGenerateParams) => request({ url: '/api/ai/generate', method: 'post', data: params }),
  aiSearch: (params: AiSearchParams) => request({ url: '/api/ai/search', method: 'get', params }),
  getAiHistory: () => request({ url: '/api/ai/history', method: 'get' }),
  getPromptTemplates: () => request({ url: '/api/ai/templates', method: 'get' }),
  deleteHistory: (id: number) => request({ url: `/api/ai/history/${id}`, method: 'delete' }),

  // ========== 股票量化接口 ==========
  /** 获取股票K线数据 */
  getStockData: (params: StockDataParams) => request({ url: '/api/ai/stock/data', method: 'get', params }),

  /** 生成量化策略代码 */
  generateQuantStrategy: (params: QuantStrategyParams) => request({ url: '/api/ai/quant/strategy', method: 'post', data: params }),

  /** 策略回测 */
  backtestStrategy: (params: { strategyCode: string; stockData: StockKLine[] }) => request({ url: '/api/ai/quant/backtest', method: 'post', data: params }),

  /** 分析股票历史数据 */
  analyzeStock: (params: StockDataParams) => request({ url: '/api/ai/stock/analyze', method: 'post', data: params }),
}

export default aiApi
