import { mockLogin, mockGetUserList, mockAddUser, mockEditUser, mockDeleteUser } from './mock'

/**
 * 登录
 * @param {string} username
 * @param {string} password
 */
export const login = (username, password) => mockLogin(username, password)

/**
 * 获取用户列表
 * @param {object} params { keyword, role, status, page, pageSize }
 */
export const getUserList = params => mockGetUserList(params)

/**
 * 新增用户
 * @param {object} data { name, email, role, status }
 */
export const addUser = data => mockAddUser(data)

/**
 * 编辑用户
 * @param {number} id
 * @param {object} data { name, email, role, status }
 */
export const editUser = (id, data) => mockEditUser(id, data)

/**
 * 删除用户
 * @param {number} id
 */
export const deleteUser = id => mockDeleteUser(id)
