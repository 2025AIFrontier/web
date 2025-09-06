'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import BusinessTripContent from './business-trip-content'
import CalendarScheduleView from './calendar-schedule-view'

interface Tab {
  id: string
  label: string
}

interface CalendarTabsProps {
  children: React.ReactNode
}

export default function CalendarTabs({ children }: CalendarTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || 'room_reservation')

  const tabs: Tab[] = [
    { id: 'room_reservation', label: '회의실 예약' },
    { id: 'car_reservation', label: '업무 차량 예약' },
    { id: 'schedule', label: '일정 조회' },
    { id: 'business_trip', label: '출장자 현황' },
  ]

  useEffect(() => {
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    router.push(`/calendar?tab=${tabId}`)
  }

  return (
    <div className="w-full">
      {/* Tab Content - 탭 네비게이션 제거하고 콘텐츠만 표시 */}
      {activeTab === 'room_reservation' && children}
      {activeTab === 'car_reservation' && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          업무 차량 예약 기능이 곧 추가됩니다...
        </div>
      )}
      {activeTab === 'schedule' && <CalendarScheduleView />}
      {activeTab === 'business_trip' && <BusinessTripContent />}
    </div>
  )
}