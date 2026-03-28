# qclaw-admin 快速参考指南

## 🚀 快速启动

```bash
# 进入项目目录
cd D:\workProject\sele_project\qclaw-admin

# 启动开发服务器
npm run dev

# 访问地址
http://localhost:3001
```

---

## 📁 项目结构速查

```
src/
├── api/index.ts              ← 所有接口定义
├── components/               ← 可复用组件
├── hooks/                    ← 自定义钩子
├── layout/Layout.vue         ← 主布局
├── router/index.ts           ← 路由配置
├── stores/modules/           ← Pinia 状态管理
├── types/index.ts            ← TypeScript 类型
├── utils/request.ts          ← Axios 请求封装
├── views/                    ← 页面组件
├── main.ts                   ← 应用入口
└── style.css                 ← 全局样式
```

---

## 🔌 常用代码片段

### 1. 发送 API 请求
```typescript
import { userApi, projectApi } from '@/api'

// 获取用户列表
const users = await userApi.getUserList({ page: 1, pageSize: 10 })

// 登录
const { token, user } = await userApi.login({ username, password })
```

### 2. 使用 Pinia Store
```typescript
import { useUserStore, useProjectStore } from '@/stores'

const userStore = useUserStore()
const projectStore = useProjectStore()

// 设置用户信息
userStore.setUserInfo(user)

// 获取项目列表
const projects = projectStore.projectList
```

### 3. 路由跳转
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到首页
router.push('/dashboard')

// 跳转到用户管理
router.push('/user')
```

### 4. 使用 Element Plus 组件
```vue
<template>
  <!-- 无需 import，直接使用 -->
  <el-button type="primary" @click="handleClick">按钮</el-button>
  <el-input v-model="text" placeholder="输入框" />
  <el-message>提示信息</el-message>
</template>

<script setup lang="ts">
// 无需 import ref，直接使用
const text = ref('')

const handleClick = () => {
  ElMessage.success('操作成功')
}
</script>
```

### 5. 响应式数据
```typescript
// 无需 import，直接使用
const count = ref(0)
const user = reactive({ name: '', age: 0 })
const computed = computed(() => count.value * 2)
const watch = watch(() => count.value, (newVal) => {
  console.log('count 变化了:', newVal)
})
```

---

## 🛠️ 常见操作

### 添加新页面
1. 在 `src/views/` 创建 `NewPage.vue`
2. 在 `src/router/index.ts` 添加路由：
```typescript
{
  path: 'new-page',
  component: () => import('@/views/NewPage.vue'),
  meta: { title: '新页面', icon: 'Document' }
}
```

### 添加新接口
在 `src/api/index.ts` 添加：
```typescript
export const newApi = {
  getList: (params) => request.get('/api/new', { params }),
  create: (data) => request.post('/api/new', data),
  update: (id, data) => request.put(`/api/new/${id}`, data),
  delete: (id) => request.delete(`/api/new/${id}`)
}
```

### 添加新 Store
1. 在 `src/stores/modules/` 创建 `newStore.ts`
2. 在 `src/stores/index.ts` 导出：
```typescript
export { useNewStore } from './modules/newStore'
```

### 修改后端接口地址
编辑 `.env.development` 或 `.env.production`：
```
VITE_API_URL=http://your-backend-url
```

---

## 🔐 登录流程

1. 用户访问 `/dashboard` → 检查 token
2. 无 token → 自动跳转 `/login`
3. 登录成功 → 保存 token 到 localStorage
4. 后续请求自动携带 token（在请求头中）
5. Token 过期（401） → 自动清除 token 并跳转登录页

---

## 📊 API 请求示例

### 登录
```typescript
const { token, user } = await userApi.login({
  username: 'admin',
  password: '123456'
})

// 自动保存 token
localStorage.setItem('token', token)
```

### 获取列表
```typescript
const response = await userApi.getUserList({
  page: 1,
  pageSize: 10
})

// 自动处理加载动画和错误提示
```

### 创建/更新/删除
```typescript
// 创建
await userApi.createUser({ name: 'John', email: 'john@example.com' })

// 更新
await userApi.updateUser('user-id', { name: 'Jane' })

// 删除
await userApi.deleteUser('user-id')
```

---

## 🎨 Element Plus 常用组件

```vue
<!-- 按钮 -->
<el-button type="primary">主按钮</el-button>
<el-button type="success">成功</el-button>
<el-button type="warning">警告</el-button>
<el-button type="danger">危险</el-button>

<!-- 输入框 -->
<el-input v-model="text" placeholder="请输入" />
<el-input v-model="password" type="password" placeholder="密码" />

<!-- 表格 -->
<el-table :data="tableData">
  <el-table-column prop="name" label="名称" />
  <el-table-column prop="email" label="邮箱" />
</el-table>

<!-- 表单 -->
<el-form :model="form">
  <el-form-item label="用户名">
    <el-input v-model="form.username" />
  </el-form-item>
</el-form>

<!-- 对话框 -->
<el-dialog v-model="dialogVisible" title="提示">
  <span>这是一个对话框</span>
</el-dialog>

<!-- 消息提示 -->
<el-message>普通消息</el-message>
<el-message-success>成功消息</el-message-success>
<el-message-error>错误消息</el-message-error>
```

---

## 🐛 调试技巧

### 查看网络请求
1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 查看所有 API 请求和响应

### 查看 Pinia 状态
1. 安装 Vue DevTools 浏览器扩展
2. 打开开发者工具
3. 切换到 Vue 标签，查看 Pinia 状态

### 查看路由信息
```typescript
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

console.log('当前路由:', route.path)
console.log('路由参数:', route.params)
console.log('查询参数:', route.query)
```

---

## 📝 环境变量

### 开发环境 (.env.development)
```
VITE_API_URL=http://localhost:3456
VITE_PORT=3000
```

### 生产环境 (.env.production)
```
VITE_API_URL=https://your-production-domain.com
VITE_PORT=80
```

### 在代码中使用
```typescript
const apiUrl = import.meta.env.VITE_API_URL
const port = import.meta.env.VITE_PORT
```

---

## 🚀 打包部署

### 开发环境
```bash
npm run dev
```

### 生产环境打包
```bash
npm run build
```

### 预览打包结果
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
npm run lint:fix
```

### 代码格式化
```bash
npm run format
npm run format:check
```

---

## 💡 最佳实践

1. **API 调用** - 统一在 `src/api/` 中定义，不要在组件中直接调用
2. **状态管理** - 使用 Pinia Store，不要在组件中直接修改全局状态
3. **路由** - 使用 `router.push()` 跳转，不要使用 `window.location`
4. **样式** - 使用 Tailwind CSS 或 Element Plus 样式，避免硬编码颜色
5. **类型** - 为所有数据定义 TypeScript 类型，提升代码质量
6. **错误处理** - 依赖 Axios 拦截器统一处理，无需在每个请求中重复

---

## 📞 获取帮助

- 查看 `OPTIMIZATION_REPORT.md` 了解详细优化说明
- 查看 `src/api/index.ts` 了解 API 定义方式
- 查看 `src/stores/modules/` 了解 Store 定义方式
- 查看 `src/views/` 了解页面组件示例

---

**最后更新：** 2026-03-28 22:09 GMT+8
