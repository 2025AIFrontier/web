/**
 * localStorage 관리를 위한 공통 유틸리티 함수들
 * 타입 안전성과 에러 핸들링을 제공합니다
 */

export interface LocalStorageConfig {
  prefix?: string
  enableCompression?: boolean
  enableEncryption?: boolean
  maxAge?: number // 밀리초 단위, 만료 시간
}

interface StorageItem<T> {
  data: T
  timestamp: number
  maxAge?: number
}

class LocalStorageManager {
  private prefix: string
  private config: LocalStorageConfig

  constructor(config: LocalStorageConfig = {}) {
    this.prefix = config.prefix || 'app_'
    this.config = config
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /**
   * 데이터를 localStorage에 저장
   */
  setItem<T>(key: string, value: T, maxAge?: number): boolean {
    try {
      const storageItem: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        maxAge: maxAge || this.config.maxAge
      }

      const serializedValue = JSON.stringify(storageItem)
      window.localStorage.setItem(this.getKey(key), serializedValue)
      return true
    } catch (error) {
      console.error(`localStorage setItem 실패 (key: ${key}):`, error)
      return false
    }
  }

  /**
   * localStorage에서 데이터를 가져옴
   */
  getItem<T>(key: string): T | null {
    try {
      const storedValue = window.localStorage.getItem(this.getKey(key))
      if (!storedValue) return null

      const storageItem: StorageItem<T> = JSON.parse(storedValue)
      
      // 만료 시간 체크
      if (storageItem.maxAge) {
        const isExpired = Date.now() - storageItem.timestamp > storageItem.maxAge
        if (isExpired) {
          this.removeItem(key)
          return null
        }
      }

      return storageItem.data
    } catch (error) {
      console.error(`localStorage getItem 실패 (key: ${key}):`, error)
      return null
    }
  }

  /**
   * 특정 키의 데이터 삭제
   */
  removeItem(key: string): boolean {
    try {
      window.localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error(`localStorage removeItem 실패 (key: ${key}):`, error)
      return false
    }
  }

  /**
   * prefix가 일치하는 모든 데이터 삭제
   */
  clear(): boolean {
    try {
      const keys = Object.keys(window.localStorage)
      const prefixKeys = keys.filter(key => key.startsWith(this.prefix))
      
      prefixKeys.forEach(key => {
        window.localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('localStorage clear 실패:', error)
      return false
    }
  }

  /**
   * 특정 키가 존재하는지 확인
   */
  hasItem(key: string): boolean {
    return window.localStorage.getItem(this.getKey(key)) !== null
  }

  /**
   * prefix가 일치하는 모든 키 목록 반환
   */
  getAllKeys(): string[] {
    try {
      const keys = Object.keys(window.localStorage)
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''))
    } catch (error) {
      console.error('localStorage getAllKeys 실패:', error)
      return []
    }
  }

  /**
   * localStorage 사용 가능 여부 확인
   */
  isAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__'
      window.localStorage.setItem(testKey, 'test')
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * 현재 저장된 데이터의 크기 (대략적) 반환
   */
  getStorageSize(): number {
    try {
      let total = 0
      const keys = Object.keys(window.localStorage)
      const prefixKeys = keys.filter(key => key.startsWith(this.prefix))
      
      prefixKeys.forEach(key => {
        const value = window.localStorage.getItem(key) || ''
        total += key.length + value.length
      })
      
      return total
    } catch (error) {
      console.error('localStorage getStorageSize 실패:', error)
      return 0
    }
  }

  /**
   * 만료된 아이템들 정리
   */
  cleanup(): number {
    try {
      let cleanedCount = 0
      const keys = Object.keys(window.localStorage)
      const prefixKeys = keys.filter(key => key.startsWith(this.prefix))
      
      prefixKeys.forEach(key => {
        const storedValue = window.localStorage.getItem(key)
        if (storedValue) {
          try {
            const storageItem: StorageItem<any> = JSON.parse(storedValue)
            if (storageItem.maxAge) {
              const isExpired = Date.now() - storageItem.timestamp > storageItem.maxAge
              if (isExpired) {
                window.localStorage.removeItem(key)
                cleanedCount++
              }
            }
          } catch {
            // 파싱 실패한 잘못된 데이터도 삭제
            window.localStorage.removeItem(key)
            cleanedCount++
          }
        }
      })
      
      return cleanedCount
    } catch (error) {
      console.error('localStorage cleanup 실패:', error)
      return 0
    }
  }
}

// 기본 인스턴스 생성
export const storage = new LocalStorageManager({
  prefix: 'mosaic_',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7일 기본 만료시간
})

// 특정 용도별 인스턴스들
export const userPreferences = new LocalStorageManager({
  prefix: 'user_prefs_',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30일
})

export const favorites = new LocalStorageManager({
  prefix: 'favorites_',
  // 만료시간 없음 (영구 저장)
})

export const tempData = new LocalStorageManager({
  prefix: 'temp_',
  maxAge: 24 * 60 * 60 * 1000 // 1일
})

// 유틸리티 함수들
export const storageUtils = {
  /**
   * 모든 저장소 정리
   */
  cleanupAll(): void {
    storage.cleanup()
    userPreferences.cleanup()
    favorites.cleanup()
    tempData.cleanup()
  },

  /**
   * 전체 저장소 상태 정보
   */
  getStorageInfo(): {
    storage: { size: number; keys: string[] }
    userPreferences: { size: number; keys: string[] }
    favorites: { size: number; keys: string[] }
    tempData: { size: number; keys: string[] }
    isAvailable: boolean
  } {
    return {
      storage: {
        size: storage.getStorageSize(),
        keys: storage.getAllKeys()
      },
      userPreferences: {
        size: userPreferences.getStorageSize(),
        keys: userPreferences.getAllKeys()
      },
      favorites: {
        size: favorites.getStorageSize(),
        keys: favorites.getAllKeys()
      },
      tempData: {
        size: tempData.getStorageSize(),
        keys: tempData.getAllKeys()
      },
      isAvailable: storage.isAvailable()
    }
  }
}

export default LocalStorageManager