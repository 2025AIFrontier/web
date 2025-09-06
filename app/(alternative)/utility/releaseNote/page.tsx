'use client'

import { useState } from 'react'
import Image from 'next/image'
import PaginationNumeric from '@/components/pagination-numeric'
import User01 from '@/public/images/user-32-01.jpg'
import User02 from '@/public/images/user-32-02.jpg'
import User07 from '@/public/images/user-32-07.jpg'

type FilterType = 'all' | 'update' | 'bugfix'

interface ReleaseNoteItem {
  id: number
  date: string
  title: string
  author: string
  authorImage: any
  type: 'update' | 'bugfix'
  content: string[]
  listItems?: string[]
}

export default function ReleaseNote() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 더미 데이터 추가하여 페이지네이션 테스트
  const releaseNoteData: ReleaseNoteItem[] = [
    {
      id: 1,
      date: '1 ,Oct. 2025',
      title: 'Released version 1.0',
      author: '관리자',
      authorImage: User07,
      type: 'update',
      content: [
        '기본 기능(TBD)으로 초기 출시',
        '기여자 : 2025 AI Frontier(박철용p, 김보라p, 김세회p, 정승혁p, 최호진p)'
      ]
    },
    {
      id: 2,
      date: '15 ,Sep. 2025',
      title: 'Beta version 0.9',
      author: '개발팀',
      authorImage: User01,
      type: 'update',
      content: [
        '베타 버전 출시',
        'UI/UX 개선 사항 적용'
      ]
    },
    {
      id: 3,
      date: '1 ,Sep. 2025',
      title: 'Bug fix 0.8.1',
      author: '유지보수팀',
      authorImage: User02,
      type: 'bugfix',
      content: [
        '로그인 오류 수정',
        '데이터 동기화 문제 해결'
      ]
    },
    {
      id: 4,
      date: '20 ,Aug. 2025',
      title: 'Released version 0.8',
      author: '관리자',
      authorImage: User07,
      type: 'update',
      content: [
        '새로운 기능 추가',
        '성능 최적화'
      ]
    },
    {
      id: 5,
      date: '10 ,Aug. 2025',
      title: 'Bug fix 0.7.2',
      author: '개발팀',
      authorImage: User01,
      type: 'bugfix',
      content: [
        '메모리 누수 문제 해결',
        '크래시 이슈 수정'
      ]
    },
    {
      id: 6,
      date: '1 ,Aug. 2025',
      title: 'Released version 0.7',
      author: '관리자',
      authorImage: User07,
      type: 'update',
      content: [
        '대시보드 기능 개선',
        '리포트 기능 추가'
      ]
    },
    {
      id: 7,
      date: '20 ,Jul. 2025',
      title: 'Bug fix 0.6.1',
      author: '유지보수팀',
      authorImage: User02,
      type: 'bugfix',
      content: [
        'API 호출 오류 수정',
        '타임아웃 문제 해결'
      ]
    },
    {
      id: 8,
      date: '10 ,Jul. 2025',
      title: 'Released version 0.6',
      author: '개발팀',
      authorImage: User01,
      type: 'update',
      content: [
        '새로운 테마 추가',
        '다크모드 지원'
      ]
    }
  ]

  const filteredData = releaseNoteData.filter(item => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'update') return item.type === 'update'
    if (activeFilter === 'bugfix') return item.type === 'bugfix'
    return true
  })

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredData.slice(startIndex, endIndex)

  // 필터 변경 시 첫 페이지로 이동
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const getTypeLabel = (type: 'update' | 'bugfix') => {
    switch (type) {
      case 'update':
        return '업데이트'
      case 'bugfix':
        return '버그 Fix'
      default:
        return type
    }
  }

  const getTypeStyles = (type: 'update' | 'bugfix') => {
    switch (type) {
      case 'update':
        return 'bg-green-500/20 text-green-700'
      case 'bugfix':
        return 'bg-red-500/20 text-red-700'
      default:
        return 'bg-gray-500/20 text-gray-700'
    }
  }

  return (
    <div className="relative bg-white dark:bg-gray-900 h-full">

      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center px-4 sm:px-6 py-8 border-b border-gray-200 dark:border-gray-700/60">

        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Release Note</h1>
        </div>


      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="max-w-3xl m-auto">

          {/* Filters */}
          <div className="xl:pl-32 xl:-translate-x-16 mb-2">
            <ul className="flex flex-wrap -m-1">
              <li className="m-1">
                <button 
                  onClick={() => handleFilterChange('all')}
                  className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border shadow-sm transition ${
                    activeFilter === 'all'
                      ? 'border-transparent bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                      : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  전체
                </button>
              </li>
              <li className="m-1">
                <button 
                  onClick={() => handleFilterChange('update')}
                  className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border shadow-sm transition ${
                    activeFilter === 'update'
                      ? 'border-transparent bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                      : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  업데이트
                </button>
              </li>
              <li className="m-1">
                <button 
                  onClick={() => handleFilterChange('bugfix')}
                  className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border shadow-sm transition ${
                    activeFilter === 'bugfix'
                      ? 'border-transparent bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                      : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  버그 Fix
                </button>
              </li>
            </ul>
          </div>

          {/* Posts */}
          <div className="xl:-translate-x-16">
            {currentItems.length === 0 ? (
              <div className="pt-6 pb-6 text-center text-gray-500 dark:text-gray-400">
                <p>선택한 필터에 해당하는 항목이 없습니다.</p>
              </div>
            ) : (
              currentItems.map((item) => (
                <article key={item.id} className="pt-6">
                  <div className="xl:flex">
                    <div className="w-32 shrink-0">
                      <div className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 xl:leading-8">{item.date}</div>
                    </div>
                    <div className="grow pb-6 border-b border-gray-200 dark:border-gray-700/60">
                      <header>
                        <h2 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-3">{item.title}</h2>
                        <div className="flex flex-nowrap items-center space-x-2 mb-4">
                          <div className="flex items-center">
                            <a className="block mr-2 shrink-0" href="#0">
                              <Image className="rounded-full border-2 border-white dark:border-gray-800 box-content" src={item.authorImage} width={32} height={32} alt={item.author} />
                            </a>
                            <a className="block text-sm font-semibold text-gray-800 dark:text-gray-100" href="#0">
                              {item.author}
                            </a>
                          </div>
                          <div className="text-gray-400 dark:text-gray-600">·</div>
                          <div>
                            <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${getTypeStyles(item.type)}`}>
                              {getTypeLabel(item.type)}
                            </div>
                          </div>
                        </div>
                      </header>
                      <div className="space-y-3">
                        {item.content.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                        {item.listItems && (
                          <ul className="list-disc list-inside space-y-1">
                            {item.listItems.map((listItem, index) => (
                              <li key={index}>{listItem}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredData.length > itemsPerPage && (
            <div className="xl:pl-32 xl:-translate-x-16 mt-6">
              <div className="flex flex-col items-center gap-4">
                <PaginationNumeric 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showPrevNext={false}
                />
                <div className="text-sm text-gray-500">
                  총 {totalPages} 페이지
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}