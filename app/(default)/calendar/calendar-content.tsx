'use client'

import { useState } from 'react'
import CalendarNavigation from './calendar-navigation'
import CalendarTable from './calendar-table'
import CalendarTitle from './title'

interface CalendarContentProps {
  events: any[]
}

export default function CalendarContent({ events }: CalendarContentProps) {
  const [filters, setFilters] = useState({
    departmentHead: false,
    teamLead: false
  })

  const toggleFilter = (filterName: 'departmentHead' | 'teamLead') => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  return (
    <>
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-4">
        {/* Left: Title */}
        <CalendarTitle />

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <CalendarNavigation />
          <hr className="w-px h-full bg-gray-200 dark:bg-gray-700/60 border-none mx-1" />
          {/* Create event button */}
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
            Create Event
          </button>
        </div>
      </div>

      {/* Filters and view buttons */}
      <div className="sm:flex sm:justify-between sm:items-center mb-4">
        {/* Filters  */}
        <div className="mb-4 sm:mb-0 mr-2">
          <ul className="flex flex-wrap items-center -m-1">
            <li className="m-1">
              <button 
                onClick={() => toggleFilter('departmentHead')}
                className={`btn-sm border transition-colors ${
                  filters.departmentHead 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className={`w-1 h-3.5 shrink-0 ${filters.departmentHead ? 'bg-white' : 'bg-red-500'}`}></div>
                <span className="ml-1.5">부서장 일정</span>
              </button>
            </li>
            <li className="m-1">
              <button 
                onClick={() => toggleFilter('teamLead')}
                className={`btn-sm border transition-colors ${
                  filters.teamLead 
                    ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className={`w-1 h-3.5 shrink-0 ${filters.teamLead ? 'bg-white' : 'bg-yellow-500'}`}></div>
                <span className="ml-1.5">파트장 일정</span>
              </button>
            </li>
            <li className="m-1">
              <button className="btn-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500">
                +Add New
              </button>
            </li>
          </ul>
        </div>

        {/* View buttons (requires custom integration) */}
        <div className="flex flex-nowrap -space-x-px">
          <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-violet-500 rounded-none first:rounded-l-lg last:rounded-r-lg">
            Month
          </button>
          <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">
            Week
          </button>
          <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">
            Day
          </button>
        </div>
      </div>

      <CalendarTable events={events} />
    </>
  )
}