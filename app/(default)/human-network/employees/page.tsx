export const metadata = {
  title: '사외 담당자 조회 - Mosaic',
  description: 'External contact lookup and management system',
}

import { SelectedItemsProvider } from '@/app/selected-items-context'
import EmployeesSidebar from './employees-sidebar'
import EmployeesTable from './employees-table'
import PaginationClassic from '@/components/pagination-classic'
import DropdownSort from './sort-dropdown'

import Image01 from '@/public/images/user-40-01.jpg'
import Image02 from '@/public/images/user-40-02.jpg'
import Image03 from '@/public/images/user-40-03.jpg'
import Image04 from '@/public/images/user-40-04.jpg'
import Image05 from '@/public/images/user-40-05.jpg'
import Image06 from '@/public/images/user-40-06.jpg'
import Image07 from '@/public/images/user-40-07.jpg'
import Image08 from '@/public/images/user-40-08.jpg'
import Image09 from '@/public/images/user-40-09.jpg'
import Image10 from '@/public/images/user-40-10.jpg'

function EmployeesContent() {
  // 샘플 직원 데이터 (추후 API 연동)
  const employees = [
    {
      id: 0,
      image: Image01,
      name: '김민수',
      department: '개발팀',
      role: '소프트웨어 개발',
      position: '시니어 개발자',
      email: 'minsu.kim@company.com',
      phone: '010-1234-5678',
      status: 'active'
    },
    {
      id: 1,
      image: Image02,
      name: '이영희',
      department: '디자인팀',
      role: 'UI/UX 디자인',
      position: 'UI/UX 디자이너',
      email: 'younghee.lee@company.com',
      phone: '010-2345-6789',
      status: 'active'
    },
    {
      id: 2,
      image: Image03,
      name: '박철수',
      department: '영업팀',
      role: '기업 영업',
      position: '영업 매니저',
      email: 'cheolsu.park@company.com',
      phone: '010-3456-7890',
      status: 'active'
    },
    {
      id: 3,
      image: Image04,
      name: '정수연',
      department: '인사팀',
      role: '인사 관리',
      position: 'HR 매니저',
      email: 'suyeon.jung@company.com',
      phone: '010-4567-8901',
      status: 'active'
    },
    {
      id: 4,
      image: Image05,
      name: '최준호',
      department: '개발팀',
      role: '프론트엔드 개발',
      position: '프론트엔드 개발자',
      email: 'junho.choi@company.com',
      phone: '010-5678-9012',
      status: 'active'
    },
    {
      id: 5,
      image: Image06,
      name: '강미나',
      department: '마케팅팀',
      role: '디지털 마케팅',
      position: '마케팅 전문가',
      email: 'mina.kang@company.com',
      phone: '010-6789-0123',
      status: 'away'
    },
    {
      id: 6,
      image: Image07,
      name: '윤성호',
      department: '개발팀',
      role: '백엔드 개발',
      position: '백엔드 개발자',
      email: 'sungho.yoon@company.com',
      phone: '010-7890-1234',
      status: 'active'
    },
    {
      id: 7,
      image: Image08,
      name: '임지우',
      department: '기획팀',
      role: '서비스 기획',
      position: '서비스 기획자',
      email: 'jiwoo.lim@company.com',
      phone: '010-8901-2345',
      status: 'active'
    },
    {
      id: 8,
      image: Image09,
      name: '한서진',
      department: '재무팀',
      role: '재무 분석',
      position: '재무 분석가',
      email: 'seojin.han@company.com',
      phone: '010-9012-3456',
      status: 'busy'
    },
    {
      id: 9,
      image: Image10,
      name: '오다은',
      department: '법무팀',
      role: '법무 지원',
      position: '법무 담당자',
      email: 'daeun.oh@company.com',
      phone: '010-0123-4567',
      status: 'active'
    }
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-5">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">사외 담당자 조회</h1>
        </div>
        {/* Right: Add button */}
        <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">담당자 추가</button>
      </div>

      {/* Page content */}
      <div className="flex flex-col space-y-10 sm:flex-row sm:space-x-6 sm:space-y-0 md:flex-col md:space-x-0 md:space-y-10 xl:flex-row xl:space-x-6 xl:space-y-0 mt-9">
        
        {/* Sidebar */}
        <EmployeesSidebar />

        {/* Content */}
        <div className="w-full">
          {/* Search form */}
          <div className="mb-5">
            <form className="relative">
              <label htmlFor="search" className="sr-only">Search</label>
              <input id="search" className="form-input w-full pl-9 bg-white dark:bg-gray-800" type="search" placeholder="이름, 회사, 직급으로 검색..." />
              <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-3 mr-2" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Employees header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">총 {employees.length}명의 담당자</div>
            {/* Sort */}
            <div className="text-sm">
              <span>정렬 기준 </span>
              <DropdownSort align="right" />
            </div>
          </div>

          {/* Employees Table */}
          <EmployeesTable employees={employees} />

          {/* Pagination */}
          <div className="mt-6">
            <PaginationClassic />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Employees() {
  return (
    <SelectedItemsProvider>
      <EmployeesContent />
    </SelectedItemsProvider>
  )
}