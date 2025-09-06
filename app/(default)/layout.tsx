import Sidebar from '@/components/ui/sidebar'
import Header from '@/components/ui/header'

export default function LV1Layout({
  children,
}: {
  children: React.ReactNode
}) {  
  return (
    <div className="flex h-[100dvh] overflow-hidden">

      {/* Sidebar - Level 1 Menu */}
      <Sidebar />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header />

        <main className="grow [&>*:first-child]:scroll-mt-16">
          {children}
        </main>        

      </div>

    </div>
  )
}
