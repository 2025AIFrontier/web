'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { searchPages, type NavigationPage } from '@/lib/navigation-pages'

interface SearchModalProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export default function SearchModal({
  isOpen,
  setIsOpen
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<NavigationPage[]>([])
  const [recentSearches, setRecentSearches] = useState<NavigationPage[]>([])
  
  // 검색어 변경 시 결과 업데이트
  useEffect(() => {
    const results = searchPages(searchQuery)
    setSearchResults(results.slice(0, 10)) // 최대 10개 결과만 표시
  }, [searchQuery])
  
  // 모달이 닫힐 때 검색어 초기화
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSearchResults([])
    }
  }, [isOpen])
  
  // 최근 검색 항목 로드 (로컬 스토리지에서)
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setRecentSearches(parsed.slice(0, 5)) // 최대 5개만
      } catch (e) {
        // 파싱 오류 무시
      }
    }
  }, [isOpen])
  
  // 페이지 클릭 시 최근 검색에 추가
  const handlePageClick = (page: NavigationPage) => {
    const newRecent = [page, ...recentSearches.filter(p => p.href !== page.href)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    setIsOpen(false)
  }
  
  // 검색 결과를 카테고리별로 그룹화
  const groupedResults = searchResults.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = []
    }
    acc[page.category].push(page)
    return acc
  }, {} as Record<string, NavigationPage[]>)

  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as="div"
          className="fixed inset-0 bg-gray-900/30 z-50 transition-opacity"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          aria-hidden="true"
        />
        <TransitionChild
          as="div"
          className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
          enter="transition ease-in-out duration-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in-out duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <DialogPanel className="bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 overflow-auto max-w-2xl w-full max-h-full rounded-lg shadow-lg">
            {/* Search form */}
            <form className="border-b border-gray-200 dark:border-gray-700/60" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <label htmlFor="search-modal" className="sr-only">Search</label>
                <input 
                  id="search-modal" 
                  className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 border-0 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 pl-10 pr-4" 
                  type="search" 
                  placeholder="Search pages, features, settings..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <div className="absolute inset-0 flex items-center justify-center right-auto group pointer-events-none">
                  <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 ml-4 mr-2" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                    <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                  </svg>
                </div>
              </div>
            </form>
            <div className="py-4 px-2">
              {/* 검색 결과 표시 */}
              {searchQuery && searchResults.length > 0 && (
                <div className="mb-3 last:mb-0">
                  <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">
                    Search Results ({searchResults.length})
                  </div>
                  {Object.entries(groupedResults).map(([category, pages]) => (
                    <div key={category} className="mb-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-2 mb-1">{category}</div>
                      <ul className="text-sm">
                        {pages.map(page => (
                          <li key={page.href}>
                            <Link
                              className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                              href={page.href}
                              onClick={() => handlePageClick(page)}
                            >
                              <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                                <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
                              </svg>
                              <span className="font-medium">{page.title}</span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">{page.href}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 검색 결과가 없을 때 */}
              {searchQuery && searchResults.length === 0 && (
                <div className="mb-3 last:mb-0">
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="inline-block w-12 h-12 mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try different keywords or check spelling</p>
                  </div>
                </div>
              )}
              
              {/* 최근 검색 기록 (검색어가 없을 때만 표시) */}
              {!searchQuery && recentSearches.length > 0 && (
                <div className="mb-3 last:mb-0">
                  <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">Recent Pages</div>
                  <ul className="text-sm">
                    {recentSearches.map(page => (
                      <li key={page.href}>
                        <Link
                          className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                          href={page.href}
                          onClick={() => handlePageClick(page)}
                        >
                          <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                          </svg>
                          <span>
                            <span className="font-medium">{page.title}</span> - 
                            <span className="text-gray-600 dark:text-gray-400 ml-1">{page.category}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* 검색어가 없고 최근 검색도 없을 때 - 빠른 링크 표시 */}
              {!searchQuery && recentSearches.length === 0 && (
                <div className="mb-3 last:mb-0">
                  <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">Quick Links</div>
                  <ul className="text-sm">
                    <li>
                      <Link
                        className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                      >
                        <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                          <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                          <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                        </svg>
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                        href="/dashboard/exchange"
                        onClick={() => setIsOpen(false)}
                      >
                        <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                          <path d="M7.95 6h4.05a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 12 1H4a1.5 1.5 0 0 0-1.5 1.5v2A1.5 1.5 0 0 0 4 6h4.05v4H4a1.5 1.5 0 0 0-1.5 1.5v2A1.5 1.5 0 0 0 4 15h8a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 12 10H7.95V6Z" />
                        </svg>
                        <span>Exchange Rates</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                        href="/settings/account"
                        onClick={() => setIsOpen(false)}
                      >
                        <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                          <path d="M10.5 1a3.502 3.502 0 0 1 3.355 2.5H15a1 1 0 1 1 0 2h-1.145a3.502 3.502 0 0 1-6.71 0H1a1 1 0 0 1 0-2h6.145A3.502 3.502 0 0 1 10.5 1ZM9 4.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM5.5 9a3.502 3.502 0 0 1 3.355 2.5H15a1 1 0 1 1 0 2H8.855a3.502 3.502 0 0 1-6.71 0H1a1 1 0 1 1 0-2h1.145A3.502 3.502 0 0 1 5.5 9ZM4 12.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
                        </svg>
                        <span>Settings</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  )
}
