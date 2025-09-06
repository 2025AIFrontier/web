'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ShopSidebar from './shop-sidebar'
import ShopCards07 from './shop-cards-07'
import PaginationClassic from '@/components/pagination-classic'

export default function Partners() {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'partners' | 'contacts'>('partners')
  
  useEffect(() => {
    if (tabFromUrl === 'contacts') {
      setActiveTab('contacts')
    }
  }, [tabFromUrl])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="mb-5">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">협력사 조회</h1>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <ul className="flex flex-wrap -m-1">
          <li className="m-1">
            <button
              className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${
                activeTab === 'partners'
                  ? 'border-transparent shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                  : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              } transition`}
              onClick={() => setActiveTab('partners')}
            >
              협력사 목록
            </button>
          </li>
          <li className="m-1">
            <button
              className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${
                activeTab === 'contacts'
                  ? 'border-transparent shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                  : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              } transition`}
              onClick={() => setActiveTab('contacts')}
            >
              협력사 담당자 조회
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      {activeTab === 'partners' ? (
        /* Partners List Tab */
        <div className="flex flex-col space-y-10 sm:flex-row sm:space-x-6 sm:space-y-0 md:flex-col md:space-x-0 md:space-y-10 xl:flex-row xl:space-x-6 xl:space-y-0">
          {/* Sidebar */}
          <ShopSidebar />

          {/* Content */}
          <div className="flex-1">
            {/* Filters */}
            <div className="mb-5">
              <ul className="flex flex-wrap -m-1">
                <li className="m-1">
                  <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800 transition">
                    전체 보기
                  </button>
                </li>
                <li className="m-1">
                  <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                    우수 협력사
                  </button>
                </li>
                <li className="m-1">
                  <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                    최신 등록
                  </button>
                </li>
                <li className="m-1">
                  <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                    거래금액 - 낮은순
                  </button>
                </li>
                <li className="m-1">
                  <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
                    거래금액 - 높은순
                  </button>
                </li>
              </ul>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">총 67개 협력사</div>

            {/* Cards */}
            <div>
              <div className="grid grid-cols-12 gap-6">
                <ShopCards07 />
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <PaginationClassic />
            </div>
          </div>
        </div>
      ) : (
        /* Partner Contacts Tab */
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              협력사 담당자 조회
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              협력사를 먼저 선택하면 해당 협력사의 담당자 목록을 조회할 수 있습니다.
            </p>
            <div className="inline-flex items-center text-sm font-medium text-violet-500">
              <svg className="w-3 h-3 fill-current mr-2" viewBox="0 0 12 12">
                <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" />
              </svg>
              <span>협력사 목록 탭에서 협력사를 선택하세요</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}