export const metadata = {
  title: '자주 묻는 질문 - Mosaic',
  description: 'Page description',
}

export default function CommunityFaqs() {
  return (
    <div className="relative bg-white dark:bg-gray-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">

        <div className="max-w-3xl m-auto">

          {/* Page title */}
          <div className="mb-5">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">👋 오늘은 어떻게 도와드릴까요?</h1>
          </div>

          {/* Search form */}
          <div className="mb-6">
            <form className="relative">
              <label htmlFor="action-search" className="sr-only">검색</label>
              <input id="action-search" className="form-input pl-9 py-3 dark:bg-gray-800 focus:border-gray-300 w-full" type="search" placeholder="질문을 검색해보세요..." />
              <button className="absolute inset-0 right-auto group" type="submit" aria-label="검색">
                <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-3 mr-2" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Filters */}
          <div className="mb-8 border-b border-gray-200 dark:border-gray-700/60">
            <ul className="text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
              <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                <a className="text-violet-500 whitespace-nowrap" href="#0">인기</a>
              </li>
              <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">접근성</a>
              </li>
              <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">마케팅</a>
              </li>
              <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">개발</a>
              </li>
              <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
                <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">계정</a>
              </li>
            </ul>
          </div>

          {/* Posts */}
          <div>
            <h2 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-4">자주 묻는 질문</h2>
            
            {/* Post */}
            <article className="py-4 border-b border-gray-200 dark:border-gray-700/60">
              <header className="flex items-start mb-2">
                <div className="mt-2 mr-3">
                  <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
                    <path className="text-violet-300" d="M4 8H0v4.9c0 1 .7 1.9 1.7 2.1 1.2.2 2.3-.8 2.3-2V8z" />
                    <path className="text-violet-500" d="M15 1H7c-.6 0-1 .4-1 1v11c0 .7-.2 1.4-.6 2H13c1.7 0 3-1.3 3-3V2c0-.6-.4-1-1-1z" />
                  </svg>
                </div>
                <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">세 가지 버전의 차이점은 무엇인가요?</h3>
              </header>
              <div className="pl-7">
                <div className="mb-2">각 버전은 다양한 요구사항에 맞춘 기능을 제공합니다. 기본적인 기능부터 전문적인 도구까지 단계별로 업그레이드할 수 있습니다.</div>
                <ul className="flex flex-wrap">
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">일반</a>
                  </li>
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">플랜</a>
                  </li>
                </ul>
              </div>
            </article>

            {/* Post */}
            <article className="py-4 border-b border-gray-200 dark:border-gray-700/60">
              <header className="flex items-start mb-2">
                <div className="mt-2 mr-3">
                  <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
                    <path className="text-violet-300" d="M4 8H0v4.9c0 1 .7 1.9 1.7 2.1 1.2.2 2.3-.8 2.3-2V8z" />
                    <path className="text-violet-500" d="M15 1H7c-.6 0-1 .4-1 1v11c0 .7-.2 1.4-.6 2H13c1.7 0 3-1.3 3-3V2c0-.6-.4-1-1-1z" />
                  </svg>
                </div>
                <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">베이직과 플러스 라이선스의 차이점은 무엇인가요?</h3>
              </header>
              <div className="pl-7">
                <div className="mb-2">베이직 라이선스는 기본 기능을 제공하며, 플러스 라이선스는 고급 기능과 추가 도구를 포함합니다. 더 나은 협업과 분석 기능을 원하시면 플러스를 추천합니다.</div>
                <ul className="flex flex-wrap">
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">플랜</a>
                  </li>
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">라이선스</a>
                  </li>
                </ul>
              </div>
            </article>

            {/* Post */}
            <article className="py-4 border-b border-gray-200 dark:border-gray-700/60">
              <header className="flex items-start mb-2">
                <div className="mt-2 mr-3">
                  <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
                    <path className="text-violet-300" d="M4 8H0v4.9c0 1 .7 1.9 1.7 2.1 1.2.2 2.3-.8 2.3-2V8z" />
                    <path className="text-violet-500" d="M15 1H7c-.6 0-1 .4-1 1v11c0 .7-.2 1.4-.6 2H13c1.7 0 3-1.3 3-3V2c0-.6-.4-1-1-1z" />
                  </svg>
                </div>
                <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">더 궁금한 사항이 있나요?</h3>
              </header>
              <div className="pl-7">
                <div className="mb-2">답변을 찾지 못하셨나요? 언제든지 <a className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">문의하기</a>를 통해 연락주시면 신속하게 도와드리겠습니다.</div>
                <ul className="flex flex-wrap">
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">고객지원</a>
                  </li>
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">문의</a>
                  </li>
                </ul>
              </div>
            </article>

            {/* Post */}
            <article className="py-4 border-b border-gray-200 dark:border-gray-700/60">
              <header className="flex items-start mb-2">
                <div className="mt-2 mr-3">
                  <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
                    <path className="text-violet-300" d="M4 8H0v4.9c0 1 .7 1.9 1.7 2.1 1.2.2 2.3-.8 2.3-2V8z" />
                    <path className="text-violet-500" d="M15 1H7c-.6 0-1 .4-1 1v11c0 .7-.2 1.4-.6 2H13c1.7 0 3-1.3 3-3V2c0-.6-.4-1-1-1z" />
                  </svg>
                </div>
                <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">개인정보가 안전하게 보호되나요?</h3>
              </header>
              <div className="pl-7">
                <div className="mb-2">네, 모든 개인정보는 최고 수준의 보안 기술로 보호됩니다. 데이터는 암호화되어 저장되며, 엄격한 접근 통제를 통해 안전하게 관리됩니다.</div>
                <ul className="flex flex-wrap">
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">보안</a>
                  </li>
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">개인정보</a>
                  </li>
                </ul>
              </div>
            </article>

            {/* Post */}
            <article className="py-4 border-b border-gray-200 dark:border-gray-700/60">
              <header className="flex items-start mb-2">
                <div className="mt-2 mr-3">
                  <svg className="shrink-0 fill-current" width="16" height="16" viewBox="0 0 16 16">
                    <path className="text-violet-300" d="M4 8H0v4.9c0 1 .7 1.9 1.7 2.1 1.2.2 2.3-.8 2.3-2V8z" />
                    <path className="text-violet-500" d="M15 1H7c-.6 0-1 .4-1 1v11c0 .7-.2 1.4-.6 2H13c1.7 0 3-1.3 3-3V2c0-.6-.4-1-1-1z" />
                  </svg>
                </div>
                <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">이 제품으로 무엇을 만들 수 있나요?</h3>
              </header>
              <div className="pl-7">
                <div className="mb-2">다양한 비즈니스 솔루션을 구축할 수 있습니다. 대시보드, 분석 도구, 커뮤니티 플랫폼 등 필요에 맞는 커스텀 애플리케이션을 제작하세요.</div>
                <ul className="flex flex-wrap">
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">기능</a>
                  </li>
                  <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">활용</a>
                  </li>
                </ul>
              </div>
            </article>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <div className="flex justify-end">
              <a className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" href="#0">모든 질문 보기 →</a>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}