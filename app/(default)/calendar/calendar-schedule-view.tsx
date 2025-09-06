'use client'

import { useState } from 'react'
import CalendarNavigation from './calendar-navigation'
import CalendarTable from './calendar-table'

export default function CalendarScheduleView() {
  const [filters, setFilters] = useState({
    projectSchedule: true,
    corporateSchedule: false,
    celebrationSchedule: false,
    logisticsSchedule: false
  })

  const toggleFilter = (filterName: 'projectSchedule' | 'corporateSchedule' | 'celebrationSchedule' | 'logisticsSchedule') => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  // Sample events for schedule view
  const scheduleEvents = [
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 11),
      eventName: '주간 팀 회의',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 3, 14),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 3, 16),
      eventName: '프로젝트 리뷰',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 9),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 10),
      eventName: '1:1 미팅',
      eventColor: 'yellow'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 10, 15),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 10, 17),
      eventName: '부서 전체 회의',
      eventColor: 'red'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 12),
      eventName: '교육 세션',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 13),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 14),
      eventName: '점심 약속',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 11),
      eventName: '월간 보고',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 14),
      eventEnd: null,
      eventName: '고객 미팅',
      eventColor: 'yellow'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 28, 9),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 28, 18),
      eventName: '워크샵',
      eventColor: 'indigo'
    }
  ]

  return (
    <>
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-4">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">일정 조회 📅</h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <CalendarNavigation />
          <hr className="w-px h-full bg-gray-200 dark:bg-gray-700/60 border-none mx-1" />
          {/* Add schedule button */}
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
            일정 추가
          </button>
        </div>
      </div>

      {/* Filters and view buttons */}
      <div className="sm:flex sm:justify-between sm:items-center mb-4">
        {/* Filters */}
        <div className="mb-4 sm:mb-0 mr-2">
          <ul className="flex flex-wrap items-center -m-1">
            <li className="m-1">
              <button 
                onClick={() => toggleFilter('projectSchedule')}
                className={`btn-sm border transition-colors ${
                  filters.projectSchedule 
                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className={`w-1 h-3.5 shrink-0 ${filters.projectSchedule ? 'bg-white' : 'bg-blue-500'}`}></div>
                <span className="ml-1.5">과제 일정</span>
              </button>
            </li>
            <li className="m-1">
              <button 
                onClick={() => toggleFilter('corporateSchedule')}
                className={`btn-sm border transition-colors ${
                  filters.corporateSchedule 
                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className={`w-1 h-3.5 shrink-0 ${filters.corporateSchedule ? 'bg-white' : 'bg-green-500'}`}></div>
                <span className="ml-1.5">법인 일정</span>
              </button>
            </li>
            <li className="m-1">
              <button 
                onClick={() => toggleFilter('celebrationSchedule')}
                className={`btn-sm border transition-colors ${
                  filters.celebrationSchedule 
                    ? 'bg-purple-500 text-white border-purple-500 hover:bg-purple-600 hover:border-purple-600' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className={`w-1 h-3.5 shrink-0 ${filters.celebrationSchedule ? 'bg-white' : 'bg-purple-500'}`}></div>
                <span className="ml-1.5">경조사</span>
              </button>
            </li>
            <li className="m-1">
              <button 
                onClick={() => toggleFilter('logisticsSchedule')}
                className={`btn-sm border transition-colors ${
                  filters.logisticsSchedule 
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className={`w-1 h-3.5 shrink-0 ${filters.logisticsSchedule ? 'bg-white' : 'bg-orange-500'}`}></div>
                <span className="ml-1.5">물류/생산 일정</span>
              </button>
            </li>
            <li className="m-1">
              <button className="btn-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500">
                +필터 추가
              </button>
            </li>
          </ul>
        </div>

        {/* View buttons */}
        <div className="flex flex-nowrap -space-x-px">
          <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-violet-500 rounded-none first:rounded-l-lg last:rounded-r-lg">
            월간
          </button>
          <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">
            주간
          </button>
          <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">
            일간
          </button>
        </div>
      </div>

      {/* Calendar Table */}
      <CalendarTable events={scheduleEvents} />
    </>
  )
}