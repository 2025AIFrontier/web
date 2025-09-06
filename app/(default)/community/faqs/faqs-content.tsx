export default function FaqsContent() {
  return (
    <>
      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">👋 무엇을 도와드릴까요?</h1>
      </div>

      {/* Search form */}
      <div className="mb-6">
        <form className="relative">
          <label htmlFor="action-search" className="sr-only">검색</label>
          <input id="action-search" className="form-input pl-9 py-3 dark:bg-gray-800 focus:border-gray-300 w-full" type="search" placeholder="질문을 검색하세요..." />
          <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
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
            <a className="text-violet-500 whitespace-nowrap" href="#0">인기 질문</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">계정</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">서비스</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">기술 지원</a>
          </li>
          <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap" href="#0">결제</a>
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
            <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">서비스를 어떻게 시작하나요?</h3>
          </header>
          <div className="pl-7">
            <div className="mb-2">회원가입 후 대시보드에서 원하는 서비스를 선택하여 시작할 수 있습니다. 각 서비스별 튜토리얼과 가이드가 제공되며, 필요시 고객지원팀의 도움을 받으실 수 있습니다.</div>
            <ul className="flex flex-wrap">
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">일반</a>
              </li>
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">시작하기</a>
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
            <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">무료 체험 기간이 있나요?</h3>
          </header>
          <div className="pl-7">
            <div className="mb-2">네, 모든 신규 회원에게 30일간의 무료 체험 기간을 제공합니다. 이 기간 동안 모든 기본 기능을 제한 없이 사용하실 수 있으며, 언제든지 유료 플랜으로 업그레이드하실 수 있습니다.</div>
            <ul className="flex flex-wrap">
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">결제</a>
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
            <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">데이터는 안전하게 보호되나요?</h3>
          </header>
          <div className="pl-7">
            <div className="mb-2">모든 데이터는 최신 암호화 기술로 보호되며, 정기적인 보안 감사를 통해 안전성을 유지합니다. 또한 GDPR 및 관련 규정을 준수하여 개인정보를 처리합니다.</div>
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
            <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">플랜을 변경하거나 취소할 수 있나요?</h3>
          </header>
          <div className="pl-7">
            <div className="mb-2">언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 취소를 원하시는 경우 다음 결제일 전까지 서비스를 이용하실 수 있으며, 자동으로 갱신되지 않습니다.</div>
            <ul className="flex flex-wrap">
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">계정</a>
              </li>
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">결제</a>
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
            <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">API를 통한 연동이 가능한가요?</h3>
          </header>
          <div className="pl-7">
            <div className="mb-2">네, RESTful API와 GraphQL을 통해 다양한 서비스와 연동할 수 있습니다. 자세한 API 문서와 SDK가 제공되며, 개발자 포털에서 테스트 환경도 이용하실 수 있습니다.</div>
            <ul className="flex flex-wrap">
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">개발</a>
              </li>
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">API</a>
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
            <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold">고객 지원은 어떻게 받을 수 있나요?</h3>
          </header>
          <div className="pl-7">
            <div className="mb-2">24/7 실시간 채팅, 이메일, 전화 지원을 제공합니다. 또한 커뮤니티 포럼과 상세한 도움말 센터를 통해 빠르게 답변을 찾으실 수 있습니다.</div>
            <ul className="flex flex-wrap">
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">지원</a>
              </li>
              <li className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-gray-400 dark:after:text-gray-600 after:px-2">
                <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">연락처</a>
              </li>
            </ul>
          </div>
        </article>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <div className="flex justify-end">
          <a className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" href="#0">모든 질문 보기 -&gt;</a>
        </div>
      </div>
    </>
  )
}