// API 导出（兼容旧代码）
export { projectService } from '@/services/projectService'
export { userService } from '@/services/userService'

// 保留旧的 API 导出，用于兼容
export { mockScanProjects, mockInstallDeps, mockRunProject, mockSwitchNodeVersion } from './project'
export { mockLogin, mockGetUserList, mockAddUser, mockEditUser, mockDeleteUser } from './mock'
