'use client'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamic import으로 employees 페이지 로드
const EmployeesPage = dynamic(() => import('./employees/page'), { ssr: false })

export default function SearchPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab = tabParam || 'employee'

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {activeTab === 'employee' && <EmployeesPage />}
      
      {activeTab === 'partner' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">협력사 조회</h2>
          <p className="text-gray-600 dark:text-gray-400">협력사 정보를 조회할 수 있습니다.</p>
        </div>
      )}
      
      {activeTab === 'partner-contact' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">협력사 담당자 조회</h2>
          <p className="text-gray-600 dark:text-gray-400">협력사 담당자 정보를 조회할 수 있습니다.</p>
        </div>
      )}
    </div>
  )
}