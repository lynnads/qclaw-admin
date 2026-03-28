# QClaw Admin

现代化的项目管理后台系统，基于 Vue 3 + Vite + TypeScript 构建。

## ✨ 功能特性

- **项目扫描**：自动扫描本地项目，识别技术栈
- **依赖管理**：一键安装项目依赖
- **项目运行**：启动/停止开发服务器
- **用户管理**：完整的用户 CRUD 操作
- **现代化 UI**：深色主题 + 渐变设计
- **响应式布局**：支持桌面端和移动端

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm / pnpm / yarn

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install

# 或使用 yarn
yarn install
```

### 启动开发

```bash
# 启动后端服务器（端口 3456）
npm run server

# 启动前端开发服务器（端口 3000）
npm run dev

# 或同时启动（推荐）
npm run dev:all
```

### 访问应用

- 前端：http://localhost:3000
- 后端：http://localhost:3456

### 测试账号

- 用户名：`admin`
- 密码：`123456`

## 📁 项目结构

```
qclaw-admin/
├── src/
│   ├── api/           # API 接口
│   ├── components/    # Vue 组件
│   ├── constants/     # 常量定义
│   ├── layout/        # 布局组件
│   ├── router/        # 路由配置
│   ├── services/      # 业务服务
│   ├── stores/        # Pinia 状态管理
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   └── style.css      # 全局样式
├── server.cjs         # 后端服务器
├── vite.config.ts     # Vite 配置
├── tailwind.config.js # Tailwind 配置
└── package.json       # 项目配置
```

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 规范
- 组件使用 `<script setup>` 语法
- 样式使用 Tailwind CSS

### 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 📦 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🧪 测试

```bash
# 运行单元测试
npm run test

# 运行测试覆盖率
npm run test:coverage
```

## 📝 API 文档

### 项目相关

- `GET /api/projects/scan` - 扫描项目
- `POST /api/projects/install` - 安装依赖
- `POST /api/projects/run` - 运行项目
- `POST /api/projects/stop` - 停止项目
- `POST /api/projects/switch-node` - 切换 Node 版本

### 用户相关

- `POST /api/users/login` - 用户登录
- `GET /api/users/list` - 获取用户列表
- `POST /api/users/add` - 新增用户
- `PUT /api/users/edit/:id` - 编辑用户
- `DELETE /api/users/delete/:id` - 删除用户

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库
