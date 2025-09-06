export const metadata = {
  title: '자료실 - Mosaic',
  description: 'Resource Room page',
}

import SearchForm from '@/components/search-form'
import FilterButton from '@/components/dropdown-filter'
import ResourceCard from './resource-card'
import PaginationNumeric from '@/components/pagination-numeric'

import Image01 from '@/public/images/user-28-01.jpg'
import Image02 from '@/public/images/user-28-02.jpg'
import Image03 from '@/public/images/user-28-03.jpg'
import Image04 from '@/public/images/user-28-04.jpg'
import Image05 from '@/public/images/user-28-05.jpg'
import Image06 from '@/public/images/user-28-06.jpg'
import Image07 from '@/public/images/user-28-07.jpg'
import Image08 from '@/public/images/user-28-08.jpg'
import Image09 from '@/public/images/user-28-09.jpg'
import Image10 from '@/public/images/user-28-10.jpg'
import Image11 from '@/public/images/user-28-11.jpg'
import Image12 from '@/public/images/user-28-12.jpg'

export default function Resources() {

  // Some dummy resources data
  const resources = [
    {
      id: 0,
      category: '1',
      members: [
        {
          name: 'User 01',
          image: Image01,
          link: '#0'
        },
        {
          name: 'User 02',
          image: Image02,
          link: '#0'
        },
        {
          name: 'User 03',
          image: Image03,
          link: '#0'
        },
      ],
      title: 'AI 활용 가이드라인',
      link: '#0',
      content: 'AI 도구를 효과적으로 활용하기 위한 실무 가이드라인과 베스트 프랙티스를 제공합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '가이드'
    },
    {
      id: 1,
      category: '2',
      members: [
        {
          name: 'User 04',
          image: Image04,
          link: '#0'
        },
        {
          name: 'User 05',
          image: Image05,
          link: '#0'
        },
      ],
      title: '프로젝트 템플릿 모음',
      link: '#0',
      content: '다양한 프로젝트에서 활용 가능한 표준 템플릿과 양식을 제공합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '템플릿'
    },
    {
      id: 3,
      category: '3',
      members: [
        {
          name: 'User 07',
          image: Image07,
          link: '#0'
        },
        {
          name: 'User 08',
          image: Image08,
          link: '#0'
        },
        {
          name: 'User 09',
          image: Image09,
          link: '#0'
        },
      ],
      title: '업무 프로세스 매뉴얼',
      link: '#0',
      content: '효율적인 업무 처리를 위한 표준 프로세스와 절차를 상세히 안내합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '매뉴얼'
    },
    {
      id: 4,
      category: '1',
      members: [
        {
          name: 'User 10',
          image: Image10,
          link: '#0'
        },
      ],
      title: '데이터 분석 도구 소개',
      link: '#0',
      content: '업무에 활용 가능한 다양한 데이터 분석 도구와 활용 방법을 소개합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '도구'
    },
    {
      id: 5,
      category: '4',
      members: [
        {
          name: 'User 11',
          image: Image11,
          link: '#0'
        },
        {
          name: 'User 05',
          image: Image05,
          link: '#0'
        },
        {
          name: 'User 12',
          image: Image12,
          link: '#0'
        },
      ],
      title: '협업 도구 활용법',
      link: '#0',
      content: '팀 협업을 위한 다양한 도구의 효과적인 활용 방법을 제시합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '가이드'
    },
    {
      id: 6,
      category: '2',
      members: [
        {
          name: 'User 07',
          image: Image07,
          link: '#0'
        },
        {
          name: 'User 04',
          image: Image04,
          link: '#0'
        },
        {
          name: 'User 11',
          image: Image11,
          link: '#0'
        },
      ],
      title: '보고서 작성 가이드',
      link: '#0',
      content: '효과적인 보고서 작성을 위한 구조, 양식, 작성 요령을 안내합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '가이드'
    },
    {
      id: 7,
      category: '4',
      members: [
        {
          name: 'User 01',
          image: Image01,
          link: '#0'
        },
        {
          name: 'User 02',
          image: Image02,
          link: '#0'
        },
        {
          name: 'User 06',
          image: Image06,
          link: '#0'
        },
      ],
      title: '프레젠테이션 템플릿',
      link: '#0',
      content: '다양한 상황에 맞는 프레젠테이션 템플릿과 디자인 가이드를 제공합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '템플릿'
    },
    {
      id: 8,
      category: '1',
      members: [
        {
          name: 'User 09',
          image: Image09,
          link: '#0'
        },
        {
          name: 'User 01',
          image: Image01,
          link: '#0'
        },
      ],
      title: '업무 자동화 스크립트',
      link: '#0',
      content: '반복적인 업무를 자동화할 수 있는 스크립트와 매크로를 제공합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '도구'
    },
    {
      id: 9,
      category: '3',
      members: [
        {
          name: 'User 07',
          image: Image07,
          link: '#0'
        },
        {
          name: 'User 08',
          image: Image08,
          link: '#0'
        },
        {
          name: 'User 09',
          image: Image09,
          link: '#0'
        },
        {
          name: 'User 06',
          image: Image06,
          link: '#0'
        },
      ],
      title: '회의 진행 가이드',
      link: '#0',
      content: '효율적인 회의 진행을 위한 준비, 진행, 후속 조치 가이드라인입니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '가이드'
    },
    {
      id: 10,
      category: '4',
      members: [
        {
          name: 'User 06',
          image: Image06,
          link: '#0'
        },
        {
          name: 'User 11',
          image: Image11,
          link: '#0'
        },
      ],
      title: '품질 관리 체크리스트',
      link: '#0',
      content: '프로젝트 품질 관리를 위한 단계별 체크리스트와 검증 방법을 제공합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '체크리스트'
    },
    {
      id: 11,
      category: '2',
      members: [
        {
          name: 'User 05',
          image: Image05,
          link: '#0'
        },
      ],
      title: '계약서 표준 양식',
      link: '#0',
      content: '다양한 유형의 계약서 표준 양식과 작성 가이드를 제공합니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '양식'
    },
    {
      id: 12,
      category: '3',
      members: [
        {
          name: 'User 07',
          image: Image07,
          link: '#0'
        },
        {
          name: 'User 08',
          image: Image08,
          link: '#0'
        },
        {
          name: 'User 09',
          image: Image09,
          link: '#0'
        },
      ],
      title: '신입사원 온보딩 자료',
      link: '#0',
      content: '신입사원의 빠른 적응을 돕는 온보딩 프로그램과 교육 자료입니다.',
      dates: {
        from: 'Jan 20',
        to: 'Jan 27'
      },
      type: '교육자료'
    },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">

      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">

        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">자료실</h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Search form */}
          <SearchForm />
          {/* Filter button */}
          <FilterButton align="right" />
          {/* Create resource button */}
          <div className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
            <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="max-xs:sr-only">자료 추가</span>
          </div>
        </div>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        {resources.map(resource => (
          <ResourceCard
            key={resource.id}
            resource={resource} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <PaginationNumeric />
      </div>

    </div>
  )
}