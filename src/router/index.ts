import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 定义路由类型，符合TS规范
const routes: RouteRecordRaw[] = [
  // 登录页：单独路由，无需嵌套布局
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    meta: {
      hidden: true,
      title: '登录'
    }
  },
  // 主布局：所有后台页面嵌套在此布局下（包含侧边栏、头部）
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/home',
    meta: { title: '主布局' },
    // 子路由：后台所有功能页面
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页', icon: 'Home' }
      },
      {
        path: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'Dashboard' }
      },
      {
        path: 'user',
        component: () => import('@/views/UserList.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'project',
        component: () => import('@/views/ProjectAnalyzer.vue'),
        meta: { title: '项目分析', icon: 'Document' }
      },
      {
        path: 'github',
        component: () => import('@/views/GithubTrending.vue'),
        meta: { title: 'GitHub趋势', icon: 'Link' }
      },
      {
        path: 'ai-assistant',
        component: () => import('@/views/AiAssistant/index.vue'),
        meta: { title: 'AI助手', icon: 'Bot' }
      }
      // 后续新增页面，可在此处添加子路由
    ]
  },
  // 404页面：匹配所有未定义的路由，跳转到404
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404.vue'),
    meta: { hidden: true, title: '页面不存在' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// 登录守卫：路由跳转前执行，验证是否登录
router.beforeEach((to, _from, next) => {
  // 1. 获取localStorage中的token（登录后存储）
  const token = localStorage.getItem('token')
  // 2. 逻辑判断：未登录 + 访问的不是登录页 → 跳转到登录页
  if (to.path !== '/login' && !token) {
    return next('/login')
  }
  // 3. 已登录 + 访问登录页 → 跳转到首页（避免重复登录）
  if (to.path === '/login' && token) {
    return next('/home')
  }
  // 4. 正常跳转
  next()
})

export default router
