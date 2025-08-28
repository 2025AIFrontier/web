'use client'

import { useState } from 'react'

export default function EmployeesSidebar() {
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false)
  const [fullTimeOnly, setFullTimeOnly] = useState<boolean>(true)
  const [companySearch, setCompanySearch] = useState<string>('')
  const [showCompanyList, setShowCompanyList] = useState<boolean>(false)
  
  const companies = [
    '삼성전자',
    '삼성디스플레이',
    '삼성SDI',
    '삼성전기',
    'LG전자',
    'SK하이닉스',
    '현대자동차',
    '카카오',
    '네이버',
    '쿠팡'
  ]
  
  const filteredCompanies = companies.filter(company => 
    company.toLowerCase().includes(companySearch.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Alert Box */}
      <div className="relative bg-linear-to-r from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04] rounded-lg p-5">
        <div className="absolute bottom-0 -mb-3">
          <svg width="44" height="42" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
              <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ill-b">
                <stop stopColor="#B7ACFF" offset="0%" />
                <stop stopColor="#9C8CFF" offset="100%" />
              </linearGradient>
              <linearGradient x1="50%" y1="24.537%" x2="50%" y2="100%" id="ill-c">
                <stop stopColor="#4634B1" offset="0%" />
                <stop stopColor="#4634B1" stopOpacity="0" offset="100%" />
              </linearGradient>
              <path id="ill-a" d="m20 0 20 40-20-6.25L0 40z" />
            </defs>
            <g transform="scale(-1 1) rotate(-51 -11.267 67.017)" fill="none" fillRule="evenodd">
              <mask id="ill-d" fill="#fff">
                <use xlinkHref="#ill-a" />
              </mask>
              <use fill="url(#ill-b)" xlinkHref="#ill-a" />
              <path fill="url(#ill-c)" mask="url(#ill-d)" d="M20.586-7.913h25v47.5h-25z" />
            </g>
          </svg>
        </div>
        <div className="relative">
          <div className="text-sm font-medium text-gray-800 dark:text-violet-200 mb-2">빠른 연락처 찾기를 원하시나요?</div>
          <div className="text-right">
            <a className="text-sm font-medium text-violet-500 hover:text-violet-600" href="#0">
              즐겨찾기 설정 -&gt;
            </a>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5 min-w-[15rem]">
        <div className="grid md:grid-cols-2 xl:grid-cols-1 gap-6">
          
          {/* 회사 필터 */}
          <div className="relative">
            <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold mb-3">회사</div>
            <div className="relative">
              <input 
                type="text" 
                className="form-input w-full pl-9 text-sm"
                placeholder="회사명 검색..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                onFocus={() => setShowCompanyList(true)}
                onBlur={() => setTimeout(() => setShowCompanyList(false), 200)}
              />
              <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
                <svg className="w-4 h-4 shrink-0 fill-current text-gray-400 dark:text-gray-500 ml-3" viewBox="0 0 16 16">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </div>
              
              {/* 회사 리스트 드롭다운 */}
              {showCompanyList && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredCompanies.length > 0 ? (
                    <ul className="py-1">
                      {filteredCompanies.map((company, index) => (
                        <li key={index}>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setCompanySearch(company)
                              setShowCompanyList(false)
                            }}
                          >
                            {company}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      검색 결과가 없습니다
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* 부서 필터 */}
          <div>
            <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold mb-3">부서</div>
            <ul className="space-y-2">
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">개발팀</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">디자인팀</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">마케팅팀</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">영업팀</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">인사팀</span>
                </label>
              </li>
            </ul>
          </div>

          {/* 재직 상태 */}
          <div>
            <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold mb-3">재직 상태</div>
            <div className="flex items-center">
              <div className="form-switch">
                <input
                  type="checkbox"
                  id="status-toggle"
                  className="sr-only"
                  checked={fullTimeOnly}
                  onChange={() => setFullTimeOnly(!fullTimeOnly)}
                />
                <label htmlFor="status-toggle">
                  <span className="bg-white shadow-sm" aria-hidden="true"></span>
                  <span className="sr-only">재직자만</span>
                </label>
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500 italic ml-2">{fullTimeOnly ? '재직중' : '전체'}</div>
            </div>
            <div className="text-sm dark:text-gray-500 italic mt-3">현재 재직중인 직원만 표시</div>
          </div>

          {/* 직급 필터 */}
          <div>
            <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold mb-3">직급</div>
            <ul className="space-y-2">
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">임원</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">매니저</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">시니어</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium ml-2">주니어</span>
                </label>
              </li>
            </ul>
          </div>

          {/* 원격 근무 */}
          <div>
            <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold mb-3">원격 근무</div>
            <div className="flex items-center">
              <div className="form-switch">
                <input
                  type="checkbox"
                  id="remote-toggle"
                  className="sr-only"
                  checked={remoteOnly}
                  onChange={() => setRemoteOnly(!remoteOnly)}
                />
                <label htmlFor="remote-toggle">
                  <span className="bg-white shadow-sm" aria-hidden="true"></span>
                  <span className="sr-only">원격근무</span>
                </label>
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500 italic ml-2">{remoteOnly ? '원격' : '전체'}</div>
            </div>
            <div className="text-sm dark:text-gray-500 italic mt-3">원격 근무 가능한 직원 표시</div>
          </div>

        </div>
      </div>
    </div>
  )
}