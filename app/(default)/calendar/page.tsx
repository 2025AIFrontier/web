'use client'

import { useState } from 'react'
import { CalendarProvider } from './calendar-context'
import CalendarNavigation from './calendar-navigation'
import CalendarTable from './calendar-table'
import CalendarTitle from './title'

export default function Calendar() {
  // Toggle states for buttons
  const [isMeetingRoomActive, setIsMeetingRoomActive] = useState(true)
  const [isVehicleActive, setIsVehicleActive] = useState(true)
  const [isBusinessTripActive, setIsBusinessTripActive] = useState(true)
  const [isGroupLeaderActive, setIsGroupLeaderActive] = useState(true)
  const [isPartLeaderActive, setIsPartLeaderActive] = useState(true)

  // Some dummy events data
  const events = [
    // Previous month
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 8, 3),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 8, 7),
      eventName: '⛱️ Relax for 2 at Marienbad',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 12, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 11),
      eventName: 'Team Catch-up',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 18, 2),
      eventEnd: null,
      eventName: '✍️ New Project (2)',
      eventColor: 'yellow'
    },
    // Current month
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 11),
      eventName: 'Meeting w/ Patrick Lin',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 19),
      eventEnd: null,
      eventName: 'Reservation at La Ginestre',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 3, 9),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 3, 10),
      eventName: '✍️ New Project',
      eventColor: 'yellow'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 21),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 22),
      eventName: '⚽ 2024 - Semi-final',
      eventColor: 'red'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 11),
      eventName: 'Meeting w/Carolyn',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 13),
      eventEnd: null,
      eventName: 'Pick up Marta at school',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 14),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 15),
      eventName: 'Meeting w/ Patrick Lin',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 19),
      eventEnd: null,
      eventName: 'Reservation at La Ginestre',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 11),
      eventName: '⛱️ Relax for 2 at Marienbad',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 19),
      eventEnd: null,
      eventName: '⚽ 2024 - Semi-final',
      eventColor: 'red'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 11),
      eventName: 'Team Catch-up',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 2),
      eventEnd: null,
      eventName: 'Pick up Marta at school',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 3),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 7),
      eventName: '✍️ New Project (2)',
      eventColor: 'yellow'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 11),
      eventName: 'Team Catch-up',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 19),
      eventEnd: null,
      eventName: '⚽ 2024 - Semi-final',
      eventColor: 'red'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 23, 0),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 23, 23),
      eventName: 'You stay at Meridiana B&B',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 11),
      eventName: 'Meeting w/ Kylie Joh',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 29, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 29, 11),
      eventName: 'Call Request ->',
      eventColor: 'sky'
    },
    // Next month
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 2, 3),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 2, 7),
      eventName: '✍️ New Project (2)',
      eventColor: 'yellow'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 14, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 11),
      eventName: 'Team Catch-up',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 25, 2),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 25, 3),
      eventName: 'Pick up Marta at school',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 27, 21),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 27, 22),
      eventName: '⚽ 2024 - Semi-final',
      eventColor: 'red'
    },
  ]

  return (
    <CalendarProvider>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">

        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-4">

          {/* Left: Title */}
          <CalendarTitle />

          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

            <CalendarNavigation />

            <hr className="w-px h-full bg-gray-200 dark:bg-gray-700/60 border-none mx-1" />

            {/* Create event button */}
            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">Create Event</button>

          </div>

        </div>

        {/* Filters and view buttons */}
        <div className="sm:flex sm:justify-between sm:items-center mb-4">

          {/* Filters  */}
          <div className="mb-4 sm:mb-0 mr-2">
            <ul className="flex flex-wrap items-center -m-1">
              <li className="m-1">
                <button 
                  onClick={() => setIsMeetingRoomActive(!isMeetingRoomActive)}
                  className={`btn-sm border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${
                    isMeetingRoomActive 
                      ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' 
                      : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className={`w-1 h-3.5 shrink-0 ${isMeetingRoomActive ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className="ml-1.5">회의실 예약</span>
                </button>
              </li>
              <li className="m-1">
                <button 
                  onClick={() => setIsVehicleActive(!isVehicleActive)}
                  className={`btn-sm border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${
                    isVehicleActive 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className={`w-1 h-3.5 shrink-0 ${isVehicleActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className="ml-1.5">차량 예약</span>
                </button>
              </li>
              <li className="m-1">
                <button 
                  onClick={() => setIsBusinessTripActive(!isBusinessTripActive)}
                  className={`btn-sm border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${
                    isBusinessTripActive 
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' 
                      : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className={`w-1 h-3.5 shrink-0 ${isBusinessTripActive ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className="ml-1.5">출장자 조회</span>
                </button>
              </li>
              <li className="m-1">
                <button 
                  onClick={() => setIsGroupLeaderActive(!isGroupLeaderActive)}
                  className={`btn-sm border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${
                    isGroupLeaderActive 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className={`w-1 h-3.5 shrink-0 ${isGroupLeaderActive ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className="ml-1.5">그룹장 일정</span>
                </button>
              </li>
              <li className="m-1">
                <button 
                  onClick={() => setIsPartLeaderActive(!isPartLeaderActive)}
                  className={`btn-sm border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${
                    isPartLeaderActive 
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                      : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className={`w-1 h-3.5 shrink-0 ${isPartLeaderActive ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className="ml-1.5">파트장 일정</span>
                </button>
              </li>
              <li className="m-1">
                <button className="btn-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500">+Add New</button>
              </li>
            </ul>
          </div>

          {/* View buttons (requires custom integration) */}
          <div className="flex flex-nowrap -space-x-px">
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-violet-500 rounded-none first:rounded-l-lg last:rounded-r-lg">Month</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">Week</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">Day</button>
          </div>
        </div>

        <CalendarTable events={events} />

      </div>
    </CalendarProvider>
  )
}