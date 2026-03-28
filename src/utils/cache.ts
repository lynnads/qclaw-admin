/**
 * 缓存工具类
 * 提供统一的缓存管理
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private prefix = 'qclaw_'
  private memoryCache = new Map<string, CacheItem<any>>()

  /**
   * 生成缓存键
   */
  private generateKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /**
   * 获取缓存
   * @param key 缓存键
   */
  get<T>(key: string): T | null {
    // 先检查内存缓存
    const memoryItem = this.memoryCache.get(key)
    if (memoryItem && Date.now() - memoryItem.timestamp < memoryItem.ttl) {
      return memoryItem.data
    }

    // 检查本地存储
    try {
      const item = localStorage.getItem(this.generateKey(key))
      if (!item) return null

      const parsed: CacheItem<T> = JSON.parse(item)
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        this.remove(key)
        return null
      }

      // 同步到内存缓存
      this.memoryCache.set(key, parsed)
      return parsed.data
    } catch {
      return null
    }
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 缓存数据
   * @param ttl 过期时间（毫秒）
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    }

    // 设置内存缓存
    this.memoryCache.set(key, item)

    // 设置本地存储
    try {
      localStorage.setItem(this.generateKey(key), JSON.stringify(item))
    } catch (e) {
      console.warn('Cache set failed:', e)
    }
  }

  /**
   * 移除缓存
   * @param key 缓存键
   */
  remove(key: string): void {
    this.memoryCache.delete(key)
    try {
      localStorage.removeItem(this.generateKey(key))
    } catch (e) {
      console.warn('Cache remove failed:', e)
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.memoryCache.clear()
    
    // 清空本地存储中的缓存
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (e) {
      console.warn('Cache clear failed:', e)
    }
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * 获取缓存键列表
   */
  keys(): string[] {
    const keys: string[] = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''))
        }
      }
    } catch (e) {
      console.warn('Cache keys failed:', e)
    }
    return keys
  }
}

// 单例实例
export const cache = new CacheManager()

// 预设 TTL 常量
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,      // 5分钟
  MEDIUM: 30 * 60 * 1000,    // 30分钟
  LONG: 60 * 60 * 1000,      // 1小时
  DAY: 24 * 60 * 60 * 1000,  // 1天
} as const

export default cache
