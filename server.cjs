// 纯 Node.js 文件扫描后端服务（无需 express）
const http = require('http')
const fs = require('fs')
const path = require('path')
const { exec, spawn, execSync } = require('child_process')
const url = require('url')

const PORT = 3456

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

// 发送 JSON 响应
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
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
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    res.end()
    return
  }

  // API: 获取文件夹列表
  if (pathname === '/api/folders/list' && req.method === 'GET') {
    const basePath = query.path || 'D:\\'  
    
    try {
      if (!fs.existsSync(basePath)) {
        return sendJSON(res, 404, { code: 404, message: '路径不存在', data: null })
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
      })
    } catch (e) {
      sendJSON(res, 500, { code: 500, message: e.message, data: null })
    }
    return
  }
  if (pathname === '/api/projects/scan' && req.method === 'GET') {
    const basePath = query.path || 'D:\\workProject\\sele_project'
    
    try {
      if (!fs.existsSync(basePath)) {
        return sendJSON(res, 404, { code: 404, message: '路径不存在', data: null })
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
      })
    } catch (e) {
      sendJSON(res, 500, { code: 500, message: e.message, data: null })
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
          return sendJSON(res, 400, { code: 400, message: '缺少项目路径', data: null })
        }
        
        const cmd = packageManager === 'pnpm' ? 'pnpm install' :
                     packageManager === 'yarn' ? 'yarn install' : 'npm install'
        
        exec(cmd, { cwd: projectPath }, (error, stdout, stderr) => {
          if (error) {
            return sendJSON(res, 500, { code: 500, message: '安装失败: ' + error.message, data: null })
          }
          sendJSON(res, 200, { code: 200, message: '依赖安装成功', data: null })
        })
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null })
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
          return sendJSON(res, 400, { code: 400, message: '缺少项目路径', data: null })
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
        })
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null })
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
          return sendJSON(res, 400, { code: 400, message: '缺少版本号', data: null })
        }
        
        exec(`nvm use ${version}`, (error, stdout, stderr) => {
          if (error) {
            return sendJSON(res, 500, { code: 500, message: '切换失败，请确保已安装 nvm', data: null })
          }
          sendJSON(res, 200, { code: 200, message: `已切换到 Node ${version}`, data: null })
        })
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null })
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
          return sendJSON(res, 400, { code: 400, message: '缺少项目路径', data: null })
        }
        
        // TODO: 实现停止项目逻辑，需要维护运行中的进程 PID 映射
        sendJSON(res, 200, { code: 200, message: '项目已停止', data: null })
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null })
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
          return sendJSON(res, 400, { code: 400, message: '缺少版本号', data: null })
        }
        
        exec(`nvm use ${version}`, (error, stdout, stderr) => {
          if (error) {
            return sendJSON(res, 500, { code: 500, message: '切换失败，请确保已安装 nvm', data: null })
          }
          sendJSON(res, 200, { code: 200, message: `已切换到 Node ${version}`, data: null })
        })
      } catch (e) {
        sendJSON(res, 400, { code: 400, message: e.message, data: null })
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
          return sendJSON(res, 400, { code: 400, message: '请输入用户名和密码', data: null })
        }

        const user = USERS_DB.find(u => u.username === username && u.password === password)

        if (!user) {
          return sendJSON(res, 401, { code: 401, message: '用户名或密码错误', data: null })
        }

        if (user.status === 'disabled') {
          return sendJSON(res, 403, { code: 403, message: '账号已被禁用', data: null })
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
        })
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null })
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
    })
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
          return sendJSON(res, 400, { code: 400, message: '缺少必填字段', data: null })
        }

        if (USERS_DB.find(u => u.username === username)) {
          return sendJSON(res, 400, { code: 400, message: '用户名已存在', data: null })
        }

        const newUser = {
          id: USERS_DB.length + 1,
          name, username, password, role, email: email || '', status, avatar: ''
        }
        USERS_DB.push(newUser)

        const { password: _, ...userInfo } = newUser
        sendJSON(res, 200, { code: 200, message: '新增成功', data: userInfo })
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null })
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
          return sendJSON(res, 404, { code: 404, message: '用户不存在', data: null })
        }

        const updates = JSON.parse(body)
        Object.assign(user, updates, { id: user.id, password: user.password })

        const { password: _, ...userInfo } = user
        sendJSON(res, 200, { code: 200, message: '编辑成功', data: userInfo })
      } catch (e) {
        sendJSON(res, 500, { code: 500, message: e.message, data: null })
      }
    })
    return
  }

  // API: 删除用户
  if (pathname.startsWith('/api/users/delete/') && req.method === 'DELETE') {
    const id = Number(pathname.split('/').pop())
    const idx = USERS_DB.findIndex(u => u.id === id)

    if (idx === -1) {
      return sendJSON(res, 404, { code: 404, message: '用户不存在', data: null })
    }

    const removed = USERS_DB.splice(idx, 1)[0]
    const { password: _, ...userInfo } = removed
    sendJSON(res, 200, { code: 200, message: '删除成功', data: userInfo })
    return
  }

  // 404
  sendJSON(res, 404, { code: 404, message: '接口不存在', data: null })
})

server.listen(PORT, () => {
  console.log(`✅ 项目扫描服务已启动: http://localhost:${PORT}`)
  console.log(`📁 扫描路径: D:\\workProject\\sele_project`)
})
