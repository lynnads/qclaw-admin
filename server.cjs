// 纯 Node.js 文件扫描后端服务（无需 express）
const http = require('http')
const fs = require('fs')
const path = require('path')
const { exec, spawn, execSync } = require('child_process')
const url = require('url')

const PORT = 3456

// ==================== 数据源配置 ====================
// Tushare（需积分）：https://tushare.pro/register?reg=135789
const TUSHARE_TOKEN = '27a12f432b95e298c9d8bbc4fc30ec11c62880db196081e856cc2860'
const TUSHARE_API = 'https://api.tushare.pro'

// 东方财富（免费，无需注册）
const EASTMONEY_API = 'http://push2his.eastmoney.com/api/qt/stock/kline/get'

// 新浪财经（免费，无需注册）
const SINA_API = 'https://quotes.sina.cn/cn/api/json_v2.php/CN_MarketDataService.getKLineData'

// 获取 Node 版本
const getNodeVersion = () => {
  try {
    const version = execSync('node --version', { encoding: 'utf-8' }).trim()
    return version
  } catch {
    return 'N/A'
  }
}

// 递归扫描项目
const scanProjects = (dirPath, depth = 0) => {
  const projects = []
  
  if (depth > 5) return projects // 最多扫描5层
  
  try {
    if (!fs.existsSync(dirPath)) return projects
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      
      const fullPath = path.join(dirPath, entry.name)
      const packageJsonPath = path.join(fullPath, 'package.json')
      
      if (fs.existsSync(packageJsonPath)) {
        // 找到项目
        try {
          const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
          const depsInstalled = fs.existsSync(path.join(fullPath, 'node_modules'))
          
          // 检测包管理器
          let packageManager = 'npm'
          if (fs.existsSync(path.join(fullPath, 'pnpm-lock.yaml'))) packageManager = 'pnpm'
          else if (fs.existsSync(path.join(fullPath, 'yarn.lock'))) packageManager = 'yarn'
          
          projects.push({
            name: pkg.name || entry.name,
            path: fullPath,
            nodeVersion: pkg.engines?.node || getNodeVersion(),
            depsInstalled,
            packageManager,
            version: pkg.version || 'N/A',
            framework: detectFramework(pkg),
          })
        } catch (e) {
          console.error(`Error reading ${packageJsonPath}:`, e.message)
        }
      } else {
        // 继续递归扫描子目录
        const subProjects = scanProjects(fullPath, depth + 1)
        projects.push(...subProjects)
      }
    }
  } catch (e) {
    console.error(`Error scanning ${dirPath}:`, e.message)
  }
  
  return projects
}

// 检测技术栈
const detectFramework = (pkg) => {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  
  if (deps.vue) return 'Vue'
  if (deps.react) return 'React'
  if (deps.next) return 'Next.js'
  if (deps.nuxt) return 'Nuxt'
  if (deps.angular) return 'Angular'
  if (deps.svelte) return 'Svelte'
  if (deps.express) return 'Express'
  if (deps.fastify) return 'Fastify'
  if (deps.egg) return 'Egg'
  if (deps.nestjs) return 'NestJS'
  
  return 'Node.js'
}

// CORS 允许的源（支持多个端口）
const getAllowedOrigin = (req) => {
  const origin = req.headers.origin || ''
  // 允许 localhost 的所有端口
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    return origin
  }
  return '*'
}

// 发送 JSON 响应
const sendJSON = (res, statusCode, data, req) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': req ? getAllowedOrigin(req) : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
  res.writeHead(statusCode, headers)
  res.end(JSON.stringify(data))
}

// 创建服务器
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname
  const query = parsedUrl.query

  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': getAllowedOrigin(req),
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    })
    res.end()
    return
  }

  // API: 获取文件夹列表
  if (pathname === '/api/folders/list' && req.method === 'GET') {
    const basePath = query.path || 'D:\\'  
    
    try {
      if (!fs.existsSync(basePath)) {
        return sendJSON(res, 404, { code: 404, message: '路径不存在', data: null }, req)
      }
      
      const entries = fs.readdirSync(basePath, { withFileTypes: true })
      const folders = entries
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
        .map(entry => path.join(basePath, entry.name))
        .sort()
      
      sendJSON(res, 200, {
        code: 200,
        message: '获取成功',
        data: { folders }
      }, req)
    } catch (e) {
      sendJSON(res, 500, { code: 500, message: e.message, data: null }, req)
    }
    return
  }
  if (pathname === '/api/projects/scan' && req.method === 'GET') {
    const basePath = query.path || 'D:\\workProject\\sele_project'
    
    try {
      if (!fs.existsSync(basePath)) {
        return sendJSON(res, 404, { code: 404, message: '路径不存在', data: null }, req)
      }
      
      const projects = []
      const entries = fs.readdirSync(basePath, { withFileTypes: true })
      
      // 只扫描一级子目录
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue
        
        const projectPath = path.join(basePath, entry.name)
        const packageJsonPath = path.join(projectPath, 'package.json')
        
        if (fs.existsSync(packageJsonPath)) {
          try {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
            const depsInstalled = fs.existsSync(path.join(projectPath, 'node_modules'))
            
            // 检测包管理器
            let packageManager = 'npm'
            if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) packageManager = 'pnpm'
            else if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) packageManager = 'yarn'
            
            projects.push({
              name: pkg.name || entry.name,
              path: projectPath,
              nodeVersion: pkg.engines?.node || getNodeVersion(),
              depsInstalled,
              packageManager,
              version: pkg.version || 'N/A',
              framework: detectFramework(pkg),
            })
          } catch (e) {
            console.error(`Error reading ${packageJsonPath}:`, e.message)
          }
        }
      }
      
      sendJSON(res, 200, {
        code: 200,
        message: '扫描成功',
        data: { projects, total: projects.length }
      }, req)
    } catch (e) {
      sendJSON(res, 500, { code: 500, message: e.message, data: null }, req)
    }
    return
  }

  // API: 安装依赖
  if (pathname === '/api/projects/install' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { projectPath, packageManager } = JSON.parse(body)
        
        if (!projectPath) {
          return sendJSON(res, 400, { code: 400, message: '缺少项目路径', data: null }, req)
        }
        
        const cmd = packageManager === 'pnpm' ? 'pnpm install' :
                     packageManager === 'yarn' ? 'yarn install' : 'npm install'
        
        exec(cmd, { cwd: projectPath }, (error, stdout, stderr) => {
          if (error) {
            return sendJSON(res, 500, { code: 500, message: '安装失败: ' + error.message, data: null }, req)
          }
          sendJSON(res, 200, { code: 200, message: '依赖安装成功', data: null }, req)
        })
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 运行项目
  if (pathname === '/api/projects/run' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { projectPath, packageManager } = JSON.parse(body)
        
        if (!projectPath) {
          return sendJSON(res, 400, { code: 400, message: '缺少项目路径', data: null }, req)
        }
        
        const cmd = packageManager === 'pnpm' ? ['pnpm', 'run', 'dev'] :
                     packageManager === 'yarn' ? ['yarn', 'dev'] : ['npm', 'run', 'dev']
        
        const child = spawn(cmd[0], cmd.slice(1), { 
          cwd: projectPath,
          detached: true,
          stdio: 'ignore'
        })
        
        child.unref()
        
        sendJSON(res, 200, { 
          code: 200, 
          message: '项目已启动', 
          data: { pid: child.pid, port: 3000 } 
        }, req)
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 切换 Node 版本
  if (pathname === '/api/node/switch' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { version } = JSON.parse(body)
        
        if (!version) {
          return sendJSON(res, 400, { code: 400, message: '缺少版本号', data: null }, req)
        }
        
        exec(`nvm use ${version}`, (error, stdout, stderr) => {
          if (error) {
            return sendJSON(res, 500, { code: 500, message: '切换失败，请确保已安装 nvm', data: null }, req)
          }
          sendJSON(res, 200, { code: 200, message: `已切换到 Node ${version}`, data: null }, req)
        })
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 停止项目
  if (pathname === '/api/projects/stop' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { projectPath } = JSON.parse(body)
        
        if (!projectPath) {
          return sendJSON(res, 400, { code: 400, message: '缺少项目路径', data: null }, req)
        }
        
        // TODO: 实现停止项目逻辑，需要维护运行中的进程 PID 映射
        sendJSON(res, 200, { code: 200, message: '项目已停止', data: null }, req)
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 切换 Node 版本（前端路由别名，兼容前端常量定义）
  if (pathname === '/api/projects/switch-node' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { version } = JSON.parse(body)
        
        if (!version) {
          return sendJSON(res, 400, { code: 400, message: '缺少版本号', data: null }, req)
        }
        
        exec(`nvm use ${version}`, (error, stdout, stderr) => {
          if (error) {
            return sendJSON(res, 500, { code: 500, message: '切换失败，请确保已安装 nvm', data: null }, req)
          }
          sendJSON(res, 200, { code: 200, message: `已切换到 Node ${version}`, data: null }, req)
        })
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null }, req)
      }
    })
    return
  }

  // ==================== 用户 API ====================

  // 模拟用户数据库
  // TODO: 密码目前为明文存储，仅用于开发测试环境。生产环境需使用 bcrypt 等加密方式存储密码。
  // 测试账号统一密码: Test@123
  const USERS_DB = [
    { id: 1, name: 'Admin', username: 'admin', password: 'Test@123', role: '管理员', email: 'admin@qclaw.com', status: 'active', avatar: '' },
    { id: 2, name: '张三', username: 'zhangsan', password: 'Test@123', role: '用户', email: 'zhangsan@qclaw.com', status: 'active', avatar: '' },
    { id: 3, name: '李四', username: 'lisi', password: 'Test@123', role: '用户', email: 'lisi@qclaw.com', status: 'active', avatar: '' },
    { id: 4, name: '王五', username: 'wangwu', password: 'Test@123', role: '访客', email: 'wangwu@qclaw.com', status: 'active', avatar: '' },
    { id: 5, name: '赵六', username: 'zhaoliu', password: 'Test@123', role: '用户', email: 'zhaoliu@qclaw.com', status: 'active', avatar: '' },
    { id: 6, name: '孙七', username: 'sunqi', password: 'Test@123', role: '用户', email: 'sunqi@qclaw.com', status: 'disabled', avatar: '' },
    { id: 7, name: '周八', username: 'zhouba', password: 'Test@123', role: '用户', email: 'zhouba@qclaw.com', status: 'active', avatar: '' },
    { id: 8, name: '吴九', username: 'wujiu', password: 'Test@123', role: '用户', email: 'wujiu@qclaw.com', status: 'active', avatar: '' },
  ]

  // API: 用户登录
  if (pathname === '/api/users/login' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body)

        if (!username || !password) {
          return sendJSON(res, 400, { code: 400, message: '请输入用户名和密码', data: null }, req)
        }

        const user = USERS_DB.find(u => u.username === username && u.password === password)

        if (!user) {
          return sendJSON(res, 401, { code: 401, message: '用户名或密码错误', data: null }, req)
        }

        if (user.status === 'disabled') {
          return sendJSON(res, 403, { code: 403, message: '账号已被禁用', data: null }, req)
        }

        const token = 'token_' + Date.now() + '_' + Math.random().toString(36).slice(2)
        const { password: _, ...userInfo } = user

        sendJSON(res, 200, {
          code: 200,
          message: '登录成功',
          data: {
            token,
            userInfo,
          }
        }, req)
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 获取用户列表
  if (pathname === '/api/users/list' && req.method === 'GET') {
    const { keyword, role, status, page = 1, pageSize = 10 } = query

    let filtered = [...USERS_DB]

    if (keyword) {
      const kw = keyword.toLowerCase()
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(kw) ||
        u.username.toLowerCase().includes(kw) ||
        u.email.toLowerCase().includes(kw)
      )
    }
    if (role) {
      filtered = filtered.filter(u => u.role === role)
    }
    if (status) {
      filtered = filtered.filter(u => u.status === status)
    }

    const total = filtered.length
    const start = (Number(page) - 1) * Number(pageSize)
    const list = filtered.slice(start, start + Number(pageSize)).map(({ password, ...u }) => u)

    sendJSON(res, 200, {
      code: 200,
      message: '获取成功',
      data: { list, total, page: Number(page), pageSize: Number(pageSize) }
    }, req)
    return
  }

  // API: 新增用户
  if (pathname === '/api/users/add' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { name, username, password, role = '用户', email, status = 'active' } = JSON.parse(body)

        if (!name || !username || !password) {
          return sendJSON(res, 400, { code: 400, message: '缺少必填字段', data: null }, req)
        }

        if (USERS_DB.find(u => u.username === username)) {
          return sendJSON(res, 400, { code: 400, message: '用户名已存在', data: null }, req)
        }

        const newUser = {
          id: USERS_DB.length + 1,
          name, username, password, role, email: email || '', status, avatar: ''
        }
        USERS_DB.push(newUser)

        const { password: _, ...userInfo } = newUser
        sendJSON(res, 200, { code: 200, message: '新增成功', data: userInfo }, req)
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 编辑用户
  if (pathname.startsWith('/api/users/edit/') && req.method === 'PUT') {
    const id = Number(pathname.split('/').pop())
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const user = USERS_DB.find(u => u.id === id)
        if (!user) {
          return sendJSON(res, 404, { code: 404, message: '用户不存在', data: null }, req)
        }

        const updates = JSON.parse(body)
        Object.assign(user, updates, { id: user.id, password: user.password })

        const { password: _, ...userInfo } = user
        sendJSON(res, 200, { code: 200, message: '编辑成功', data: userInfo }, req)
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 删除用户
  if (pathname.startsWith('/api/users/delete/') && req.method === 'DELETE') {
    const id = Number(pathname.split('/').pop())
    const idx = USERS_DB.findIndex(u => u.id === id)

    if (idx === -1) {
      return sendJSON(res, 404, { code: 404, message: '用户不存在', data: null }, req)
    }

    const removed = USERS_DB.splice(idx, 1)[0]
    const { password: _, ...userInfo } = removed
    sendJSON(res, 200, { code: 200, message: '删除成功', data: userInfo }, req)
    return
  }

  // ==================== AI 助手 API ====================

  // 模拟 AI 历史记录存储
  let AI_HISTORY_DB = []

  // API: 获取 AI 历史记录
  if (pathname === '/api/ai/history' && req.method === 'GET') {
    sendJSON(res, 200, { code: 200, message: '获取成功', data: AI_HISTORY_DB.slice(0, 50) }, req)
    return
  }

  // API: AI 文本生成
  if (pathname === '/api/ai/generate' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { prompt, type = 'text' } = JSON.parse(body)

        if (!prompt) {
          return sendJSON(res, 400, { code: 400, message: '请输入提示词', data: null }, req)
        }

        // 模拟 AI 响应
        let result = ''
        if (prompt.includes('测试数据')) {
          result = JSON.stringify([
            { id: 1, username: 'user001', name: '张三', phone: '13800138001', status: 'active' },
            { id: 2, username: 'user002', name: '李四', phone: '13800138002', status: 'active' },
            { id: 3, username: 'user003', name: '王五', phone: '13800138003', status: 'disabled' },
          ], null, 2)
        } else if (prompt.includes('接口文档')) {
          result = `# 用户管理接口文档

## 获取用户列表
- **URL**: /api/users/list
- **Method**: GET
- **参数**: keyword, role, status, page, pageSize
- **响应**: { code: 200, data: { list: [], total: number } }

## 新增用户
- **URL**: /api/users/add
- **Method**: POST
- **参数**: name, username, password, role, email
- **响应**: { code: 200, message: '新增成功' }`
        } else if (prompt.includes('组件') || prompt.includes('Vue')) {
          result = `<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="账号" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="form.phone" />
    </el-form-item>
  </el-form>
</template>`
        } else {
          result = `已收到您的请求：${prompt}\n\n这是一个模拟的 AI 响应。请配置真实的 AI 接口（如通义千问、文心一言）以获得更好的效果。`
        }

        // 保存历史记录
        const historyItem = {
          id: Date.now(),
          prompt,
          result,
          type,
          createTime: new Date().toLocaleString('zh-CN')
        }
        AI_HISTORY_DB.unshift(historyItem)
        if (AI_HISTORY_DB.length > 50) AI_HISTORY_DB.pop()

        sendJSON(res, 200, { code: 200, message: '生成成功', data: result }, req)
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 股票量化策略生成
  if (pathname === '/api/ai/quant/strategy' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { strategyType, stockCode } = JSON.parse(body)

        const strategies = {
          '双均线': `# 双均线量化策略 - Python
# 适用平台：聚宽、米筐、同花顺

import pandas as pd
import numpy as np

def dual_ma_strategy(data, short_window=5, long_window=20):
    """
    双均线策略
    - 5日均线上穿20日均线：买入信号
    - 5日均线下穿20日均线：卖出信号
    """
    df = data.copy()
    df['MA5'] = df['close'].rolling(window=short_window).mean()
    df['MA20'] = df['close'].rolling(window=long_window).mean()
    
    df['signal'] = 0
    # 金叉买入
    df.loc[(df['MA5'] > df['MA20']) & (df['MA5'].shift(1) <= df['MA20'].shift(1)), 'signal'] = 1
    # 死叉卖出
    df.loc[(df['MA5'] < df['MA20']) & (df['MA5'].shift(1) >= df['MA20'].shift(1)), 'signal'] = -1
    
    return df[df['signal'] != 0]

# 股票代码: ${stockCode || '000001'}
# 使用方法：
# data = get_stock_data('${stockCode || '000001'}', '2022-01-01', '2024-12-31')
# signals = dual_ma_strategy(data)`,

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
    # 金叉买入
    df.loc[(df['DIF'] > df['DEA']) & (df['DIF'].shift(1) <= df['DEA'].shift(1)), 'signal'] = 1
    # 死叉卖出
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
    df.loc[df['RSI'] < oversold, 'signal'] = 1   # 超卖买入
    df.loc[df['RSI'] > overbought, 'signal'] = -1 # 超买卖出
    
    return df[df['signal'] != 0]`,

          '市盈率单因子': `# 市盈率单因子量化策略
# PE < 10 买入，PE > 20 卖出

## Excel 实现方案
| 日期 | 收盘价 | 市盈率PE | 信号 |
|------|--------|---------|------|
| =收盘价 | =收盘价/每股收益 | =IF(PE<10,"买入",IF(PE>20,"卖出","持有")) |

## Python 实现方案
def pe_factor_strategy(stock_data, low_pe=10, high_pe=20):
    df = stock_data.copy()
    df['signal'] = '持有'
    df.loc[df['pe'] < low_pe, 'signal'] = '强烈买入'
    df.loc[df['pe'] > high_pe, 'signal'] = '卖出'
    return df[df['signal'] != '持有']`,

          '技术指标': `# 布林带量化策略 - Python
# 价格下穿下轨买入，上穿上轨卖出

def bollinger_strategy(data, period=20, std_dev=2):
    df = data.copy()
    df['MA'] = df['close'].rolling(window=period).mean()
    df['STD'] = df['close'].rolling(window=period).std()
    df['Upper'] = df['MA'] + std_dev * df['STD']
    df['Lower'] = df['MA'] - std_dev * df['STD']
    
    df['signal'] = 0
    # 下穿下轨买入
    df.loc[df['close'] < df['Lower'], 'signal'] = 1
    # 上穿上轨卖出
    df.loc[df['close'] > df['Upper'], 'signal'] = -1
    
    return df[df['signal'] != 0]`,
        }

        const result = strategies[strategyType] || strategies['双均线']
        sendJSON(res, 200, { code: 200, message: '生成成功', data: result }, req)
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 策略回测
  if (pathname === '/api/ai/quant/backtest' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        // 模拟回测结果
        const annualReturn = (Math.random() * 30 + 5).toFixed(2)
        const maxDrawdown = (Math.random() * 15 + 5).toFixed(2)
        const winRate = (Math.random() * 20 + 50).toFixed(1)
        const sharpRatio = (Math.random() * 1.5 + 0.8).toFixed(2)
        const profitFactor = (Math.random() * 1.5 + 1).toFixed(2)
        const totalTrades = Math.floor(Math.random() * 30 + 20)

        const result = {
          annualReturn: `${annualReturn}%`,
          maxDrawdown: `${maxDrawdown}%`,
          winRate: `${winRate}%`,
          backtestPeriod: '2022-01-01 ~ 2024-12-31',
          totalTrades,
          sharpRatio,
          profitFactor,
          explain: `该策略在回测期间表现${Number(annualReturn) > 15 ? '良好' : '一般'}，年化收益${annualReturn}%，最大回撤控制在${maxDrawdown}%以内。建议小资金实盘测试，逐步优化参数。`
        }

        sendJSON(res, 200, { code: 200, message: '回测完成', data: result }, req)
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null }, req)
      }
    })
    return
  }

  // API: 获取股票数据（支持多数据源：东方财富、新浪财经、Tushare、Mock）
  if (pathname === '/api/ai/stock/data' && req.method === 'GET') {
    const { stockCode, startDate, endDate } = query
    
    // 尝试多个数据源
    fetchStockData(stockCode, startDate, endDate)
      .then(result => {
        sendJSON(res, 200, {
          code: 200,
          message: result.message,
          data: result.data,
          dataSource: result.dataSource
        }, req)
      })
      .catch(err => {
        console.error('所有数据源均失败:', err)
        const mockData = generateMockStockData(stockCode, startDate, endDate)
        sendJSON(res, 200, {
          code: 200,
          message: '所有数据源失败，使用模拟数据',
          data: mockData,
          dataSource: 'mock'
        }, req)
      })
    return
  }

  // ==================== 股票数据获取函数 ====================
  
  // 主函数：依次尝试多个数据源
  async function fetchStockData(stockCode, startDate, endDate) {
    // 1. 优先尝试东方财富（免费、稳定、无需注册）
    try {
      const data = await fetchFromEastMoney(stockCode, startDate, endDate)
      if (data && data.length > 0) {
        return { data, dataSource: 'eastmoney', message: `获取成功（东方财富真实数据，共${data.length}条）` }
      }
    } catch (e) {
      console.log('东方财富获取失败:', e.message)
    }

    // 2. 尝试新浪财经
    try {
      const data = await fetchFromSina(stockCode, startDate, endDate)
      if (data && data.length > 0) {
        return { data, dataSource: 'sina', message: `获取成功（新浪财经真实数据，共${data.length}条）` }
      }
    } catch (e) {
      console.log('新浪财经获取失败:', e.message)
    }

    // 3. 尝试 Tushare（需要积分）
    if (TUSHARE_TOKEN) {
      try {
        const data = await fetchFromTushare(stockCode, startDate, endDate)
        if (data && data.length > 0) {
          return { data, dataSource: 'tushare', message: `获取成功（Tushare数据，共${data.length}条）` }
        }
      } catch (e) {
        console.log('Tushare获取失败:', e.message)
      }
    }

    // 4. 降级到 Mock 数据
    const mockData = generateMockStockData(stockCode, startDate, endDate)
    return { data: mockData, dataSource: 'mock', message: `获取成功（模拟数据，共${mockData.length}条）` }
  }

  // 东方财富数据源（免费、无需注册）
  function fetchFromEastMoney(stockCode, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const http = require('http')
      
      // 判断市场：6开头=上海(1)，其他=深圳(0)
      const market = stockCode.startsWith('6') ? '1' : '0'
      const secid = `${market}.${stockCode}`
      
      // 东方财富 K线 API
      const url = `http://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63&klt=101&fqt=1&beg=${startDate.replace(/-/g, '')}&end=${endDate.replace(/-/g, '')}&ut=fa5fd1943c7b386f172d6893dbfba10b`

      http.get(url, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            const result = JSON.parse(data)
            if (result.data && result.data.klines) {
              const klines = result.data.klines
              const formattedData = klines.map(line => {
                const parts = line.split(',')
                return {
                  date: parts[0],
                  open: Number(parts[1]),
                  close: Number(parts[2]),
                  high: Number(parts[3]),
                  low: Number(parts[4]),
                  volume: Number(parts[5]),
                  amount: Number(parts[6])
                }
              })
              resolve(formattedData)
            } else {
              reject(new Error('东方财富返回数据格式异常'))
            }
          } catch (e) {
            reject(e)
          }
        })
      }).on('error', reject)
    })
  }

  // 新浪财经数据源（免费、无需注册）
  function fetchFromSina(stockCode, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const http = require('http')
      
      // 新浪财经历史数据 API
      const market = stockCode.startsWith('6') ? 'sh' : 'sz'
      const url = `https://quotes.sina.cn/cn/api/json_v2.php/CN_MarketDataService.getKLineData?symbol=${market}${stockCode}&scale=240&ma=no&datalen=${365}`

      http.get(url, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            // 新浪返回的是 JSON 数组
            const result = JSON.parse(data)
            if (Array.isArray(result)) {
              const startStr = startDate.replace(/-/g, '')
              const endStr = endDate.replace(/-/g, '')
              
              const formattedData = result
                .filter(item => {
                  const dateStr = item.day || ''
                  return dateStr >= startStr && dateStr <= endStr
                })
                .map(item => ({
                  date: item.day,
                  open: Number(item.open),
                  close: Number(item.close),
                  high: Number(item.high),
                  low: Number(item.low),
                  volume: Number(item.volume),
                  amount: Number(item.amount || 0)
                }))
              resolve(formattedData)
            } else {
              reject(new Error('新浪财经返回数据格式异常'))
            }
          } catch (e) {
            reject(e)
          }
        })
      }).on('error', reject)
    })
  }

  // Tushare 数据源（需要积分）
  function fetchFromTushare(stockCode, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const https = require('https')
      
      const marketSuffix = stockCode.startsWith('6') ? '.SH' : '.SZ'
      const tsCode = stockCode + marketSuffix
      
      const body = JSON.stringify({
        api_name: 'daily',
        token: TUSHARE_TOKEN,
        params: {
          ts_code: tsCode,
          start_date: startDate.replace(/-/g, ''),
          end_date: endDate.replace(/-/g, '')
        },
        fields: 'trade_date,open,high,low,close,vol,amount'
      })
      
      const options = {
        hostname: 'api.tushare.pro',
        port: 443,
        path: '/',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
      
      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            const result = JSON.parse(data)
            if (result.code === 0 && result.data?.items) {
              const formattedData = result.data.items.map(item => ({
                date: item[0],
                open: Number(item[1].toFixed(2)),
                high: Number(item[2].toFixed(2)),
                low: Number(item[3].toFixed(2)),
                close: Number(item[4].toFixed(2)),
                volume: Math.floor(item[5]),
                amount: Number(item[6].toFixed(2))
              })).sort((a, b) => a.date.localeCompare(b.date))
              resolve(formattedData)
            } else {
              reject(new Error(result.msg || 'Tushare权限不足'))
            }
          } catch (e) {
            reject(e)
          }
        })
      })
      
      req.on('error', reject)
      req.write(body)
      req.end()
    })
  }

  // Mock 数据生成函数
  function generateMockStockData(stockCode, startDate, endDate) {
    const data = []
    const basePrice = 10 + Math.random() * 40
    let price = basePrice
    const start = new Date(startDate || '2024-01-01')
    const end = new Date(endDate || '2024-12-31')
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 || d.getDay() === 6) continue
      
      const change = (Math.random() - 0.48) * price * 0.04
      price = Math.max(1, price + change)
      const open = price * (1 + (Math.random() - 0.5) * 0.02)
      const close = price
      const high = Math.max(open, close) * (1 + Math.random() * 0.02)
      const low = Math.min(open, close) * (1 - Math.random() * 0.02)
      
      data.push({
        date: d.toISOString().split('T')[0],
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

  // 404
  sendJSON(res, 404, { code: 404, message: '接口不存在', data: null }, req)
})

server.listen(PORT, () => {
  console.log(`✅ 项目扫描服务已启动: http://localhost:${PORT}`)
  console.log(`📁 扫描路径: D:\\workProject\\sele_project`)
})
