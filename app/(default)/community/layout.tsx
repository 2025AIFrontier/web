'use client'

import { usePathname } from 'next/navigation'
import PageSidebarLayout from '@/components/ui/page-sidebar-layout'
import PageSidebarMenu, { PageSidebarMenuGroup } from '@/components/ui/page-sidebar-menu'
import ForumRightContent from './forum/forum-right-content'

export default function LV2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // 현재 경로에 따라 활성 페이지 결정
  const getActivePage = () => {
    if (pathname.includes('/community/faqs')) return 'faqs'
    if (pathname.includes('/community/aggregation')) return 'aggregation'
    if (pathname.includes('/community/qna')) return 'qna'
    if (pathname.includes('/community/ai-tips')) return 'ai-tips'
    return 'announcements' // 기본값 (forum)
  }

  // 아이콘 컴포넌트들
  const HeartIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M14.682 2.318A4.485 4.485 0 0 0 11.5 1 4.377 4.377 0 0 0 8 2.707 4.383 4.383 0 0 0 4.5 1a4.5 4.5 0 0 0-3.182 7.682L8 15l6.682-6.318a4.5 4.5 0 0 0 0-6.364Zm-1.4 4.933L8 12.247l-5.285-5A2.5 2.5 0 0 1 4.5 3c1.437 0 2.312.681 3.5 2.625C9.187 3.681 10.062 3 11.5 3a2.5 2.5 0 0 1 1.785 4.251h-.003Z" />
    </svg>
  )

  const StackIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M5 9a1 1 0 1 1 0-2h6a1 1 0 0 1 0 2H5ZM1 4a1 1 0 1 1 0-2h14a1 1 0 0 1 0 2H1Zm0 10a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2H1Z" />
    </svg>
  )

  const ChartIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M1 12a1 1 0 0 1-.707-1.704l4.496-4.493a1 1 0 0 1 1.413 0l3.29 3.287 4.79-4.785a1 1 0 1 1 1.413 1.412l-5.496 5.491a1 1 0 0 1-1.413 0L5.496 7.92l-3.79 3.787A1 1 0 0 1 .999 12Z" />
    </svg>
  )

  const QuestionIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zm-.001-9a2 2 0 00-1.875 2.625.5.5 0 10.936-.35c.076-.202.239-.425.439-.425a.5.5 0 010 1 .5.5 0 00-.5.5v1.5a.5.5 0 001 0V9c.809-.265 1.5-1.017 1.5-2a2 2 0 00-1.5-2zm-.499 6a.75.75 0 100 1.5.75.75 0 000-1.5z" />
    </svg>
  )

  const BulbIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm.5-8.5v2h2a.5.5 0 010 1h-2v2a.5.5 0 01-1 0v-2h-2a.5.5 0 010-1h2v-2a.5.5 0 011 0z" />
    </svg>
  )

  // 색상 표시를 위한 원형 아이콘 (My Groups용)
  const CircleIcon = ({ color }: { color: string }) => (
    <svg className={`w-3 h-3 shrink-0 fill-current ${color} mr-3`} viewBox="0 0 12 12">
      <path d="M6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2A6 6 0 1 1 6 0a6 6 0 0 1 0 12Z" />
    </svg>
  )

  // 메뉴 그룹 설정
  const menuGroups: PageSidebarMenuGroup[] = [
    {
      // 제목이 없는 메인 그룹
      items: [
        {
          label: '공지사항',
          href: '/community/forum',
          icon: HeartIcon,
          isActive: getActivePage() === 'announcements'
        },
        {
          label: '취합',
          href: '/community/aggregation',
          icon: StackIcon,
          isActive: getActivePage() === 'aggregation'
        },
        {
          label: '묻고 답하기',
          href: '/community/qna',
          icon: ChartIcon,
          isActive: getActivePage() === 'qna'
        },
        {
          label: '자주묻는질문',
          href: '/community/faqs',
          icon: QuestionIcon,
          isActive: getActivePage() === 'faqs'
        },
        {
          label: 'AI 활용정보',
          href: '/community/ai-tips',
          icon: BulbIcon,
          isActive: getActivePage() === 'ai-tips'
        }
      ]
    },
    {
      title: 'My Groups',
      items: [
        {
          label: 'Startups',
          href: '#0',
          icon: <CircleIcon color="text-green-500" />
        },
        {
          label: 'Javascript',
          href: '#0',
          icon: <CircleIcon color="text-red-500" />
        },
        {
          label: 'Productivity',
          href: '#0',
          icon: <CircleIcon color="text-yellow-500" />
        }
      ]
    }
  ]

  // 액션 버튼
  const actionButton = (
    <button className="btn md:w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
      Create Post
    </button>
  )

  // 사이드바 콘텐츠 생성
  const sidebarContent = (
    <PageSidebarMenu
      title="커뮤니티"
      menuGroups={menuGroups}
      activePath={pathname}
      actionButton={actionButton}
    />
  )

  // 전체 레이아웃 구조 (좌측 사이드바 + 메인 콘텐츠 + 우측 사이드바)
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-0 w-full max-w-[96rem] mx-auto">
      <div className="xl:flex">
        {/* PageSidebarLayout으로 좌측 사이드바와 메인 콘텐츠 처리 */}
        <PageSidebarLayout
          sidebarContent={sidebarContent}
        >
          {children}
        </PageSidebarLayout>

        {/* Right content - Additional Info */}
        <ForumRightContent />
      </div>
    </div>
  )
}