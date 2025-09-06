'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import PageSidebarMenu, { PageSidebarMenuGroup } from '@/components/ui/page-sidebar-menu'

export default function SearchSidebarMenu() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const tabParam = searchParams.get('tab')
  // pathname이 exchange일 경우 activeTab을 null로 설정
  const activeTab = pathname.includes('/exchange') ? null : (tabParam || 'employee')

  // 아이콘 컴포넌트들
  const UserIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6Z" />
      <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM8 10c-2.2 0-4 1.1-4 2.5V14h8v-1.5c0-1.4-1.8-2.5-4-2.5Z" />
    </svg>
  )

  const BuildingIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H3Zm1 2h2v2H4V2Zm4 0h2v2H8V2Zm-4 4h2v2H4V6Zm4 0h2v2H8V6Zm-4 4h2v2H4v-2Zm4 0h2v2H8v-2Z" />
    </svg>
  )

  const ContactIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M3 5h2V3H3v2Zm0 4h2V7H3v2Zm0 4h2v-2H3v2ZM15 3H7v2h8V3Zm0 4H7v2h8V7Zm0 4H7v2h8v-2Z" />
    </svg>
  )

  const ExchangeIcon = (
    <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
      <path d="M0 4.5A1.5 1.5 0 011.5 3h13A1.5 1.5 0 0116 4.5v2A1.5 1.5 0 0114.5 8H9v1h3.5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H9v1h5.5A1.5 1.5 0 0116 13.5v2a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 010 15.5v-2A1.5 1.5 0 011.5 12H7v-1H3.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H7V8H1.5A1.5 1.5 0 010 6.5v-2zm1.5-.5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5h-13zM14.5 13h-13a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5z" />
    </svg>
  )

  // 메뉴 그룹 설정
  const menuGroups: PageSidebarMenuGroup[] = [
    {
      title: '사내',
      items: [
        { 
          label: '담당자 조회',
          href: '/search?tab=employee',
          icon: UserIcon,
          isActive: activeTab === 'employee'
        }
      ]
    },
    {
      title: '협력사',
      items: [
        {
          label: '협력사 조회',
          href: '/search?tab=partner',
          icon: BuildingIcon,
          isActive: activeTab === 'partner'
        },
        {
          label: '담당자 조회',
          href: '/search?tab=partner-contact',
          icon: ContactIcon,
          isActive: activeTab === 'partner-contact'
        }
      ]
    },
    {
      title: '글로벌',
      items: [
        {
          label: '환율 조회',
          href: '/search/exchange',
          icon: ExchangeIcon,
          isActive: pathname === '/search/exchange'
        }
      ]
    }
  ]

  return (
    <PageSidebarMenu
      title="조회"
      menuGroups={menuGroups}
      activePath={pathname}
    />
  )
}