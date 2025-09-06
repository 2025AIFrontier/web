'use client'

import React from 'react'

interface PageSidebarLayoutProps {
  children: React.ReactNode
  sidebarContent?: React.ReactNode
  sidebarWidth?: string // 기본값: 메인 사이드바와 동일한 너비
  contentPadding?: string // 기본값: 메인 콘텐츠와 동일한 패딩
}

/**
 * 페이지 사이드바 레이아웃 템플릿
 * 좌측 사이드바와 메인 콘텐츠 영역으로 구성된 표준 레이아웃
 * 메인 사이드바와 동일한 너비와 패딩 적용
 * 
 * @param children - 메인 콘텐츠 영역에 표시될 내용
 * @param sidebarContent - 좌측 사이드바에 표시될 내용 (메뉴, 네비게이션 등)
 * @param sidebarWidth - 사이드바 너비 커스터마이징 (옵션)
 * @param contentPadding - 콘텐츠 영역 패딩 커스터마이징 (옵션)
 */
export default function PageSidebarLayout({
  children,
  sidebarContent,
  sidebarWidth = 'w-52', // 너비를 64에서 48로 줄임 (256px → 192px)
  contentPadding = 'pl-4' // 페이지 사이드바와 콘텐츠 사이의 패딩
}: PageSidebarLayoutProps) {
  
  return (
    <div className="md:flex flex-1">
      {/* Left Page Sidebar - 메인 사이드바와 완전히 붙어있도록 수정 */}
      {sidebarContent && (
        <div className={`${sidebarWidth} shrink-0 py-4 pr-0 pl-0 mb-8 md:mb-0`}>
          <div className="h-full overflow-y-auto no-scrollbar pl-0">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area - 페이지 사이드바와의 패딩 유지 */}
      <div className={`flex-1 ${sidebarContent ? contentPadding : ''}`}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}