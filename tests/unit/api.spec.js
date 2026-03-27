import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockLogin, mockGetUserList, mockAddUser, mockEditUser, mockDeleteUser } from '@/api/mock'

describe('Mock API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should login successfully with correct credentials', async () => {
    const result = await mockLogin('admin', '123456')
    expect(result.code).toBe(200)
    expect(result.data.token).toBeTruthy()
    expect(result.data.userInfo.name).toBe('Admin')
  })

  it('should fail login with wrong credentials', async () => {
    const result = await mockLogin('wrong', 'wrong')
    expect(result.code).toBe(400)
    expect(result.message).toBe('用户名或密码错误')
  })

  it('should get user list', async () => {
    const result = await mockGetUserList()
    expect(result.code).toBe(200)
    expect(result.data.list).toBeInstanceOf(Array)
    expect(result.data.total).toBeGreaterThan(0)
  })

  it('should filter user list by keyword', async () => {
    const result = await mockGetUserList({ keyword: '张' })
    expect(result.data.list.every(u => u.name.includes('张') || u.email.includes('张'))).toBe(true)
  })

  it('should add new user', async () => {
    const newUser = { name: '测试用户', email: 'test@example.com', role: '用户', status: 'active' }
    const result = await mockAddUser(newUser)
    expect(result.code).toBe(200)
    expect(result.data.name).toBe('测试用户')
  })

  it('should edit user', async () => {
    const result = await mockGetUserList()
    const user = result.data.list[0]
    const editResult = await mockEditUser(user.id, { name: '修改后的名字' })
    expect(editResult.code).toBe(200)
    expect(editResult.data.name).toBe('修改后的名字')
  })

  it('should delete user', async () => {
    const result = await mockGetUserList()
    const user = result.data.list[0]
    const deleteResult = await mockDeleteUser(user.id)
    expect(deleteResult.code).toBe(200)
  })
})
