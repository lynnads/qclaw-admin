// 模拟项目数据库
const mockProjectsDB = [
  {
    name: 'qclaw-admin',
    path: 'D:\\workProject\\sele_project\\qclaw-admin',
    nodeVersion: 'v22.21.1',
    depsInstalled: true,
    packageManager: 'npm',
  },
  {
    name: 'my-vue-app',
    path: 'D:\\workProject\\my-vue-app',
    nodeVersion: 'v20.10.0',
    depsInstalled: false,
    packageManager: 'pnpm',
  },
  {
    name: 'react-project',
    path: 'D:\\workProject\\react-project',
    nodeVersion: 'v18.16.0',
    depsInstalled: true,
    packageManager: 'npm',
  },
  {
    name: 'next-app',
    path: 'D:\\workProject\\next-app',
    nodeVersion: 'v20.10.0',
    depsInstalled: false,
    packageManager: 'npm',
  },
  {
    name: 'nuxt-project',
    path: 'D:\\workProject\\nuxt-project',
    nodeVersion: 'v22.21.1',
    depsInstalled: true,
    packageManager: 'pnpm',
  },
]

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API：扫描项目
export const mockScanProjects = async () => {
  await delay(1500)
  
  // 模拟扫描结果
  const projects = mockProjectsDB.map(p => ({
    ...p,
    installing: false,
    running: false,
  }))
  
  return {
    code: 200,
    message: '扫描成功',
    data: {
      projects,
      total: projects.length,
    },
  }
}

// Mock API：安装依赖
export const mockInstallDeps = async (projectPath, packageManager = 'npm') => {
  await delay(2000)
  
  // 模拟安装成功
  return {
    code: 200,
    message: '依赖安装成功',
    data: null,
  }
}

// Mock API：运行项目
export const mockRunProject = async (projectPath, packageManager = 'npm') => {
  await delay(1500)
  
  // 模拟运行成功
  return {
    code: 200,
    message: '项目已启动',
    data: {
      pid: Math.floor(Math.random() * 10000),
      port: 3000 + Math.floor(Math.random() * 100),
    },
  }
}

// Mock API：切换 Node 版本
export const mockSwitchNodeVersion = async (version) => {
  await delay(800)
  
  // 模拟切换成功
  return {
    code: 200,
    message: `已切换到 Node ${version}`,
    data: null,
  }
}
