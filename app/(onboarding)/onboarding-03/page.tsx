'use client'

import { useState, KeyboardEvent } from 'react'
import Link from 'next/link'
import OnboardingHeader from '../onboarding-header'
import OnboardingImage from '../onboarding-image'
import OnboardingProgress from '../onboarding-progress'

export default function Onboarding03() {
  const [tags, setTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        setTags([...tags, inputValue.trim()])
        setInputValue('')
      }
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  const addRecommendedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  // 추천 태그 목록 (관련도 순으로 정렬)
  const recommendedTags = [
    '원가절감',
    '공급업체관리',
    '계약협상',
    '품질관리',
    '재고최적화',
    'SCM',
    '구매전략수립',
    '리스크관리'
  ]

  return (
    <main className="bg-white dark:bg-gray-900">

      <div className="relative flex">

        {/* Content */}
        <div className="w-full md:w-1/2">

          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">

            <div className="flex-1">

              <OnboardingHeader />
              <OnboardingProgress step={3} />

            </div>

            <div className="px-4 py-8">
              <div className="max-w-md mx-auto">

                <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">담당 업무를 상세하게 적어주세요</h1>
                {/* htmlForm */}
                <form>
                  <div className="space-y-4 mb-8">
                    {/* Job Role */}
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="job-role">직무 <span className="text-red-500">*</span></label>
                      <select id="job-role" className="form-select w-full" defaultValue="">
                        <option value="" disabled>직무를 선택해주세요</option>
                        <option value="purchase-strategy">구매 전략</option>
                        <option value="procurement-purchase">조달 구매</option>
                        <option value="development-purchase">개발 구매</option>
                      </select>
                    </div>
                    {/* City and Postal Code */}
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1" htmlFor="city">City <span className="text-red-500">*</span></label>
                        <input id="city" className="form-input w-full" type="text" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1" htmlFor="postal-code">Postal Code <span className="text-red-500">*</span></label>
                        <input id="postal-code" className="form-input w-full" type="text" />
                      </div>
                    </div>
                    {/* Related Work */}
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="related-work">관련 업무 <span className="text-red-500">*</span></label>
                      <div className="min-h-[42px] form-input w-full flex flex-wrap items-center gap-2 py-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={tags.length === 0 ? "태그를 입력하고 스페이스나 엔터를 누르세요" : ""}
                          className="flex-1 min-w-[120px] outline-none bg-transparent"
                        />
                      </div>
                      {/* Recommended Tags */}
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">추천 태그:</p>
                        <div className="flex flex-wrap gap-1">
                          {recommendedTags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => addRecommendedTag(tag)}
                              disabled={tags.includes(tag)}
                              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                tags.includes(tag)
                                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer'
                              }`}
                            >
                              + {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="country">Country <span className="text-red-500">*</span></label>
                      <select id="country" className="form-select w-full">
                        <option>USA</option>
                        <option>Italy</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link className="text-sm underline hover:no-underline" href="/onboarding-02">&lt;- 이전</Link>
                    <Link className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white ml-auto" href="/onboarding-04">다음으로 -&gt;</Link>
                  </div>
                </form>

              </div>
            </div>

          </div>

        </div>

        <OnboardingImage />

      </div>

    </main>
  )
}
