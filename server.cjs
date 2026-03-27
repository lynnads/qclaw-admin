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
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
    const basePath = query.path || 'D:\\workProject'
    
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

  // 404
  sendJSON(res, 404, { code: 404, message: '接口不存在', data: null })
})

server.listen(PORT, () => {
  console.log(`✅ 项目扫描服务已启动: http://localhost:${PORT}`)
  console.log(`📁 扫描路径: D:\\workProject\\sele_project`)
})
