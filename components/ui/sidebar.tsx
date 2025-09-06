'use client'

import { useAppProvider } from '@/app/app-provider'
import { useSelectedLayoutSegments } from 'next/navigation'
import Logo from './logo'
import SidebarMenuTemplate from './sidebar-menu-template'
import { menuGroups } from './sidebar-menu-config'

export default function Sidebar({
  variant = 'default',
}: {
  variant?: 'default' | 'v2'
}) {
  const { sidebarExpanded, setSidebarExpanded } = useAppProvider()
  const segments = useSelectedLayoutSegments()

  return (
    <div className={`min-w-fit ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`flex flex-col h-[100dvh] overflow-y-auto no-scrollbar w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white dark:bg-gray-800 py-4 pl-4 pr-0 transition-all duration-200 ease-in-out ${
          variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'
        }`}
      >
        {/* Sidebar header */}
        <div className="mb-10 px-2">
          <Logo />
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Menu Groups */}
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
                <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                  •••
                </span>
                <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">{group.title}</span>
              </h3>
              <ul className="mt-3">
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuTemplate
                    key={itemIndex}
                    label={item.label}
                    segment={item.segment}
                    icon={item.icon}
                    href={item.href}
                    subItems={item.subItems}
                    segments={segments}
                  />
                ))}
              </ul>
            </div>
          ))}

          {/* Expand / collapse button */}
          <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
            <div className="w-12 pl-4 pr-3 py-2">
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
              >
                <span className="sr-only">Expand / collapse sidebar</span>
                <svg 
                  className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16"
                >
                  <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}