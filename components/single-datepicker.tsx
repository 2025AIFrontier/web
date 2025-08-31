"use client"

import * as React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SingleDatePickerProps {
  className?: string
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
}

export default function SingleDatePicker({
  className,
  date,
  onDateChange,
  placeholder = "날짜 선택",
  disabled
}: SingleDatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  const handleDateChange = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "btn px-2.5 w-full bg-white border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium text-left justify-start",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <svg className="fill-current text-gray-400 dark:text-gray-500 ml-1 mr-2" width="16" height="16" viewBox="0 0 16 16">
              <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
              <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"></path>
            </svg>
            {selectedDate ? (
              format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })
            ) : (
              <span>{placeholder}</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            defaultMonth={selectedDate}
            locale={ko}
            disabled={disabled}
            modifiersStyles={{
              today: {
                color: 'rgb(139, 92, 246)', // 보라색 텍스트
                backgroundColor: 'transparent', // 배경색 없음
                fontWeight: 'bold'
              },
              disabled: {
                color: '#9ca3af',
                backgroundColor: '#f3f4f6',
                cursor: 'not-allowed',
                opacity: 0.5
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}