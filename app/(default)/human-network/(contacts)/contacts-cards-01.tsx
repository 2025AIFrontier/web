export default function ContactsCards01() {
  return (
    <>
      {/* Card 1 */}
      <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-col h-full p-5">
          {/* Avatar */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
              김
            </div>
            <div className="ml-3">
              <h3 className="text-lg text-gray-800 dark:text-gray-100 font-semibold">김민수</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">경영지원팀 팀장</p>
            </div>
          </div>
          {/* Contact Info */}
          <div className="grow space-y-2">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">minsu.kim@company.com</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">02-1234-5678</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">본관 5층</span>
            </div>
          </div>
          {/* Action */}
          <div className="mt-4">
            <button className="btn-sm w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">연락하기</button>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-col h-full p-5">
          {/* Avatar */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              이
            </div>
            <div className="ml-3">
              <h3 className="text-lg text-gray-800 dark:text-gray-100 font-semibold">이정희</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">경영지원팀 차장</p>
            </div>
          </div>
          {/* Contact Info */}
          <div className="grow space-y-2">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">junghee.lee@company.com</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">02-1234-5679</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">본관 5층</span>
            </div>
          </div>
          {/* Action */}
          <div className="mt-4">
            <button className="btn-sm w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">연락하기</button>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-col h-full p-5">
          {/* Avatar */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg">
              박
            </div>
            <div className="ml-3">
              <h3 className="text-lg text-gray-800 dark:text-gray-100 font-semibold">박서준</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">경영지원팀 과장</p>
            </div>
          </div>
          {/* Contact Info */}
          <div className="grow space-y-2">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">seojun.park@company.com</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">02-1234-5680</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">본관 5층</span>
            </div>
          </div>
          {/* Action */}
          <div className="mt-4">
            <button className="btn-sm w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">연락하기</button>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-col h-full p-5">
          {/* Avatar */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
              최
            </div>
            <div className="ml-3">
              <h3 className="text-lg text-gray-800 dark:text-gray-100 font-semibold">최지우</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">경영지원팀 대리</p>
            </div>
          </div>
          {/* Contact Info */}
          <div className="grow space-y-2">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">jiwoo.choi@company.com</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">02-1234-5681</span>
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400">본관 5층</span>
            </div>
          </div>
          {/* Action */}
          <div className="mt-4">
            <button className="btn-sm w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">연락하기</button>
          </div>
        </div>
      </div>
    </>
  )
}