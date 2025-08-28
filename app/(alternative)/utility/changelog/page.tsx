'use client'

import { useState } from 'react'
import Image from 'next/image'
import PaginationClassic from '@/components/pagination-classic'
import User01 from '@/public/images/user-32-01.jpg'
import User02 from '@/public/images/user-32-02.jpg'
import User07 from '@/public/images/user-32-07.jpg'

export default function ReleaseNotes() {
  const [activeFilter, setActiveFilter] = useState('all')
  
  const filters = [
    { id: 'all', label: 'View All' },
    { id: 'announcement', label: '공지' },
    { id: 'bugfix', label: '버그' }
  ]

  const posts = [
    {
      id: 1,
      date: '15 October, 2025',
      title: 'Released version 1.0 🎉',
      category: 'announcement',
      categoryLabel: '공지',
      categoryColor: 'bg-green-500/20 text-green-700',
      author: 'AI Frontier Team',
      authorImage: User07,
      content: [
        '드디어 AI Frontier 플랫폼 버전 1.0이 정식 출시되었습니다! 이번 출시는 저희 팀이 지난 몇 달간 정성스럽게 개발해온 결과물입니다.',
        'AI Frontier는 기업용 종합 관리 플랫폼으로, 직원 관리, 환율 정보, 예약 시스템, 그리고 강력한 관리 도구를 하나의 통합 환경에서 제공합니다.'
      ],
      list: [
        '직원 관리 시스템: 조직도 시각화 및 연락처 관리',
        '실시간 환율 정보: 주요 통화 환율 조회 및 계산기',
        '스마트 예약 시스템: 회의실 및 차량 예약 관리',
        '통합 관리 대시보드: PM2 프로세스 관리 및 시스템 모니터링',
        '반응형 디자인: 데스크탑과 모바일 모든 환경 지원',
        '다크모드: 사용자 선호에 맞는 테마 지원'
      ]
    }
  ]

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeFilter)

  return (
    <div className="relative bg-white dark:bg-gray-900 h-full">

      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center px-4 sm:px-6 py-8 border-b border-gray-200 dark:border-gray-700/60">

        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Release Notes</h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

          {/* Add entry button */}
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">Add Entry</button>

        </div>

      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="max-w-3xl m-auto">

          {/* Filters */}
          <div className="xl:pl-32 xl:-translate-x-16 mb-2">
            <ul className="flex flex-wrap -m-1">
              {filters.map((filter) => (
                <li key={filter.id} className="m-1">
                  <button 
                    onClick={() => setActiveFilter(filter.id)}
                    className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border transition ${
                      activeFilter === filter.id
                        ? 'border-transparent shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                        : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {filter.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Posts */}
          <div className="xl:-translate-x-16">
            {filteredPosts.map((post) => (
              <article key={post.id} className="pt-6">
                <div className="xl:flex">
                  <div className="w-32 shrink-0">
                    <div className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 xl:leading-8">{post.date}</div>
                  </div>
                  <div className="grow pb-6 border-b border-gray-200 dark:border-gray-700/60">
                    <header>
                      <h2 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-3">{post.title}</h2>
                      <div className="flex flex-nowrap items-center space-x-2 mb-4">
                        <div className="flex items-center">
                          <a className="block mr-2 shrink-0" href="#0">
                            <Image className="rounded-full border-2 border-white dark:border-gray-800 box-content" src={post.authorImage} width={32} height={32} alt={post.author} />
                          </a>
                          <a className="block text-sm font-semibold text-gray-800 dark:text-gray-100" href="#0">
                            {post.author}
                          </a>
                        </div>
                        <div className="text-gray-400 dark:text-gray-600">·</div>
                        <div>
                          <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${post.categoryColor}`}>
                            {post.categoryLabel}
                          </div>
                        </div>
                      </div>
                    </header>
                    <div className="space-y-3">
                      {post.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                      {post.list && (
                        <ul className="list-disc list-inside space-y-1">
                          {post.list.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="xl:pl-32 xl:-translate-x-16 mt-6">
            <PaginationClassic />
          </div>

        </div>
      </div>
    </div>
  )
}