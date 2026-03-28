/**
 * 验证工具类
 * 提供统一的表单验证方法
 */

import { VALIDATION_RULES } from '@/constants'

/**
 * 验证邮箱
 */
export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.PATTERN.test(email)
}

/**
 * 验证用户名
 */
export const validateUsername = (username: string): boolean => {
  const { MIN_LENGTH, MAX_LENGTH, PATTERN } = VALIDATION_RULES.USERNAME
  return (
    username.length >= MIN_LENGTH &&
    username.length <= MAX_LENGTH &&
    PATTERN.test(username)
  )
}

/**
 * 验证密码
 */
export const validatePassword = (password: string): boolean => {
  const { MIN_LENGTH, MAX_LENGTH } = VALIDATION_RULES.PASSWORD
  return password.length >= MIN_LENGTH && password.length <= MAX_LENGTH
}

/**
 * 验证必填字段
 */
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * 验证手机号（中国）
 */
export const validatePhone = (phone: string): boolean => {
  const pattern = /^1[3-9]\d{9}$/
  return pattern.test(phone)
}

/**
 * 验证URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证数字范围
 */
export const validateRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max
}

/**
 * 验证文件类型
 */
export const validateFileType = (
  fileName: string,
  allowedTypes: string[]
): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension ? allowedTypes.includes(extension) : false
}

/**
 * 验证文件大小
 */
export const validateFileSize = (
  fileSize: number,
  maxSize: number
): boolean => {
  return fileSize <= maxSize
}

/**
 * 表单验证器类
 */
export class FormValidator {
  private errors: Record<string, string> = {}
  private rules: Record<string, Array<(value: any) => string | null>> = {}

  /**
   * 添加验证规则
   */
  addRule(field: string, rule: (value: any) => string | null): void {
    if (!this.rules[field]) {
      this.rules[field] = []
    }
    this.rules[field].push(rule)
  }

  /**
   * 验证单个字段
   */
  validateField(field: string, value: any): string | null {
    const fieldRules = this.rules[field] || []
    
    for (const rule of fieldRules) {
      const error = rule(value)
      if (error) {
        this.errors[field] = error
        return error
      }
    }
    
    delete this.errors[field]
    return null
  }

  /**
   * 验证整个表单
   */
  validateForm(data: Record<string, any>): boolean {
    let isValid = true
    
    for (const field in this.rules) {
      const error = this.validateField(field, data[field])
      if (error) {
        isValid = false
      }
    }
    
    return isValid
  }

  /**
   * 获取错误
   */
  getErrors(): Record<string, string> {
    return { ...this.errors }
  }

  /**
   * 获取单个字段错误
   */
  getFieldError(field: string): string | null {
    return this.errors[field] || null
  }

  /**
   * 清除错误
   */
  clearErrors(): void {
    this.errors = {}
  }

  /**
   * 清除单个字段错误
   */
  clearFieldError(field: string): void {
    delete this.errors[field]
  }
}

// 预设验证规则
export const validators = {
  email: (value: string) => {
    if (!validateRequired(value)) return '邮箱不能为空'
    if (!validateEmail(value)) return '邮箱格式不正确'
    return null
  },
  
  username: (value: string) => {
    if (!validateRequired(value)) return '用户名不能为空'
    if (!validateUsername(value)) {
      const { MIN_LENGTH, MAX_LENGTH } = VALIDATION_RULES.USERNAME
      return `用户名长度需在 ${MIN_LENGTH}-${MAX_LENGTH} 位之间`
    }
    return null
  },
  
  password: (value: string) => {
    if (!validateRequired(value)) return '密码不能为空'
    if (!validatePassword(value)) {
      const { MIN_LENGTH, MAX_LENGTH } = VALIDATION_RULES.PASSWORD
      return `密码长度需在 ${MIN_LENGTH}-${MAX_LENGTH} 位之间`
    }
    return null
  },
  
  required: (message?: string) => (value: any) => {
    if (!validateRequired(value)) {
      return message || '该字段不能为空'
    }
    return null
  },
  
  phone: (value: string) => {
    if (!validateRequired(value)) return '手机号不能为空'
    if (!validatePhone(value)) return '手机号格式不正确'
    return null
  },
  
  url: (value: string) => {
    if (!validateRequired(value)) return 'URL不能为空'
    if (!validateUrl(value)) return 'URL格式不正确'
    return null
  },
}
