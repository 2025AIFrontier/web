export const metadata = {
  title: 'AI 활용정보',
  description: 'AI 도구 활용 팁과 가이드',
}

export default function AITips() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">AI 활용정보</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">업무 효율을 높이는 AI 도구 활용법을 공유합니다</p>
      </div>

      {/* Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        
        {/* ChatGPT */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-t from-green-600 to-green-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-3">ChatGPT 활용법</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">효과적인 프롬프트 작성법과 업무 활용 사례</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">문서 작성 및 번역</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">코드 리뷰 및 디버깅</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">아이디어 브레인스토밍</span>
            </li>
          </ul>
        </div>

        {/* Claude */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-t from-amber-600 to-amber-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-3">Claude 활용법</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">긴 문서 분석과 복잡한 작업 처리 방법</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">대용량 파일 분석</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">복잡한 코드 작성</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">상세한 연구 및 분석</span>
            </li>
          </ul>
        </div>

        {/* Copilot */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-t from-blue-600 to-blue-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-3">GitHub Copilot</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">AI 페어 프로그래밍으로 개발 생산성 향상</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">자동 코드 완성</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">테스트 코드 생성</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">문서화 자동화</span>
            </li>
          </ul>
        </div>

        {/* Midjourney */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-t from-purple-600 to-purple-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-3">Midjourney/DALL-E</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">AI 이미지 생성 도구 활용법</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">프레젠테이션 이미지</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">마케팅 자료 제작</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">프로토타입 디자인</span>
            </li>
          </ul>
        </div>

        {/* Perplexity */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-t from-indigo-600 to-indigo-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-3">Perplexity AI</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">AI 기반 검색 엔진으로 정확한 정보 탐색</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">실시간 정보 검색</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">출처 기반 답변</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">시장 조사 및 분석</span>
            </li>
          </ul>
        </div>

        {/* MS Copilot */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-t from-cyan-600 to-cyan-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-3">MS Copilot</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Office 365와 통합된 AI 어시스턴트</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">Excel 데이터 분석</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">PowerPoint 자동화</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">Teams 회의 요약</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Recent Tips */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <div className="px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">최근 업데이트된 팁</h2>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700/60">
          
          {/* Tip Item */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  ChatGPT로 회의록 작성 자동화하기
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  음성 녹음 파일을 텍스트로 변환 후 ChatGPT를 활용한 요약 및 액션 아이템 추출 방법
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded">ChatGPT</span>
                  <span className="mx-2">•</span>
                  <span>2024.01.15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Item */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  Claude를 활용한 코드 리팩토링 전략
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  레거시 코드를 모던한 패턴으로 개선하는 단계별 접근 방법과 프롬프트 템플릿
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded">Claude</span>
                  <span className="mx-2">•</span>
                  <span>2024.01.14</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Item */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  Midjourney v6 프롬프트 최적화 가이드
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  새로운 버전에 최적화된 프롬프트 작성법과 스타일 참조 방법
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded">Midjourney</span>
                  <span className="mx-2">•</span>
                  <span>2024.01.13</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Item */}
          <div className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  GitHub Copilot으로 테스트 코드 자동 생성하기
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  유닛 테스트와 통합 테스트를 효율적으로 작성하는 Copilot 활용 팁
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded">Copilot</span>
                  <span className="mx-2">•</span>
                  <span>2024.01.12</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl p-6 mt-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            AI 활용 팁을 공유해주세요!
          </h3>
          <p className="text-violet-100 mb-4">
            업무에 도움이 되는 AI 활용법을 동료들과 공유하여 함께 성장해요
          </p>
          <button className="btn bg-white text-violet-600 hover:bg-gray-50">
            팁 작성하기
          </button>
        </div>
      </div>

    </div>
  )
}