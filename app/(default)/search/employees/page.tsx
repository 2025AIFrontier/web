'use client'

import { useState, useEffect } from 'react'
import { useFavorites } from './hooks/useFavorites'
import ListView from './views/list-view'
import GraphView from './views/graph-view'
import Image01 from '@/public/images/company-icon-05.svg'
import Image02 from '@/public/images/company-icon-06.svg'
import Image03 from '@/public/images/company-icon-03.svg'
import Image04 from '@/public/images/company-icon-07.svg'
import Image05 from '@/public/images/company-icon-08.svg'
import Image06 from '@/public/images/company-icon-01.svg'
import Image07 from '@/public/images/company-icon-02.svg'

export default function Jobs() {
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list')
  const [favoriteFilterEnabled, setFavoriteFilterEnabled] = useState(false)
  const [positionFilters, setPositionFilters] = useState({
    executive: true,
    manager: true,
    staff: false
  })
  const [isClientMounted, setIsClientMounted] = useState<boolean>(false)
  const [departmentChecks, setDepartmentChecks] = useState({
    purchase: true,
    development: false,
    reliability: false,
    quality: false,
    sales: false
  })
  
  // 즐겨찾기 훅 사용
  const { isFavorite, toggleFavorite, getFavoriteCount, isLoaded } = useFavorites()
  
  // 클라이언트 마운트 감지
  useEffect(() => {
    setIsClientMounted(true)
  }, [])

  // Some dummy jobs data
  const jobs = [
    {
      id: 0,
      image: Image01,
      name: '이름1',
      position: '그룹장',
      department: '부서명1',
      company: '',
      link: '/jobs/post',
      contact: '010-0000-0000',
      email: 'email1@example.com',
      products: '제품1, 제품2',
      type: '',
      fav: false,
    },
    {
      id: 1,
      image: Image01,
      name: '이름2',
      position: '셀장',
      department: '부서명2',
      company: '',
      link: '/jobs/post',
      contact: '010-0000-0000',
      email: 'email2@example.com',
      products: '제품3, 제품4',
      type: '',
      fav: true,
    },
    {
      id: 2,
      image: Image02,
      name: '이름3',
      position: '',
      department: '부서명3',
      company: '',
      link: '/jobs/post',
      contact: '010-0000-0000',
      email: 'email3@example.com',
      products: '제품5, 제품6',
      type: '',
      fav: false,
    },
    {
      id: 3,
      image: Image03,
      name: '이름4',
      position: '팀장',
      department: '부서명4',
      company: '',
      link: '/jobs/post',
      contact: '010-0000-0000',
      email: 'email4@example.com',
      products: '제품7, 제품8',
      type: '',
      fav: false,
    },
    {
      id: 4,
      image: Image04,
      name: '이름5',
      position: '팀장',
      department: '부서명5',
      company: '',
      link: '/jobs/post',
      contact: '010-0000-0000',
      email: 'email5@example.com',
      products: '제품9, 제품10',
      type: '',
      fav: true,
    },
    {
      id: 5,
      image: Image05,
      name: '이름6',
      position: '셀장',
      department: '부서명6',
      company: '',
      link: '/jobs/post',
      contact: '010-0000-0000',
      email: 'email6@example.com',
      products: '제품11, 제품12',
      type: '',
      fav: false,
    },
    {
      id: 6,
      image: Image06,
      name: '이름7',
      position: '',
      department: '부서명7',
      company: '',
      link: '/jobs/post',
      contact: '010-0000-0000',
      email: 'email7@example.com',
      products: '제품13, 제품14',
      type: '',
      fav: false,
    },
    {
      id: 7,
      image: Image04,
      name: '윤서연',
      position: '파트장',
      department: '구매팀 전략구매그룹',
      company: '삼성전기',
      link: '/jobs/post',
      contact: '010-8901-2345',
      email: 'yoon.sy@samsung.com',
      products: '세탁기, 에어컨',
      type: '',
      fav: false,
    },
    {
      id: 8,
      image: Image05,
      name: '임현우',
      position: '셀장',
      department: '신뢰성보증팀',
      company: '수원하이텍',
      link: '/jobs/post',
      contact: '010-9012-3456',
      email: 'lim.hw@suwontech.com',
      products: 'PCB, 커넥터, 케이블, 반도체',
      type: '',
      fav: false,
    },
    {
      id: 9,
      image: Image07,
      name: '한소희',
      position: '',
      department: '품질보증실',
      company: '동진세미켈',
      link: '/jobs/post',
      contact: '010-0123-4567',
      email: 'han.sh@dongjinsemichem.com',
      products: '전자소재, 화학제품',
      type: '',
      fav: false,
    },
    {
      id: 10,
      image: Image01,
      name: '정민수',
      position: '파트장',
      department: '생산기술팀',
      company: '삼성전자',
      link: '/jobs/post',
      contact: '010-1234-5678',
      email: 'jung.ms@samsung.com',
      products: '스마트폰, 태블릿',
      type: '',
      fav: false,
    },
    {
      id: 11,
      image: Image02,
      name: '김지은',
      position: '',
      department: '마케팅팀',
      company: 'LG전자',
      link: '/jobs/post',
      contact: '010-2345-6789',
      email: 'kim.je@lg.com',
      products: 'TV, 모니터, 냉장고',
      type: '',
      fav: true,
    },
    {
      id: 12,
      image: Image03,
      name: '박승현',
      position: '그룹장',
      department: '연구개발센터',
      company: '현대자동차',
      link: '/jobs/post',
      contact: '010-3456-7890',
      email: 'park.sh@hyundai.com',
      products: '전기차, 배터리, 자율주행',
      type: '',
      fav: false,
    },
    {
      id: 13,
      image: Image04,
      name: '최유진',
      position: '팀장',
      department: '전략기획실',
      company: 'SK하이닉스',
      link: '/jobs/post',
      contact: '010-4567-8901',
      email: 'choi.yj@skhynix.com',
      products: 'DRAM, NAND, SSD',
      type: '',
      fav: false,
    },
    {
      id: 14,
      image: Image05,
      name: '이동욱',
      position: '셀장',
      department: '품질관리팀',
      company: '포스코',
      link: '/jobs/post',
      contact: '010-5678-9012',
      email: 'lee.dw@posco.com',
      products: '철강, 스테인리스, 특수강',
      type: '',
      fav: true,
    },
    {
      id: 15,
      image: Image06,
      name: '강미나',
      position: '',
      department: '인사팀',
      company: '넷마블',
      link: '/jobs/post',
      contact: '010-6789-0123',
      email: 'kang.mn@netmarble.com',
      products: '모바일게임, 웹게임',
      type: '',
      fav: false,
    },
    {
      id: 16,
      image: Image07,
      name: '조현준',
      position: '파트장',
      department: '영업지원팀',
      company: '카카오',
      link: '/jobs/post',
      contact: '010-7890-1234',
      email: 'cho.hj@kakao.com',
      products: '메신저, 결제, AI',
      type: '',
      fav: false,
    },
    {
      id: 17,
      image: Image01,
      name: '송지훈',
      position: '',
      department: '재무팀',
      company: '네이버',
      link: '/jobs/post',
      contact: '010-8901-2345',
      email: 'song.jh@naver.com',
      products: '검색, 쇼핑, 클라우드',
      type: '',
      fav: false,
    },
    {
      id: 18,
      image: Image02,
      name: '문서영',
      position: '셀장',
      department: '법무팀',
      company: '쿠팡',
      link: '/jobs/post',
      contact: '010-9012-3456',
      email: 'moon.sy@coupang.com',
      products: '이커머스, 물류, 배송',
      type: '',
      fav: true,
    },
    {
      id: 19,
      image: Image03,
      name: '홍성민',
      position: '팀장',
      department: '디자인센터',
      company: '토스',
      link: '/jobs/post',
      contact: '010-0123-4567',
      email: 'hong.sm@toss.im',
      products: '간편송금, 금융, 투자',
      type: '',
      fav: false,
    },
    {
      id: 20,
      image: Image04,
      name: '임지연',
      position: '그룹장',
      department: '기술전략실',
      company: '배달의민족',
      link: '/jobs/post',
      contact: '010-1234-5678',
      email: 'lim.jy@baemin.com',
      products: '배달, O2O, 푸드테크',
      type: '',
      fav: false,
    },
  ]

  // 필터 변경 핸들러들
  const handleFavoriteFilterChange = (enabled: boolean) => {
    setFavoriteFilterEnabled(enabled)
  }

  const handlePositionFilterChange = (filters: { executive: boolean; manager: boolean; staff: boolean }) => {
    setPositionFilters(filters)
  }

  const handleSelectAllDepartments = () => {
    const allChecked = Object.values(departmentChecks).every(value => value === true)
    setDepartmentChecks({
      purchase: !allChecked,
      development: !allChecked,
      reliability: !allChecked,
      quality: !allChecked,
      sales: !allChecked
    })
  }

  const handleSelectAllFilters = () => {
    const allChecked = Object.values(positionFilters).every(value => value === true)
    const newFilters = {
      executive: !allChecked,
      manager: !allChecked,
      staff: !allChecked
    }
    setPositionFilters(newFilters)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column - Views */}
        <main className="flex-1 min-w-0">
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <button 
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' 
                ? 'bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-800' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-600'}`}
            >
              <svg className="shrink-0 fill-current mr-2" width="16" height="16" viewBox="0 0 16 16">
                <path d="M14 3v10c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1h10c.6 0 1 .4 1 1zm-2 1H4v2h8V4zm-8 4v2h3V8H4zm5 0v2h3V8H9zm-5 4h3v-2H4v2zm5 0h3v-2H9v2z"/>
              </svg>
              리스트
            </button>
            <button 
              onClick={() => setViewMode('graph')}
              className={`btn ${viewMode === 'graph' 
                ? 'bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-800' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-600'}`}
            >
              <svg className="shrink-0 fill-current mr-2" width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 4a1 1 0 100-2 1 1 0 000 2zM8 6.5c-.3 0-.5.2-.5.5v1.5c0 .3.2.5.5.5s.5-.2.5-.5V7c0-.3-.2-.5-.5-.5zM5 7a1 1 0 11-2 0 1 1 0 012 0zM11 7a1 1 0 100 2 1 1 0 000-2zM8 14a1 1 0 100-2 1 1 0 000 2zM4 11H2v1c0 1.1.9 2 2 2v-2c-.6 0-1-.4-1-1h1v-1zm8 0h2v1c0 1.1-.9 2-2 2v-2c.6 0 1-.4 1-1h-1v-1zM7.5 4.9L6.1 6.3c-.2.2-.2.5 0 .7.2.2.5.2.7 0l1.4-1.4c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0zm1 0c-.2-.2-.5-.2-.7 0s-.2.5 0 .7L9.2 7c.2.2.5.2.7 0 .2-.2.2-.5 0-.7L8.5 4.9z"/>
              </svg>
              그래프
            </button>
          </div>

          {/* View Content */}
          <div className="overflow-hidden">
            {viewMode === 'list' ? (
              <ListView
              jobs={jobs}
              positionFilters={positionFilters}
              favoriteFilterEnabled={favoriteFilterEnabled}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              getFavoriteCount={getFavoriteCount}
              isLoaded={isLoaded}
            />
          ) : (
            <GraphView
              jobs={jobs}
            />
          )}
          </div>
        </main>

        {/* Right Column - AI Search & Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="space-y-8">
              {/* AI Search Section */}
              <div className="relative bg-linear-to-r from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04] rounded-lg p-5">
                <div className="absolute bottom-0 -mb-3">
                  <svg width="44" height="42" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <defs>
                      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ill-b">
                        <stop stopColor="#B7ACFF" offset="0%" />
                        <stop stopColor="#9C8CFF" offset="100%" />
                      </linearGradient>
                      <linearGradient x1="50%" y1="24.537%" x2="50%" y2="100%" id="ill-c">
                        <stop stopColor="#4634B1" offset="0%" />
                        <stop stopColor="#4634B1" stopOpacity="0" offset="100%" />
                      </linearGradient>
                      <path id="ill-a" d="m20 0 20 40-20-6.25L0 40z" />
                    </defs>
                    <g transform="scale(-1 1) rotate(-51 -11.267 67.017)" fill="none" fillRule="evenodd">
                      <mask id="ill-d" fill="#fff">
                        <use xlinkHref="#ill-a" />
                      </mask>
                      <use fill="url(#ill-b)" xlinkHref="#ill-a" />
                      <path fill="url(#ill-c)" mask="url(#ill-d)" d="M20.586-7.913h25v47.5h-25z" />
                    </g>
                  </svg>
                </div>
                <div className="relative">
                  <div className="text-sm font-medium text-gray-800 dark:text-violet-200 mb-2">AI에게 담당자를 물어보세요.</div>
                  <div className="text-right">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600" href="#0">
                      AI에게 물어보기 -&gt;
                    </a>
                  </div>
                </div>
              </div>
              {/* Filters Section */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">필터</h2>
                <div className="space-y-6">
                  {/* Group 1 - 부서 */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-800 dark:text-gray-100 font-semibold">부서</span>
                      <button 
                        onClick={handleSelectAllDepartments}
                        className="text-xs text-violet-500 hover:text-violet-600 font-medium"
                      >
                        {Object.values(departmentChecks).every(value => value === true) ? '전체 해제' : '전체 선택'}
                      </button>
                    </div>
                    <ul className="space-y-2">
                      <li>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox" 
                            checked={departmentChecks.purchase}
                            onChange={() => setDepartmentChecks({...departmentChecks, purchase: !departmentChecks.purchase})}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">구매</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox"
                            checked={departmentChecks.development}
                            onChange={() => setDepartmentChecks({...departmentChecks, development: !departmentChecks.development})}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">개발</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox"
                            checked={departmentChecks.reliability}
                            onChange={() => setDepartmentChecks({...departmentChecks, reliability: !departmentChecks.reliability})}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">신뢰성</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox"
                            checked={departmentChecks.quality}
                            onChange={() => setDepartmentChecks({...departmentChecks, quality: !departmentChecks.quality})}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">품질</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox"
                            checked={departmentChecks.sales}
                            onChange={() => setDepartmentChecks({...departmentChecks, sales: !departmentChecks.sales})}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">영업</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  {/* Group 2 - 필터링 */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-800 dark:text-gray-100 font-semibold">필터링</span>
                      <button 
                        onClick={handleSelectAllFilters}
                        className="text-xs text-violet-500 hover:text-violet-600 font-medium"
                      >
                        {Object.values(positionFilters).every(value => value === true) ? '전체 해제' : '전체 선택'}
                      </button>
                    </div>
                    <ul className="space-y-2">
                      <li>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox" 
                            checked={positionFilters.executive}
                            onChange={() => {
                              const newFilters = {...positionFilters, executive: !positionFilters.executive}
                              setPositionFilters(newFilters)
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">임원</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox" 
                            checked={positionFilters.manager}
                            onChange={() => {
                              const newFilters = {...positionFilters, manager: !positionFilters.manager}
                              setPositionFilters(newFilters)
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">파트장/셀장</span>
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox"
                            checked={positionFilters.staff}
                            onChange={() => {
                              const newFilters = {...positionFilters, staff: !positionFilters.staff}
                              setPositionFilters(newFilters)
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">담당자</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  {/* Group 3 - 즐겨찾기 */}
                  <div>
                    <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold mb-3">즐겨찾기</div>
                    <div className="flex items-center">
                      <div className="form-switch">
                        <input
                          type="checkbox"
                          id="favorite-filter-toggle"
                          className="sr-only"
                          checked={favoriteFilterEnabled}
                          onChange={(e) => {
                            if (!isClientMounted) return
                            const enabled = e.target.checked
                            setFavoriteFilterEnabled(enabled)
                          }}
                        />
                        <label htmlFor="favorite-filter-toggle">
                          <span className="bg-white shadow-sm" aria-hidden="true"></span>
                          <span className="sr-only">즐겨찾기</span>
                        </label>
                      </div>
                      <div className="text-sm text-gray-400 dark:text-gray-500 italic ml-2">{favoriteFilterEnabled ? 'On' : 'Off'}</div>
                    </div>
                    <div className="text-sm dark:text-gray-500 italic mt-3">즐겨찾기로 등록한 담당자만 조회합니다</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
    </div>
  )
}
