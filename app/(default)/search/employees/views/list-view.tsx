'use client'

import { useState, useMemo, useEffect } from 'react'
import ContactCard from './contact-card'
import PaginationNumeric from '@/components/pagination-numeric'

interface Job {
  id: number
  image: any
  name: string
  position: string
  department: string
  company: string
  link: string
  contact: string
  email: string
  products: string
  type: string
  fav: boolean
}

interface ContactListViewProps {
  jobs: Job[]
  positionFilters: {
    executive: boolean
    manager: boolean
    staff: boolean
  }
  favoriteFilterEnabled: boolean
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
  getFavoriteCount: () => number
  isLoaded: boolean
}

export default function ContactListView({
  jobs,
  positionFilters,
  favoriteFilterEnabled,
  isFavorite,
  toggleFavorite,
  getFavoriteCount,
  isLoaded
}: ContactListViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isClientMounted, setIsClientMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  useEffect(() => {
    setIsClientMounted(true)
  }, [])

  // 필터링 로직
  const filteredJobsWithSearch = useMemo(() => {
    let filtered = jobs || []

    // 1. 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(job => {
        const search = searchTerm.toLowerCase()
        return (
          job.name?.toLowerCase().includes(search) ||
          job.department?.toLowerCase().includes(search) ||
          job.company?.toLowerCase().includes(search) ||
          job.products?.toLowerCase().includes(search) ||
          job.email?.toLowerCase().includes(search)
        )
      })
    }

    // 2. 직급 필터링
    const hasPositionFilter = Object.values(positionFilters).some(value => value)
    if (hasPositionFilter) {
      filtered = filtered.filter(job => {
        if (positionFilters.executive && (job.position === '그룹장' || job.position === '팀장')) return true
        if (positionFilters.manager && (job.position === '파트장' || job.position === '셀장')) return true
        if (positionFilters.staff && (job.position === '' || job.position === '담당자')) return true
        return false
      })
    } else {
      filtered = []
    }

    // 3. 즐겨찾기 필터링
    if (favoriteFilterEnabled && isClientMounted && isLoaded) {
      filtered = filtered.filter(job => isFavorite(job.id))
    }

    return filtered
  }, [jobs, searchTerm, positionFilters, favoriteFilterEnabled, isClientMounted, isLoaded, isFavorite])

  // Pagination
  const totalPages = Math.ceil(filteredJobsWithSearch.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentJobs = useMemo(() => filteredJobsWithSearch.slice(startIndex, endIndex), [filteredJobsWithSearch, startIndex, endIndex])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, positionFilters, favoriteFilterEnabled])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="w-full">
      {/* Search form */}
      <div className="mb-5">
        <form className="relative" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search" className="sr-only">Search</label>
          <input 
            id="search" 
            className="form-input w-full pl-9 bg-white dark:bg-gray-800" 
            type="search" 
            placeholder={`이름, 부서, 회사, 제품명으로 검색해보세요 (현재 ${filteredJobsWithSearch.length}명/${jobs.length}명)`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
            <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-3 mr-2" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
              <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
            </svg>
          </button>
          {searchTerm && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setSearchTerm('')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* 즐겨찾기 정보 표시 */}
      {isClientMounted && isLoaded && getFavoriteCount() > 0 && !favoriteFilterEnabled && (
        <div className="mb-4">
          <div className="text-sm text-yellow-600 dark:text-yellow-500 italic">
            즐겨찾기 {getFavoriteCount()}명
          </div>
        </div>
      )}

      {/* Jobs list */}
      <div className='space-y-2'>
        {currentJobs.map(job => (
          <ContactCard
            key={job.id}
            job={job}
            isFavorite={isClientMounted && isLoaded ? isFavorite(job.id) : false}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationNumeric 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}