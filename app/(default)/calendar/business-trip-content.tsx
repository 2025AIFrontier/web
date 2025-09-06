'use client'

import { useState } from 'react'

interface TripCardData {
  id: number
  status: '해외' | '국내'
  statusColor: 'green' | 'yellow'
  name: string
  department: string
  reason: string
  currentDays: number
  totalDays: number
  startDate: string
  endDate: string
}

function TripCard({ data, isSelected, onSelect }: { data: TripCardData; isSelected: boolean; onSelect: () => void }) {
  const progressPercentage = (data.currentDays / data.totalDays) * 100

  return (
    <label className="relative block cursor-pointer text-left w-full">
      <input 
        type="radio" 
        name="radio-buttons" 
        className="peer sr-only" 
        checked={isSelected}
        onChange={onSelect}
      />
      <div className="p-4 rounded-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition">
        <div className="grid grid-cols-12 items-center gap-x-2">
          {/* Card status */}
          <div className="col-span-6 order-1 sm:order-none sm:col-span-3 flex items-center space-x-4">
            <div className={`text-xs inline-flex font-medium ${data.statusColor === 'green' ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'} rounded-full text-center px-2.5 py-1`}>
              {data.status}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.name}</div>
              <div className="text-xs">{data.department}</div>
            </div>
          </div>
          {/* Trip Reason */}
          <div className="col-span-6 order-2 sm:order-none sm:col-span-3 text-left sm:text-center">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.reason}</div>
          </div>
          {/* Card limits */}
          <div className="col-span-6 order-1 sm:order-none sm:col-span-4 text-right sm:text-center">
            <div className="flex items-center justify-end sm:justify-center space-x-3">
              <div className="relative w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="absolute inset-0 bg-green-400 rounded-full" style={{ width: `${progressPercentage}%` }} />
              </div>
              <div className="text-sm">{data.currentDays}일/{data.totalDays}일</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">({data.startDate}~{data.endDate})</div>
            </div>
          </div>
          {/* Empty column for layout */}
          <div className="col-span-6 order-2 sm:order-none sm:col-span-2">
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 border-2 border-transparent peer-checked:border-violet-400 dark:peer-checked:border-violet-500 rounded-lg pointer-events-none"
        aria-hidden="true"
      />
    </label>
  )
}

export default function BusinessTripContent() {
  const [selectedCard, setSelectedCard] = useState(0)
  const [filter, setFilter] = useState<'all' | 'domestic' | 'overseas'>('all')

  const tripData: TripCardData[] = [
    {
      id: 1,
      status: '해외',
      statusColor: 'green',
      name: '이민재',
      department: 'RF&반도체 구매그룹',
      reason: '수급이슈',
      currentDays: 5,
      totalDays: 10,
      startDate: "'25.01.01",
      endDate: "'25.01.10"
    },
    {
      id: 2,
      status: '국내',
      statusColor: 'yellow',
      name: '정수연',
      department: '구매전략그룹',
      reason: '교육',
      currentDays: 1,
      totalDays: 15,
      startDate: "'25.01.15",
      endDate: "'25.01.29"
    },
    {
      id: 3,
      status: '해외',
      statusColor: 'green',
      name: '김철수',
      department: '네트워크 구매팀',
      reason: '거래선 방문',
      currentDays: 7,
      totalDays: 14,
      startDate: "'25.02.01",
      endDate: "'25.02.14"
    },
    {
      id: 4,
      status: '국내',
      statusColor: 'yellow',
      name: '박영희',
      department: 'MRO 구매팀',
      reason: '공장 실사',
      currentDays: 2,
      totalDays: 5,
      startDate: "'25.01.20",
      endDate: "'25.01.24"
    },
    {
      id: 5,
      status: '해외',
      statusColor: 'green',
      name: '최동훈',
      department: '글로벌소싱팀',
      reason: '신규업체 발굴',
      currentDays: 3,
      totalDays: 7,
      startDate: "'25.01.25",
      endDate: "'25.01.31"
    }
  ]

  // Filter trip data based on selected filter
  const filteredTripData = tripData.filter(trip => {
    if (filter === 'all') return true
    if (filter === 'domestic') return trip.status === '국내'
    if (filter === 'overseas') return trip.status === '해외'
    return true
  })

  // Reset selected card if it's out of bounds after filtering
  if (selectedCard >= filteredTripData.length && filteredTripData.length > 0) {
    setSelectedCard(0)
  }

  return (
    <div className="lg:relative lg:flex">

      {/* Content */}
      <div className="w-full lg:pr-8">

        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-5">

          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">국내외 출장자 현황</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5">
          <ul className="flex flex-wrap -m-1">
            <li className="m-1">
              <button 
                onClick={() => setFilter('all')}
                className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border transition ${
                  filter === 'all' 
                    ? 'border-transparent shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                    : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                전체 ({tripData.length})
              </button>
            </li>
            <li className="m-1">
              <button 
                onClick={() => setFilter('domestic')}
                className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border transition ${
                  filter === 'domestic' 
                    ? 'border-transparent shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                    : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                국내 출장자 ({tripData.filter(t => t.status === '국내').length})
              </button>
            </li>
            <li className="m-1">
              <button 
                onClick={() => setFilter('overseas')}
                className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border transition ${
                  filter === 'overseas' 
                    ? 'border-transparent shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800'
                    : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                해외 출장자 ({tripData.filter(t => t.status === '해외').length})
              </button>
            </li>
          </ul>
        </div>

        {/* Trip cards */}
        <div className="space-y-2">
          {filteredTripData.map((trip, index) => (
            <TripCard 
              key={trip.id}
              data={trip}
              isSelected={selectedCard === index}
              onSelect={() => setSelectedCard(index)}
            />
          ))}
        </div>

      </div>

      {/* Sidebar */}
      <div>
        <div className="lg:sticky lg:top-16 bg-linear-to-b from-gray-100 to-white dark:from-gray-800/30 dark:to-gray-900 lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar lg:shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700/60 lg:w-[390px] lg:h-[calc(100dvh-64px)]">
          <div className="py-8 px-4 lg:px-8">
            <div className="max-w-sm mx-auto lg:max-w-none">

              <div className="text-gray-800 dark:text-gray-100 font-semibold text-center mb-6">{filteredTripData[selectedCard]?.name || '선택된 출장자 없음'}</div>

              {/* Calendar */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">2025년 1월</h3>
                  <div className="flex space-x-1">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 16 16">
                        <path d="M10 13L5 8l5-5v10z" />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 16 16">
                        <path d="M6 13l5-5-5-5v10z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-0 text-center">
                  {/* Days of week header */}
                  <div className="text-xs font-medium text-red-500 py-2">일</div>
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 py-2">월</div>
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 py-2">화</div>
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 py-2">수</div>
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 py-2">목</div>
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 py-2">금</div>
                  <div className="text-xs font-medium text-blue-500 py-2">토</div>
                  
                  {/* Calendar days */}
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1
                    const startDay = filteredTripData[selectedCard] ? parseInt(filteredTripData[selectedCard].startDate.split('.')[2]) : 0
                    const endDay = filteredTripData[selectedCard] ? parseInt(filteredTripData[selectedCard].endDate.split('.')[2]) : 0
                    const isInTrip = day >= startDay && day <= endDay
                    const isStart = day === startDay
                    const isEnd = day === endDay
                    
                    // Calculate day of week (Jan 1 2025 is Wednesday = 3)
                    const dayOfWeek = (i + 3) % 7
                    const isSunday = dayOfWeek === 0
                    const isSaturday = dayOfWeek === 6
                    
                    // Check if today (you can adjust this to actual date)
                    const isToday = day === 3 // Example: January 3rd is today
                    
                    // Add empty cells for days before the 1st (assuming Jan 1 2025 is Wednesday)
                    if (i === 0) {
                      return (
                        <>
                          <div key="empty1" className="p-2"></div>
                          <div key="empty2" className="p-2"></div>
                          <div key="empty3" className="p-2"></div>
                          <div key={day} className={`p-2 text-xs relative ${
                            isInTrip 
                              ? isStart 
                                ? 'bg-green-500 text-white rounded-l-lg' 
                                : isEnd 
                                  ? 'bg-green-500 text-white rounded-r-lg' 
                                  : 'bg-green-500 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          }`}>
                            {day}
                          </div>
                        </>
                      )
                    }
                    
                    return (
                      <div key={day} className={`p-2 text-xs relative ${
                        isInTrip 
                          ? isStart 
                            ? 'bg-green-500 text-white rounded-l-lg' 
                            : isEnd 
                              ? 'bg-green-500 text-white rounded-r-lg' 
                              : 'bg-green-500 text-white'
                          : isSunday 
                            ? 'text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            : isSaturday
                              ? 'text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                      } ${
                        isToday ? 'z-10 ring-2 ring-violet-500 ring-offset-1 rounded font-bold' : ''
                      }`}>
                        {day}
                        {isToday && (
                          <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-violet-500 rounded-full z-20"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 flex items-center space-x-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-400">출장 기간</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {filteredTripData[selectedCard]?.startDate} ~ {filteredTripData[selectedCard]?.endDate}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Details</div>
                <ul>
                  <li className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700/60">
                    <div className="text-sm">부서</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100 ml-2">{filteredTripData[selectedCard]?.department || '-'}</div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700/60">
                    <div className="text-sm">출장구분</div>
                    <div className="flex items-center whitespace-nowrap">
                      <div className={`w-2 h-2 rounded-full ${filteredTripData[selectedCard]?.statusColor === 'green' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`} />
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{filteredTripData[selectedCard]?.status || '-'}</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 출장 현황 */}
              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">출장 현황</div>
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700/60">
                  <div className="flex justify-between text-sm mb-2">
                    <div>이번 출장</div>
                    <div className="italic">
                      {filteredTripData[selectedCard]?.currentDays || 0}일 <span className="text-gray-400 dark:text-gray-500">/</span> {filteredTripData[selectedCard]?.totalDays || 0}일
                    </div>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="absolute inset-0 bg-green-400 rounded-full" aria-hidden="true" style={{ width: `${filteredTripData[selectedCard] ? (filteredTripData[selectedCard].currentDays / filteredTripData[selectedCard].totalDays) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>

              {/* 연간 출장 현황 */}
              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">연간 출장 현황</div>
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700/60">
                  <div className="flex justify-between text-sm mb-2">
                    <div>누적 출장일</div>
                    <div className="italic">
                      45일 <span className="text-gray-400 dark:text-gray-500">/</span> 180일
                    </div>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="absolute inset-0 bg-green-400 rounded-full" aria-hidden="true" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>

              {/* Edit / Delete */}
              <div className="flex items-center space-x-3 mt-6">
                <div className="w-1/2">
                  <button className="btn w-full border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">
                    <svg className="fill-current text-gray-400 dark:text-gray-500 shrink-0" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                    </svg>
                    <span className="ml-2">수정하기</span>
                  </button>
                </div>
                <div className="w-1/2">
                  <button className="btn w-full border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500">
                    <svg className="fill-current shrink-0" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M14.574 5.67a13.292 13.292 0 0 1 1.298 1.842 1 1 0 0 1 0 .98C15.743 8.716 12.706 14 8 14a6.391 6.391 0 0 1-1.557-.2l1.815-1.815C10.97 11.82 13.06 9.13 13.82 8c-.163-.243-.39-.56-.669-.907l1.424-1.424ZM.294 15.706a.999.999 0 0 1-.002-1.413l2.53-2.529C1.171 10.291.197 8.615.127 8.49a.998.998 0 0 1-.002-.975C.251 7.29 3.246 2 8 2c1.331 0 2.515.431 3.548 1.038L14.293.293a.999.999 0 1 1 1.414 1.414l-14 14a.997.997 0 0 1-1.414 0ZM2.18 8a12.603 12.603 0 0 0 2.06 2.347l1.833-1.834A1.925 1.925 0 0 1 6 8a2 2 0 0 1 2-2c.178 0 .348.03.512.074l1.566-1.566C9.438 4.201 8.742 4 8 4 5.146 4 2.958 6.835 2.181 8Z" />
                    </svg>
                    <span className="ml-2">취소하기</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
