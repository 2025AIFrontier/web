'use client'

import { useState, useEffect, useCallback } from 'react'
import { storage as storageManager } from './localStorage'

/**
 * localStorage를 React 상태와 동기화하는 커스텀 훅
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @param maxAge - 만료시간 (밀리초)
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  maxAge?: number
): [T, (value: T | ((val: T) => T)) => void, () => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // localStorage에서 값 로드
  useEffect(() => {
    try {
      const item = storageManager.getItem<T>(key)
      if (item !== null) {
        setStoredValue(item)
      }
    } catch (error) {
      console.error(`useLocalStorage 로드 실패 (key: ${key}):`, error)
    } finally {
      setIsLoaded(true)
    }
  }, [key])

  // 값 설정 함수
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        storageManager.setItem(key, valueToStore, maxAge)
      } catch (error) {
        console.error(`useLocalStorage 저장 실패 (key: ${key}):`, error)
      }
    },
    [key, storedValue, maxAge]
  )

  // 값 제거 함수
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      storageManager.removeItem(key)
    } catch (error) {
      console.error(`useLocalStorage 제거 실패 (key: ${key}):`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue, isLoaded]
}

/**
 * 사용자 기본 설정을 위한 전용 훅
 */
export function useUserPreferences<T>(key: string, initialValue: T) {
  return useLocalStorage(key, initialValue, 30 * 24 * 60 * 60 * 1000) // 30일
}

/**
 * 임시 데이터를 위한 전용 훅
 */
export function useTempData<T>(key: string, initialValue: T) {
  return useLocalStorage(key, initialValue, 24 * 60 * 60 * 1000) // 1일
}

/**
 * 영구 저장을 위한 전용 훅 (만료시간 없음)
 */
export function usePersistentData<T>(key: string, initialValue: T) {
  return useLocalStorage(key, initialValue) // 만료시간 없음
}

/**
 * 검색 기록 관리를 위한 훅
 */
export function useSearchHistory(maxItems = 10) {
  const [history, setHistory, clearHistory, isLoaded] = useLocalStorage<string[]>('search_history', [])

  const addSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return

    setHistory(prev => {
      const filtered = prev.filter(item => item !== searchTerm)
      const newHistory = [searchTerm, ...filtered].slice(0, maxItems)
      return newHistory
    })
  }, [setHistory, maxItems])

  const removeSearch = useCallback((searchTerm: string) => {
    setHistory(prev => prev.filter(item => item !== searchTerm))
  }, [setHistory])

  return {
    history,
    addSearch,
    removeSearch,
    clearHistory,
    isLoaded
  }
}

/**
 * 최근 본 항목들을 관리하는 훅
 */
export function useRecentItems<T extends { id: string | number }>(
  key: string,
  maxItems = 20
) {
  const [items, setItems, clearItems, isLoaded] = useLocalStorage<T[]>(key, [])

  const addItem = useCallback((item: T) => {
    setItems(prev => {
      const filtered = prev.filter(existingItem => existingItem.id !== item.id)
      return [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, maxItems)
    })
  }, [setItems, maxItems])

  const removeItem = useCallback((id: string | number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [setItems])

  return {
    items,
    addItem,
    removeItem,
    clearItems,
    isLoaded
  }
}

/**
 * 폼 데이터 자동 저장을 위한 훅
 */
export function useAutoSaveForm<T extends Record<string, any>>(
  key: string,
  initialFormData: T,
  autoSaveDelay = 1000
) {
  const [formData, setFormData, clearFormData, isLoaded] = useTempData(key, initialFormData)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }))

    // 기존 타이머 제거
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 새 타이머 설정
    const newTimeoutId = setTimeout(() => {
      // 자동 저장 완료 알림 (선택적)
      console.log(`폼 데이터 자동 저장됨 (key: ${key})`)
    }, autoSaveDelay)

    setTimeoutId(newTimeoutId)
  }, [setFormData, timeoutId, autoSaveDelay, key])

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return {
    formData,
    updateFormData,
    clearFormData,
    isLoaded
  }
}