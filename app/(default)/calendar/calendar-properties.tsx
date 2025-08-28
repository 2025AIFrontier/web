'use client'

import { useEffect, useState } from 'react'
import { useCalendarContext } from './calendar-context'

export const CalendarProperties = () => {
  const monthNames: string[] = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dayNames: string[] = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const {
    today,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,    
  } = useCalendarContext()
  const [daysInMonth, setDaysInMonth] = useState<number[]>([])
  const [startingBlankDays, setStartingBlankDays] = useState<number[]>([])
  const [endingBlankDays, setEndingBlankDays] = useState<number[]>([])  

  const eventColor = (color: string): string => {
    switch (color) {
      case 'sky':
        return 'text-white bg-sky-500'
      case 'indigo':
        return 'text-white bg-violet-500'
      case 'yellow':
        return 'text-white bg-yellow-500'
      case 'green':
        return 'text-white bg-green-500'
      case 'red':
        return 'text-white bg-red-500'
      default:
        return ''
    }
  }

  const isToday = (date: number): boolean => {
    const day = new Date(currentYear, currentMonth, date)
    return today.toDateString() === day.toDateString()
  }

  const renderDays = (): void => {
    const days = new Date(currentYear, currentMonth + 1, 0).getDate()

    // starting empty cells (previous month)
    const startingDayOfWeek: number = new Date(currentYear, currentMonth).getDay()
    let startingBlankDaysArray: number[] = []
    for (let i = 1; i <= startingDayOfWeek; i++) {
      startingBlankDaysArray.push(i)
    }

    // ending empty cells (next month)
    const endingDayOfWeek: number = new Date(currentYear, currentMonth + 1, 0).getDay()
    let endingBlankDaysArray: number[] = []
    for (let i = 1; i < 7 - endingDayOfWeek; i++) {
      endingBlankDaysArray.push(i)
    }

    // current month cells
    let daysArray: number[] = []
    for (let i = 1; i <= days; i++) {
      daysArray.push(i)
    }

    setStartingBlankDays(startingBlankDaysArray)
    setEndingBlankDays(endingBlankDaysArray)
    setDaysInMonth(daysArray)
  }

  return {
    today,
    monthNames,
    dayNames,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    daysInMonth,
    setDaysInMonth,
    startingBlankDays,
    setStartingBlankDays,
    endingBlankDays,
    setEndingBlankDays,
    eventColor,
    isToday,
    renderDays,
  }
}
