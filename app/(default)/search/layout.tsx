import PageSidebarLayout from '@/components/ui/page-sidebar-layout'
import SearchSidebarMenu from './search-sidebar-menu'

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-0 w-full max-w-[96rem] mx-auto">
      <PageSidebarLayout sidebarContent={<SearchSidebarMenu />}>
        {children}
      </PageSidebarLayout>
    </div>
  )
}