'use client'

import { useState, useEffect, useCallback } from 'react'
import { favorites } from '@/lib/localStorage'

const EMPLOYEE_FAVORITES_KEY = 'employees'

export interface FavoriteEmployee {
  id: number
  name: string
  department: string
  addedAt: number
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())
  const [favoriteEmployees, setFavoriteEmployees] = useState<FavoriteEmployee[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // localStorage에서 즐겨찾기 데이터 로드
  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === 'undefined') {
      return
    }

    const loadFavorites = () => {
      try {
        const storedFavorites = favorites.getItem<FavoriteEmployee[]>(EMPLOYEE_FAVORITES_KEY) || []
        const ids = new Set(storedFavorites.map(emp => emp.id))
        
        setFavoriteEmployees(storedFavorites)
        setFavoriteIds(ids)
      } catch (error) {
        console.error('즐겨찾기 데이터 로드 실패:', error)
        setFavoriteEmployees([])
        setFavoriteIds(new Set())
      } finally {
        setIsLoaded(true)
      }
    }

    // 약간의 지연을 두어 hydration 완료 후 실행
    const timeoutId = setTimeout(loadFavorites, 0)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // 즐겨찾기 상태가 변경될 때마다 localStorage에 저장
  const saveFavorites = useCallback((updatedFavorites: FavoriteEmployee[]) => {
    // 클라이언트에서만 실행
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      favorites.setItem(EMPLOYEE_FAVORITES_KEY, updatedFavorites)
    } catch (error) {
      console.error('즐겨찾기 데이터 저장 실패:', error)
    }
  }, [])

  // 즐겨찾기 추가/제거 토글
  const toggleFavorite = useCallback((employee: { id: number; name: string; department: string }) => {
    setFavoriteEmployees(prev => {
      const isCurrentlyFavorite = favoriteIds.has(employee.id)
      let updated: FavoriteEmployee[]

      if (isCurrentlyFavorite) {
        // 즐겨찾기에서 제거
        updated = prev.filter(fav => fav.id !== employee.id)
      } else {
        // 즐겨찾기에 추가
        const newFavorite: FavoriteEmployee = {
          id: employee.id,
          name: employee.name,
          department: employee.department,
          addedAt: Date.now()
        }
        updated = [...prev, newFavorite]
      }

      // 추가된 시간 순으로 정렬 (최신이 먼저)
      updated.sort((a, b) => b.addedAt - a.addedAt)
      
      saveFavorites(updated)
      return updated
    })

    setFavoriteIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(employee.id)) {
        newSet.delete(employee.id)
      } else {
        newSet.add(employee.id)
      }
      return newSet
    })
  }, [favoriteIds, saveFavorites])

  // 특정 직원이 즐겨찾기인지 확인
  const isFavorite = useCallback((employeeId: number) => {
    return favoriteIds.has(employeeId)
  }, [favoriteIds])

  // 즐겨찾기 개수
  const getFavoriteCount = useCallback(() => {
    return favoriteIds.size
  }, [favoriteIds])

  // 모든 즐겨찾기 제거
  const clearAllFavorites = useCallback(() => {
    setFavoriteEmployees([])
    setFavoriteIds(new Set())
    saveFavorites([])
  }, [saveFavorites])

  // 특정 즐겨찾기 제거
  const removeFavorite = useCallback((employeeId: number) => {
    setFavoriteEmployees(prev => {
      const updated = prev.filter(fav => fav.id !== employeeId)
      saveFavorites(updated)
      return updated
    })

    setFavoriteIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(employeeId)
      return newSet
    })
  }, [saveFavorites])

  // 즐겨찾기 목록을 이름순으로 정렬
  const getFavoritesSortedByName = useCallback(() => {
    return [...favoriteEmployees].sort((a, b) => a.name.localeCompare(b.name))
  }, [favoriteEmployees])

  // 즐겨찾기 목록을 부서순으로 정렬
  const getFavoritesSortedByDepartment = useCallback(() => {
    return [...favoriteEmployees].sort((a, b) => a.department.localeCompare(b.department))
  }, [favoriteEmployees])

  return {
    // 상태
    favoriteEmployees,
    favoriteIds,
    isLoaded,
    
    // 액션
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
    
    // 조회 함수
    isFavorite,
    getFavoriteCount,
    getFavoritesSortedByName,
    getFavoritesSortedByDepartment
  }
}