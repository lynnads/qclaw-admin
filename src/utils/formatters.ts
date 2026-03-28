/**
 * 格式化工具类
 * 提供统一的数据格式化方法
 */

/**
 * 格式化文件大小
 * @param bytes 字节数
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式字符串
 */
export const formatDate = (
  date: Date | string | number,
  format: string = 'yyyy-MM-dd HH:mm:ss'
): string => {
  const d = new Date(date)
  
  const pad = (n: number) => n.toString().padStart(2, '0')
  
  const replacements: Record<string, string> = {
    yyyy: d.getFullYear().toString(),
    MM: pad(d.getMonth() + 1),
    dd: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  }
  
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (match) => replacements[match])
}

/**
 * 格式化相对时间
 * @param date 日期对象或字符串
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  if (seconds > 0) return `${seconds}秒前`
  return '刚刚'
}

/**
 * 格式化数字（千分位）
 * @param num 数字
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化百分比
 * @param num 数字
 * @param decimals 小数位数
 */
export const formatPercent = (num: number, decimals: number = 2): string => {
  return `${num.toFixed(decimals)}%`
}

/**
 * 格式化持续时间
 * @param milliseconds 毫秒数
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`
  }
  if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`
  }
  return `${seconds}秒`
}

/**
 * 截断文本
 * @param text 文本
 * @param maxLength 最大长度
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 首字母大写
 * @param text 文本
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 深度克隆对象
 * @param obj 对象
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 防抖函数
 * @param fn 函数
 * @param delay 延迟时间
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 * @param fn 函数
 * @param limit 间隔时间
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 300
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
