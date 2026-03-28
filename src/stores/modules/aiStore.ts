/**
 * AI助手状态管理
 * 使用 Pinia 管理 AI 请求历史、Prompt 模板、加载状态、股票量化数据
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { aiApi, type AiHistoryItem, type AiPromptTemplate, type StockKLine, type BacktestResult } from '@/api/ai'

export const useAiStore = defineStore('ai', () => {
  // ========== 通用状态 ==========
  const historyList = ref<AiHistoryItem[]>([])
  const loading = ref(false)
  const currentResult = ref('')
  const error = ref<string | null>(null)

  // ========== Prompt 模板 ==========
  const commonPrompts = ref<AiPromptTemplate[]>([
    // 开发类模板（id 1-3）
    { id: 1, title: '生成用户测试数据', content: '生成10条用户测试数据，包含id、账号、姓名、手机号、状态，格式为JSON数组', icon: 'User', category: '测试数据', category2: 'dev' },
    { id: 2, title: '生成接口文档', content: '根据用户管理模块的CRUD接口，生成标准的接口文档，包含请求地址、参数、响应格式', icon: 'Document', category: '开发文档', category2: 'dev' },
    { id: 3, title: 'Vue3表单组件', content: '生成一个基于Element Plus的用户表单组件，包含账号、姓名、手机号输入框，支持表单验证', icon: 'Code', category: '代码生成', category2: 'dev' },
    { id: 4, title: '生成Mock数据', content: '为项目分析模块生成20条模拟项目数据，包含项目名、框架、状态、包管理器', icon: 'Box', category: '测试数据', category2: 'dev' },
    { id: 5, title: 'SQL查询语句', content: '生成查询用户列表的SQL语句，支持分页、关键词搜索、状态筛选', icon: 'Database', category: '数据库', category2: 'dev' },
    { id: 6, title: '正则表达式', content: '生成验证手机号、邮箱、身份证号的正则表达式，并给出验证示例', icon: 'Key', category: '工具', category2: 'dev' },

    // 股票量化类模板（id 7-12）
    { id: 7, title: '双均线策略代码', content: '生成Python双均线量化策略代码，逻辑：5日均线上穿20日均线买入，下穿卖出，适配A股，包含注释，可直接在聚宽、米筐平台运行', icon: 'Chart', category: '双均线', category2: 'quant' },
    { id: 8, title: '市盈率单因子策略', content: '生成Excel可执行的单因子量化策略，逻辑：市盈率低于10倍买入，高于20倍卖出，包含数据计算公式和回测步骤', icon: 'PieChart', category: '估值策略', category2: 'quant' },
    { id: 9, title: 'MACD策略代码', content: '生成Python MACD量化策略代码，适配A股，DIF上穿DEA买入，下穿卖出，包含止损逻辑和注释', icon: 'TrendCharts', category: 'MACD', category2: 'quant' },
    { id: 10, title: 'RSI超买超卖策略', content: '生成Python RSI量化策略代码，RSI低于30买入，高于70卖出，适合震荡行情', icon: 'DataLine', category: 'RSI', category2: 'quant' },
    { id: 11, title: '股票历史分析', content: '根据股票日线数据，分析近3年波动率、均线走势，给出简单的量化交易建议，适配新手入门', icon: 'InfoFilled', category: '分析解读', category2: 'quant' },
    { id: 12, title: '布林带策略代码', content: '生成Python布林带量化策略代码，价格下穿下轨买入，上穿上轨卖出，中轨止损', icon: 'Histogram', category: '布林带', category2: 'quant' },
  ])

  // ========== 股票量化状态 ==========
  const stockData = ref<StockKLine[]>([])
  const quantStrategy = ref('')
  const backtestResult = ref<BacktestResult | null>(null)
  const stockAnalysis = ref('')

  // ========== 通用 Actions ==========
  const generateTextAction = async (params: { prompt: string; model?: string; type?: string }) => {
    loading.value = true
    error.value = null
    currentResult.value = ''

    try {
      const res = await aiApi.generateText(params as any)
      const resultText = res?.data || ''

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

  const getAiHistoryAction = async () => {
    try {
      const res = await aiApi.getAiHistory()
      historyList.value = res.data || []
    } catch {
      const cached = localStorage.getItem('ai_history')
      if (cached) {
        try { historyList.value = JSON.parse(cached) } catch { historyList.value = [] }
      }
    }
  }

  const clearAiHistory = () => {
    historyList.value = []
    localStorage.removeItem('ai_history')
  }

  const deleteHistoryItem = (id: number) => {
    historyList.value = historyList.value.filter(item => item.id !== id)
  }

  const copyResult = async (text?: string) => {
    const content = text || currentResult.value || quantStrategy.value
    if (!content) return false
    try {
      await navigator.clipboard.writeText(content)
      return true
    } catch { return false }
  }

  const persistHistory = () => {
    try {
      localStorage.setItem('ai_history', JSON.stringify(historyList.value.slice(0, 50)))
    } catch { /* ignore */ }
  }

  // ========== 股票量化 Actions ==========
  const getStockDataAction = async (params: { stockCode: string; startDate: string; endDate: string }) => {
    loading.value = true
    error.value = null
    try {
      const res = await aiApi.getStockData(params)
      stockData.value = res?.data || generateMockStockData(params.stockCode)
      return stockData.value
    } catch {
      // Mock数据降级
      stockData.value = generateMockStockData(params.stockCode)
      return stockData.value
    } finally {
      loading.value = false
    }
  }

  const generateQuantStrategyAction = async (params: { strategyType: string; stockCode?: string }) => {
    loading.value = true
    error.value = null
    try {
      const res = await aiApi.generateQuantStrategy(params as any)
      quantStrategy.value = res?.data || generateMockStrategy(params.strategyType)
      return quantStrategy.value
    } catch {
      quantStrategy.value = generateMockStrategy(params.strategyType)
      return quantStrategy.value
    } finally {
      loading.value = false
    }
  }

  const backtestStrategyAction = async (params?: { strategyCode?: string; stockData?: StockKLine[] }) => {
    loading.value = true
    error.value = null
    try {
      const res = await aiApi.backtestStrategy({
        strategyCode: params?.strategyCode || quantStrategy.value,
        stockData: params?.stockData || stockData.value,
      })
      backtestResult.value = res?.data || generateMockBacktestResult()
      return backtestResult.value
    } catch {
      backtestResult.value = generateMockBacktestResult()
      return backtestResult.value
    } finally {
      loading.value = false
    }
  }

  const analyzeStockAction = async (params: { stockCode: string; startDate: string; endDate: string }) => {
    loading.value = true
    error.value = null
    try {
      const res = await aiApi.analyzeStock(params)
      stockAnalysis.value = res?.data || ''
      return stockAnalysis.value
    } catch {
      stockAnalysis.value = ''
      return ''
    } finally {
      loading.value = false
    }
  }

  const clearQuantResult = () => {
    quantStrategy.value = ''
    backtestResult.value = null
    stockAnalysis.value = ''
  }

  // ========== Mock 数据生成器（后端未就绪时的降级方案）==========
  const generateMockStockData = (_stockCode: string): StockKLine[] => {
    const data: StockKLine[] = []
    const basePrice = 10 + Math.random() * 40
    let price = basePrice
    const today = new Date()

    for (let i = 365; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      if (date.getDay() === 0 || date.getDay() === 6) continue

      const change = (Math.random() - 0.48) * price * 0.04
      price = Math.max(1, price + change)
      const open = price * (1 + (Math.random() - 0.5) * 0.02)
      const close = price
      const high = Math.max(open, close) * (1 + Math.random() * 0.02)
      const low = Math.min(open, close) * (1 - Math.random() * 0.02)

      data.push({
        date: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        close: Number(close.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        volume: Math.floor(Math.random() * 100000000),
        amount: Number((price * Math.random() * 100000000).toFixed(2)),
      })
    }
    return data
  }

  const generateMockStrategy = (strategyType: string): string => {
    const strategies: Record<string, string> = {
      '双均线': `# 双均线量化策略 - Python
# 适用平台：聚宽、米筐、同花顺

import pandas as pd
import numpy as np

def dual_ma_strategy(data, short_window=5, long_window=20):
    """
    双均线策略
    - 短期均线上穿长期均线：买入信号
    - 短期均线下穿长期均线：卖出信号
    """
    df = data.copy()
    df['MA_short'] = df['close'].rolling(window=short_window).mean()
    df['MA_long'] = df['close'].rolling(window=long_window).mean()
    
    df['signal'] = 0
    df.loc[df['MA_short'] > df['MA_long'], 'signal'] = 1  # 买入
    df.loc[df['MA_short'] <= df['MA_long'], 'signal'] = -1  # 卖出
    
    # 回测逻辑（示例）
    position = 0
    trades = []
    for i in range(len(df)):
        if df['signal'].iloc[i] == 1 and position == 0:
            position = 1  # 买入
            trades.append({'action': 'BUY', 'price': df['close'].iloc[i], 'date': df['date'].iloc[i]})
        elif df['signal'].iloc[i] == -1 and position == 1:
            position = 0  # 卖出
            trades.append({'action': 'SELL', 'price': df['close'].iloc[i], 'date': df['date'].iloc[i]})
    
    return trades

# 使用方法
# data = get_stock_data('000001', '2022-01-01', '2024-12-31')
# trades = dual_ma_strategy(data)`,

      '市盈率单因子': `# 市盈率单因子量化策略 - Excel/Python
# 逻辑：PE < 10 买入，PE > 20 卖出

## Excel 实现方案

| 日期 | 收盘价 | 市盈率PE | 买入信号 | 卖出信号 |
|------|--------|---------|---------|---------|
| =收盘价 | =收盘价/每股收益 | =IF(PE<10,"买入","") | =IF(PE>20,"卖出","") |

## Python 实现方案
def pe_factor_strategy(stock_data, low_pe=10, high_pe=20):
    df = stock_data.copy()
    df['signal'] = '持有'
    df.loc[df['pe'] < low_pe, 'signal'] = '强烈买入'
    df.loc[df['pe'] > high_pe, 'signal'] = '卖出'
    return df[df['signal'] != '持有']`,

      'MACD': `# MACD量化策略 - Python
# DIF上穿DEA买入，下穿卖出

def macd_strategy(data, fast=12, slow=26, signal=9):
    df = data.copy()
    df['EMA_fast'] = df['close'].ewm(span=fast).mean()
    df['EMA_slow'] = df['close'].ewm(span=slow).mean()
    df['DIF'] = df['EMA_fast'] - df['EMA_slow']
    df['DEA'] = df['DIF'].ewm(span=signal).mean()
    df['MACD'] = (df['DIF'] - df['DEA']) * 2
    
    df['signal'] = 0
    df.loc[(df['DIF'] > df['DEA']) & (df['DIF'].shift(1) <= df['DEA'].shift(1)), 'signal'] = 1
    df.loc[(df['DIF'] < df['DEA']) & (df['DIF'].shift(1) >= df['DEA'].shift(1)), 'signal'] = -1
    
    return df[df['signal'] != 0]`,

      'RSI': `# RSI超买超卖策略 - Python
# RSI < 30 超卖买入，RSI > 70 超买卖出

def rsi_strategy(data, period=14, oversold=30, overbought=70):
    df = data.copy()
    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    df['signal'] = 0
    df.loc[df['RSI'] < oversold, 'signal'] = 1   # 买入
    df.loc[df['RSI'] > overbought, 'signal'] = -1 # 卖出
    
    return df[df['signal'] != 0]`,
    }

    return strategies[strategyType] || strategies['双均线']
  }

  const generateMockBacktestResult = (): BacktestResult => {
    const annualReturn = (Math.random() * 40 - 5).toFixed(2)
    const maxDrawdown = (Math.random() * 20 + 5).toFixed(2)
    const winRate = (Math.random() * 30 + 40).toFixed(1)
    const sharpRatio = (Math.random() * 2 + 0.5).toFixed(2)
    const profitFactor = (Math.random() * 2 + 0.8).toFixed(2)

    return {
      annualReturn: `${annualReturn}%`,
      maxDrawdown: `${maxDrawdown}%`,
      winRate: `${winRate}%`,
      backtestPeriod: '2022-01-01 ~ 2024-12-31',
      totalTrades: Math.floor(Math.random() * 50 + 20),
      sharpRatio: sharpRatio,
      profitFactor: profitFactor,
    }
  }

  return {
    // 状态
    historyList,
    commonPrompts,
    loading,
    currentResult,
    error,
    stockData,
    quantStrategy,
    backtestResult,
    stockAnalysis,

    // 通用 Actions
    generateTextAction,
    getAiHistoryAction,
    clearAiHistory,
    deleteHistoryItem,
    copyResult,
    persistHistory,

    // 股票量化 Actions
    getStockDataAction,
    generateQuantStrategyAction,
    backtestStrategyAction,
    analyzeStockAction,
    clearQuantResult,
  }
})
