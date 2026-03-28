import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/user',
        name: 'UserList',
        component: () => import('@/views/UserList.vue'),
      },
      {
        path: '/project',
        name: 'ProjectAnalyzer',
        component: () => import('@/views/ProjectAnalyzer.vue'),
      },
      {
        path: '/github',
        name: 'GithubTrending',
        component: () => import('@/views/GithubTrending.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // 白名单：无需登录的页面
  if (!to.meta.requiresAuth) {
    // 已登录状态下访问 login，跳转首页
    if (to.path === '/login' && auth.isLoggedIn) {
      next('/')
      return
    }
    next()
    return
  }

  // 需要登录的页面：无 token 则跳转登录
  if (!auth.isLoggedIn) {
    next('/login')
    return
  }

  next()
})

export default router
