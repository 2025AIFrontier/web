'use client'

import React from 'react'
import Link from 'next/link'

export interface PageSidebarMenuItem {
  label: string
  href: string
  icon?: React.ReactNode
  isActive?: boolean
}

export interface PageSidebarMenuGroup {
  title?: string
  items: PageSidebarMenuItem[]
}

interface PageSidebarMenuProps {
  title: string
  menuGroups: PageSidebarMenuGroup[]
  activePath?: string // 현재 활성화된 경로
  actionButton?: React.ReactNode // 상단 액션 버튼 (옵션)
}

/**
 * 페이지 사이드바 메뉴 템플릿
 * 제목, 메뉴 그룹, 액션 버튼을 포함한 사이드바 메뉴 컴포넌트
 * 
 * @param title - 사이드바 상단 제목
 * @param menuGroups - 메뉴 그룹 배열 (각 그룹은 제목과 메뉴 아이템들을 포함)
 * @param activePath - 현재 활성화된 경로 (하이라이팅용)
 * @param actionButton - 상단에 표시할 액션 버튼 (옵션)
 */
export default function PageSidebarMenu({
  title,
  menuGroups,
  activePath,
  actionButton
}: PageSidebarMenuProps) {
  
  return (
    <>
      <div className="flex justify-between items-center md:block">
        {/* Title */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">{title}</h1>
        </header>

        {/* Action Button (mobile visible) */}
        {actionButton && (
          <div className="xl:hidden mb-6">
            {actionButton}
          </div>
        )}
      </div>

      {/* Menu Groups */}
      <div className="flex flex-nowrap overflow-x-scroll no-scrollbar md:block md:overflow-auto px-4 md:space-y-6 -mx-4">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Group Title (optional) */}
            {group.title && (
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-3">
                {group.title}
              </div>
            )}
            
            {/* Menu Items */}
            <ul className="flex flex-nowrap md:block mr-3 md:mr-0">
              {group.items.map((item, itemIndex) => {
                const isActive = item.isActive || (activePath && item.href === activePath)
                
                return (
                  <li key={itemIndex} className="mr-0.5 md:mr-0 md:mb-0.5">
                    <Link 
                      className={`flex items-center px-2.5 py-2 rounded-lg whitespace-nowrap ${
                        isActive ? 'bg-white dark:bg-gray-800' : ''
                      }`} 
                      href={item.href}
                    >
                      {/* Icon (optional) */}
                      {item.icon && (
                        <div className={`shrink-0 mr-2 ${
                          isActive ? '[&>svg]:text-violet-500' : '[&>svg]:text-gray-400 dark:[&>svg]:text-gray-500'
                        }`}>
                          {item.icon}
                        </div>
                      )}
                      
                      {/* Label */}
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-violet-500' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}