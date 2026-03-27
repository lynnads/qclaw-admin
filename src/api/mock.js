// 模拟用户数据
let mockUsers = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 'active', createTime: '2025-01-15' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '用户', status: 'active', createTime: '2025-02-03' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: 'disabled', createTime: '2025-02-20' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '访客', status: 'active', createTime: '2025-03-08' },
  { id: 5, name: '钱七', email: 'qianqi@example.com', role: '用户', status: 'active', createTime: '2025-03-12' },
  { id: 6, name: '孙八', email: 'sunba@example.com', role: '管理员', status: 'active', createTime: '2025-03-18' },
  { id: 7, name: '周九', email: 'zhoujiu@example.com', role: '用户', status: 'disabled', createTime: '2025-03-22' },
  { id: 8, name: '吴十', email: 'wushi@example.com', role: '访客', status: 'active', createTime: '2025-04-01' },
]

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const mockLogin = async (username, password) => {
  await delay(600)
  if (username === 'admin' && password === '123456') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-token-' + Date.now(),
        userInfo: { id: 1, name: 'Admin', role: 'admin' },
      },
    }
  }
  return { code: 400, message: '用户名或密码错误', data: null }
}

export const mockGetUserList = async (params = {}) => {
  await delay(400)
  let result = [...mockUsers]

  if (params.keyword) {
    result = result.filter(u => u.name.includes(params.keyword) || u.email.includes(params.keyword))
  }
  if (params.role) {
    result = result.filter(u => u.role === params.role)
  }
  if (params.status) {
    result = result.filter(u => u.status === params.status)
  }

  const { page = 1, pageSize = 5 } = params
  const total = result.length
  const list = result.slice((page - 1) * pageSize, page * pageSize)

  return { code: 200, message: 'success', data: { list, total, page, pageSize } }
}

export const mockAddUser = async (userData) => {
  await delay(400)
  const newUser = {
    id: Date.now(),
    ...userData,
    createTime: new Date().toISOString().slice(0, 10),
  }
  mockUsers.unshift(newUser)
  return { code: 200, message: '新增成功', data: newUser }
}

export const mockEditUser = async (id, userData) => {
  await delay(400)
  const index = mockUsers.findIndex(u => u.id === id)
  if (index !== -1) {
    mockUsers[index] = { ...mockUsers[index], ...userData }
    return { code: 200, message: '保存成功', data: mockUsers[index] }
  }
  return { code: 404, message: '用户不存在', data: null }
}

export const mockDeleteUser = async (id) => {
  await delay(400)
  const index = mockUsers.findIndex(u => u.id === id)
  if (index !== -1) {
    mockUsers.splice(index, 1)
    return { code: 200, message: '删除成功', data: null }
  }
  return { code: 404, message: '用户不存在', data: null }
}
