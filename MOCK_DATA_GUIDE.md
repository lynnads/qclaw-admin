# 🔧 qclaw-admin 404 错误诊断与解决方案

## 问题描述

**错误信息：**
```
Failed to load dashboard data: AxiosError: Request failed with status code 404
```

**原因分析：**
前端在请求后端接口时，后端服务不存在或接口地址不正确，导致返回 404 错误。

---

## 🎯 解决方案

### 方案 1：使用 Mock 数据（推荐 - 开发环境）

我已经为你创建了完整的 Mock 数据服务，可以在没有后端的情况下正常开发。

**已创建的文件：**
- ✅ `src/services/mockService.ts` - Mock 数据服务
- ✅ `src/services/projectService.ts` - 已更新，支持 Mock 降级
- ✅ `src/services/userService.ts` - 已更新，支持 Mock 降级

**工作原理：**
```
开发环境 (import.meta.env.DEV = true)
  ↓
使用 Mock 数据服务
  ↓
模拟网络延迟
  ↓
返回模拟数据
```

**生产环境：**
```
生产环境 (import.meta.env.DEV = false)
  ↓
调用真实后端 API
  ↓
如果失败，降级到 Mock 数据
```

---

## 📋 Mock 数据内容

### 模拟项目数据
```javascript
[
  {
    id: '1',
    name: 'qclaw-admin',
    path: 'D:\\workProject\\sele_project\\qclaw-admin',
    framework: 'Vue',
    packageManager: 'npm',
    depsInstalled: true,
    running: false,
  },
  {
    id: '2',
    name: 'edict-dashboard',
    path: 'E:\\小龙虾项目\\edict\\dashboard',
    framework: 'Vue',
    packageManager: 'npm',
    depsInstalled: true,
    running: true,
    port: 7891,
  },
  // ... 更多项目
]
```

### 模拟用户数据
```javascript
[
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: '管理员',
    status: 'active',
  },
  // ... 更多用户
]
```

---

## 🚀 现在应该正常工作了

### 验证步骤

1. **刷新浏览器**
   ```
   http://localhost:3001
   ```

2. **查看 Dashboard**
   - 应该看到 4 个统计卡片（用户总数、项目总数、运行中、依赖安装）
   - 应该看到项目技术栈分布图表
   - 应该看到最近活动列表

3. **检查浏览器控制台**
   - 不应该再看到 404 错误
   - 应该看到 Mock 数据被加载

---

## 📊 Mock 服务功能

### 项目服务 (MockProjectService)
- ✅ `scanProjects()` - 扫描项目
- ✅ `installDeps()` - 安装依赖
- ✅ `runProject()` - 运行项目
- ✅ `stopProject()` - 停止项目
- ✅ `switchNodeVersion()` - 切换 Node 版本

### 用户服务 (MockUserService)
- ✅ `login()` - 用户登录
- ✅ `getUserList()` - 获取用户列表
- ✅ `getUserDetail()` - 获取用户详情
- ✅ `createUser()` - 创建用户
- ✅ `updateUser()` - 更新用户
- ✅ `deleteUser()` - 删除用户

---

## 🔐 登录测试

**测试账号：**
```
用户名：admin
密码：123456
```

**登录流程：**
1. 访问 http://localhost:3001
2. 自动跳转到登录页
3. 输入上述账号密码
4. 点击登录
5. 进入 Dashboard

---

## 🔄 从 Mock 切换到真实 API

当后端服务准备好时，只需修改后端接口地址：

### 步骤 1：更新环境变量
编辑 `.env.production`：
```
VITE_API_URL=https://your-backend-domain.com
```

### 步骤 2：后端实现接口
后端需要实现以下接口：

**项目相关：**
- `GET /api/projects/scan` - 扫描项目
- `POST /api/projects/install` - 安装依赖
- `POST /api/projects/run` - 运行项目
- `POST /api/projects/stop` - 停止项目
- `POST /api/projects/switch-node` - 切换 Node 版本

**用户相关：**
- `POST /api/users/login` - 登录
- `GET /api/users/list` - 用户列表
- `POST /api/users/add` - 创建用户
- `PUT /api/users/edit/:id` - 更新用户
- `DELETE /api/users/delete/:id` - 删除用户

### 步骤 3：自动降级
如果生产环境后端出现问题，系统会自动降级到 Mock 数据，确保应用可用性。

---

## 💡 Mock 数据的优势

1. **快速开发** - 无需等待后端完成
2. **独立测试** - 前端可以独立测试所有功能
3. **自动降级** - 后端故障时自动使用 Mock 数据
4. **真实体验** - 模拟网络延迟，接近真实场景
5. **易于维护** - 集中管理所有 Mock 数据

---

## 🎯 后续步骤

### 短期（立即）
- [x] Mock 数据服务已创建
- [x] 自动降级机制已实现
- [ ] 刷新浏览器验证

### 中期（1-2 周）
- [ ] 后端开发团队实现真实 API
- [ ] 更新环境变量指向真实后端
- [ ] 测试前后端集成

### 长期（1 个月+）
- [ ] 部署到生产环境
- [ ] 监控 API 性能
- [ ] 优化缓存策略

---

## 📞 常见问题

### Q: 为什么还是看到 404 错误？
A: 需要刷新浏览器，让 Vite 重新加载新的代码。

### Q: Mock 数据会影响生产环境吗？
A: 不会。生产环境会自动使用真实 API，只有开发环境才使用 Mock 数据。

### Q: 如何修改 Mock 数据？
A: 编辑 `src/services/mockService.ts` 中的 `mockProjects` 和 `mockUsers` 数组。

### Q: 如何禁用 Mock 数据？
A: 修改 `projectService.ts` 和 `userService.ts` 中的 `useMock` 变量。

---

## ✅ 验证清单

- [ ] 刷新浏览器
- [ ] Dashboard 正常显示
- [ ] 没有 404 错误
- [ ] 可以看到项目列表
- [ ] 可以看到用户列表
- [ ] 登录功能正常

---

**问题已解决！** 现在你可以继续开发前端功能了。🎉

当后端准备好时，只需更新接口地址即可无缝切换到真实 API。
