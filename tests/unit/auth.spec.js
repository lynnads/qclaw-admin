import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should set token correctly', () => {
    const auth = useAuthStore()
    auth.setToken('test-token')
    expect(auth.token).toBe('test-token')
    expect(localStorage.getItem('token')).toBe('test-token')
  })

  it('should set user info correctly', () => {
    const auth = useAuthStore()
    const userInfo = { id: 1, name: 'Admin', role: 'admin' }
    auth.setUserInfo(userInfo)
    expect(auth.userInfo).toEqual(userInfo)
  })

  it('should clear data on logout', () => {
    const auth = useAuthStore()
    auth.setToken('test-token')
    auth.setUserInfo({ id: 1, name: 'Admin' })
    auth.logout()
    expect(auth.token).toBe('')
    expect(auth.userInfo).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('should return correct login status', () => {
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
    auth.setToken('test-token')
    expect(auth.isLoggedIn).toBe(true)
  })
})
