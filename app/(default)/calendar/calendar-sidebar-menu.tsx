'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import PageSidebarMenu, { PageSidebarMenuGroup } from '@/components/ui/page-sidebar-menu'

export default function CalendarSidebarMenu() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const tabParam = searchParams.get('tab')
  const activeTab = tabParam || 'room_reservation'

  // 아이콘 컴포넌트들
  const CalendarIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M5 0a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
      <path d="M4 4a4 4 0 0 0-4 4c0 1.858 2.4 5.109 3.788 6.966a.5.5 0 0 0 .424.034l.058-.017c.124-.046.166-.126.208-.217C5.866 13.109 8 9.858 8 8a4 4 0 0 0-4-4Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )

  const CarIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M14.9 7c-.1-.4-.2-.6-.3-.6l-1.7-.3c-.2-.7-.4-1.2-.7-1.2l-1.9-.2C9.6 2.9 8 2 6 2s-3.6.9-4.3 2.7l-1.9.2c-.3 0-.5.5-.7 1.2l-1.7.3c-.1 0-.2.2-.3.6-.1.3-.1.6.1.8L.9 10c0 2 1.3 3 3 3s3-1 3-3h2c0 2 1.3 3 3 3s3-1 3-3l-.7-2.2c.2-.2.2-.5.1-.8ZM3.9 12c-.8 0-1-.5-1-1s.2-1 1-1 1 .5 1 1-.2 1-1 1Zm8 0c-.8 0-1-.5-1-1s.2-1 1-1 1 .5 1 1-.2 1-1 1Z" />
    </svg>
  )

  const ScheduleIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6Z" />
      <path d="M8 3c-.6 0-1 .4-1 1v3.6c0 .3.1.5.3.7l2.6 2.6c.4.4 1 .4 1.4 0s.4-1 0-1.4L9 7.2V4c0-.6-.4-1-1-1Z" />
    </svg>
  )

  const PlaneIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M15.7 7.3l-6-6c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L13.6 8l-5.3 5.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l6-6c.4-.4.4-1 0-1.4Z" />
      <path d="M8 1C3.6 1 0 4.6 0 9s3.6 8 8 8c.6 0 1-.4 1-1s-.4-1-1-1c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6c0 .6.4 1 1 1s1-.4 1-1c0-4.4-3.6-8-8-8Z" />
    </svg>
  )

  // 메뉴 그룹 설정
  const menuGroups: PageSidebarMenuGroup[] = [
    {
      // 제목이 없는 메인 그룹
      items: [
        { 
          label: '회의실 예약',
          href: '/calendar?tab=room_reservation',
          icon: CalendarIcon,
          isActive: activeTab === 'room_reservation'
        },
        { 
          label: '업무 차량 예약',
          href: '/calendar?tab=car_reservation',
          icon: CarIcon,
          isActive: activeTab === 'car_reservation'
        },
        { 
          label: '일정 조회',
          href: '/calendar?tab=schedule',
          icon: ScheduleIcon,
          isActive: activeTab === 'schedule'
        },
        { 
          label: '출장자 현황',
          href: '/calendar?tab=business_trip',
          icon: PlaneIcon,
          isActive: activeTab === 'business_trip'
        }
      ]
    }
  ]

  // 액션 버튼 (필요시 추가)
  const actionButton = (
    <button className="btn md:w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
      새 예약
    </button>
  )

  return (
    <PageSidebarMenu
      title="캘린더"
      menuGroups={menuGroups}
      activePath={pathname}
      actionButton={actionButton}
    />
  )
}