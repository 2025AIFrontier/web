/**
 * 사이드바 메뉴 설정 파일
 * 모든 메뉴 아이템과 구조를 중앙에서 관리
 */

import React from 'react'

// 메뉴 아이템 타입 정의
export interface MenuItem {
  label: string
  segment: string
  icon?: React.ReactNode
  href?: string
  subItems?: {
    label: string
    href: string
  }[]
}

// 아이콘 컴포넌트들
const DashboardIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
    <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
  </svg>
)

// 아이콘 - 커뮤니티
const CommunityIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="3" cy="8" r="2" fill="currentColor"/>
    <circle cx="8" cy="3" r="2" fill="currentColor"/>
    <circle cx="13" cy="8" r="2" fill="currentColor"/>
    <circle cx="8" cy="13" r="2" fill="currentColor"/>
    <path d="M6.5 6.5L5 7.5M10 6.5L11.5 7.5M6.5 10L5 9M10 10L11.5 9" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// 아이콘 - 달력
const CalendarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M5 0a1 1 0 0 1 1 1v1h4V1a1 1 0 1 1 2 0v1h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2V1a1 1 0 0 1 1-1Zm9 6H2v8h12V6Z" />
  </svg>
)

// 아이콘 - 유틸리티
const UtilityIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
  </svg>
)

// 아이콘 - 조회
const SearchIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z" />
    <path d="m13.314 11.9-2.393-2.393a.999.999 0 0 0-1.414 0 .999.999 0 0 0 0 1.414l2.393 2.393a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414Z" />
  </svg>
)

// 메뉴 구성
export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    segment: 'dashboard',
    icon: DashboardIcon,
    href: '/dashboard'  // 부모도 클릭 가능
  },
  {
    label: '조회',
    segment: 'search',
    icon: SearchIcon,
    href: '/search'  // 부모 클릭 시 기본 페이지로 이동
  },
  {
    label: '캘린더',
    segment: 'calendar',
    icon: CalendarIcon,
    href: '/calendar'
  },
  {
    label: '커뮤니티',
    segment: 'community',
    icon: CommunityIcon,
    href: '/community/forum'  // 부모 클릭 시 기본 페이지로 이동
  },
  {
    label: '유틸리티',
    segment: 'utility',
    icon: UtilityIcon,
    subItems: [
      { label: 'PC 최적화', href: '/utility/pc-optimization' },
      { label: '뽀모도로 타이머', href: '/utility/pomodoro' }
    ]
  },
]

// 메뉴 그룹 설정 (선택사항)
export const menuGroups = [
  {
    title: 'Pages',
    items: menuItems
  },
  // 추가 그룹을 여기에 정의 가능
  // {
  //   title: '관리자 전용',
  //   items: adminMenuItems
  // }
]