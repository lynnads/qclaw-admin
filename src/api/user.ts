import { mockLogin, mockGetUserList, mockAddUser, mockEditUser, mockDeleteUser } from './mock'

/**
 * 登录
 * @param {string} username
 * @param {string} password
 */
export const login = (username: string, password: string) => mockLogin(username, password)

/**
 * 获取用户列表
 * @param {object} params { keyword, role, status, page, pageSize }
 */
export const getUserList = (params: any) => mockGetUserList(params)

/**
 * 新增用户
 * @param {object} data { name, email, role, status }
 */
export const addUser = (data: any) => mockAddUser(data)

/**
 * 编辑用户
 * @param {number} id
 * @param {object} data { name, email, role, status }
 */
export const editUser = (id: number, data: any) => mockEditUser(id, data)

/**
 * 删除用户
 * @param {number} id
 */
export const deleteUser = (id: number) => mockDeleteUser(id)
