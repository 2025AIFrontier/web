export const metadata = {
  title: '사내 담당자 찾기 - Mosaic',
  description: '사내 담당자 검색 및 연락처 정보',
}

import ContactsCards01 from '../contacts-cards-01'
import ContactsCards02 from '../contacts-cards-02'
import ContactsCards03 from '../contacts-cards-03'

export default function Contacts() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="mb-5">

        {/* Title */}
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">사내 담당자 찾기</h1>

      </div>

      {/* Search form */}
      <div className="max-w-xl mb-5">
        <form className="relative">
          <label htmlFor="contact-search" className="sr-only">담당자 검색</label>
          <input id="contact-search" className="form-input w-full pl-9 py-3 bg-white dark:bg-gray-800" type="search" placeholder="이름, 부서, 직무로 검색" />
          <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
            <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-3 mr-2" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
              <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700/60">
        <ul className="text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-violet-500 whitespace-nowrap" href="#0">전체</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">경영지원</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">개발</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">영업</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">마케팅</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">인사</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">재무</a>
          </li>
        </ul>
      </div>

      {/* Page content */}
      <div>

        {/* Cards 1 (경영지원 팀) */}
        <div className="mt-8">
          <h2 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold mb-5">경영지원 팀</h2>
          <div className="grid grid-cols-12 gap-6">
            <ContactsCards01 />
          </div>
        </div>

        {/* Cards 2 (개발 팀) */}
        <div className="mt-8">
          <h2 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold mb-5">개발 팀</h2>
          <div className="grid grid-cols-12 gap-6">
            <ContactsCards02 />
          </div>
        </div>

        {/* Cards 3 (영업 팀) */}
        <div className="mt-8">
          <h2 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold mb-5">영업 팀</h2>
          <div className="grid grid-cols-12 gap-6">
            <ContactsCards03 />
          </div>
        </div>

      </div>
    </div>
  )
}