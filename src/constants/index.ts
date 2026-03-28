// API 端点常量（不含 /api 前缀，baseURL 已在 request.ts 中统一配置）
export const API_ENDPOINTS = {
  // 项目相关
  PROJECTS_SCAN: '/projects/scan',
  PROJECTS_INSTALL: '/projects/install',
  PROJECTS_RUN: '/projects/run',
  PROJECTS_STOP: '/projects/stop',
  PROJECTS_SWITCH_NODE: '/projects/switch-node',
  
  // 用户相关
  USERS_LOGIN: '/users/login',
  USERS_LIST: '/users/list',
  USERS_ADD: '/users/add',
  USERS_EDIT: '/users/edit',
  USERS_DELETE: '/users/delete',
} as const

// 框架类型常量
export const FRAMEWORKS = {
  VUE: 'Vue',
  REACT: 'React',
  NEXT_JS: 'Next.js',
  NUXT: 'Nuxt',
  ANGULAR: 'Angular',
  SVELTE: 'Svelte',
  EXPRESS: 'Express',
  FASTIFY: 'Fastify',
  EGG: 'Egg',
  NESTJS: 'NestJS',
  NODE_JS: 'Node.js',
} as const

// 包管理器常量
export const PACKAGE_MANAGERS = {
  NPM: 'npm',
  PNPM: 'pnpm',
  YARN: 'yarn',
} as const

// 用户角色常量
export const USER_ROLES = {
  ADMIN: '管理员',
  USER: '用户',
  VISITOR: '访客',
} as const

// 用户状态常量
export const USER_STATUS = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
} as const

// 主题常量
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
} as const

// 缓存时间（毫秒）
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,      // 5分钟
  MEDIUM: 30 * 60 * 1000,    // 30分钟
  LONG: 60 * 60 * 1000,      // 1小时
} as const

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZES: [10, 20, 50, 100],
} as const

// 表单验证规则
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 32,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const
