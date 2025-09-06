'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SubMenuItem {
  label: string
  href: string
}

interface MenuItemProps {
  // 필수 속성
  label: string              // 메뉴 이름
  segment: string           // URL 세그먼트 (active 상태 체크용)
  
  // 선택적 속성
  icon?: React.ReactNode    // 아이콘 SVG
  href?: string            // 부모 메뉴의 링크
  subItems?: SubMenuItem[] // 하위 메뉴 항목들
}

/**
 * 사이드바 메뉴 아이템 템플릿
 * 부모/자식 구조를 가진 확장 가능한 메뉴 컴포넌트
 * 부모 메뉴도 클릭 가능하며, 자식이 없어도 동일한 구조 사용
 * 
 * @example
 * // 하위 메뉴가 있는 경우
 * <SidebarMenuTemplate
 *   label="Dashboard"
 *   segment="dashboard"
 *   icon={<DashboardIcon />}
 *   href="/dashboard"
 *   subItems={[
 *     { label: 'Main', href: '/dashboard' },
 *     { label: '환율', href: '/dashboard/exchange' }
 *   ]}
 *   segments={segments}
 * />
 * 
 * // 하위 메뉴가 없는 경우 (동일한 구조)
 * <SidebarMenuTemplate
 *   label="Calendar"
 *   segment="calendar"
 *   icon={<CalendarIcon />}
 *   href="/calendar"
 *   segments={segments}
 * />
 */
export default function SidebarMenuTemplate({ 
  label,
  segment,
  icon,
  href,
  subItems,
  segments
}: MenuItemProps & { segments: string[] }) {
  
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState<boolean>(segments.includes(segment))
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const isActive = segments.includes(segment)
  const hasSubItems = subItems && subItems.length > 0
  
  return (
    <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 ${
      isActive 
        ? 'bg-gradient-to-r from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]' 
        : ''
    }`}>
      <div className="flex items-center justify-between">
        {/* 부모 메뉴 링크 */}
        {href ? (
          <Link
            href={href}
            className={`flex-1 flex items-center text-gray-800 dark:text-gray-100 truncate transition ${
              isActive ? '' : 'hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center">
              {icon && (
                <div className={`shrink-0 fill-current ${
                  isActive ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {icon}
                </div>
              )}
              <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                {label}
              </span>
            </div>
          </Link>
        ) : (
          <div className={`flex-1 flex items-center text-gray-800 dark:text-gray-100 truncate ${
            isActive ? '' : 'hover:text-gray-900 dark:hover:text-white'
          }`}>
            <div className="flex items-center">
              {icon && (
                <div className={`shrink-0 fill-current ${
                  isActive ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {icon}
                </div>
              )}
              <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                {label}
              </span>
            </div>
          </div>
        )}
        
        {/* 확장/축소 버튼 (하위 메뉴가 있는 경우만) */}
        {hasSubItems && (
          <button
            onClick={handleToggle}
            className="flex shrink-0 p-1 ml-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"
            aria-label="Toggle submenu"
          >
            <svg 
              className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} 
              viewBox="0 0 12 12"
            >
              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
            </svg>
          </button>
        )}
      </div>
      
      {/* 하위 메뉴 */}
      {hasSubItems && (
        <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          <ul className={`pl-8 mt-2 ${!isOpen && 'hidden'}`}>
            {subItems.map((item, index) => (
              <li key={index} className="mb-2 last:mb-0">
                <Link 
                  href={item.href}
                  className={`block text-gray-800 dark:text-gray-100 transition truncate ${
                    pathname === item.href 
                      ? 'font-semibold text-violet-500' 
                      : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}