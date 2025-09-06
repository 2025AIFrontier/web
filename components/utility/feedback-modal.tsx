'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(3)
  const [feedback, setFeedback] = useState('')
  const [pageType, setPageType] = useState<'current' | 'other'>('current')
  const [currentPageUrl, setCurrentPageUrl] = useState('')
  const [customPageUrl, setCustomPageUrl] = useState('')

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setCurrentPageUrl(window.location.href)
    }
  }, [isOpen])

  const handleSubmit = () => {
    const pageUrl = pageType === 'current' ? currentPageUrl : customPageUrl
    // TODO: Handle feedback submission
    console.log('Feedback submitted:', { rating, feedback, pageUrl, pageType })
    onClose()
    // Reset form
    setRating(3)
    setFeedback('')
    setPageType('current')
    setCustomPageUrl('')
  }

  const handleCancel = () => {
    onClose()
    // Reset form
    setRating(3)
    setFeedback('')
    setPageType('current')
    setCustomPageUrl('')
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                <div className="p-6 space-y-6">
                  <div>
                    <Dialog.Title
                      as="h2"
                      className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-4"
                    >
                      VOC
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      이용 중 개선이 필요한 내용을 입력해주세요
                    </p>
                  </div>

                  {/* Page URL */}
                  <section>
                    <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold mb-4">
                      페이지
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pageType"
                            value="current"
                            checked={pageType === 'current'}
                            onChange={() => setPageType('current')}
                            className="form-radio text-violet-500"
                          />
                          <span className="ml-2 text-sm">현재 페이지</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pageType"
                            value="other"
                            checked={pageType === 'other'}
                            onChange={() => setPageType('other')}
                            className="form-radio text-violet-500"
                          />
                          <span className="ml-2 text-sm">다른 페이지</span>
                        </label>
                      </div>
                      
                      {pageType === 'current' ? (
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                            {currentPageUrl}
                          </p>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={customPageUrl}
                          onChange={(e) => setCustomPageUrl(e.target.value)}
                          placeholder="페이지 URL 또는 내용을 입력하세요"
                          className="form-input w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                        />
                      )}
                    </div>
                  </section>

                  {/* Rate */}
                  <section>
                    <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold mb-6">
                      만족도 평가
                    </h3>
                    <div className="w-full max-w-xl">
                      <div className="relative">
                        <div 
                          className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-gray-200 dark:bg-gray-700/60" 
                          aria-hidden="true"
                        ></div>
                        <ul className="relative flex justify-between w-full">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <li key={value} className="flex">
                              <button
                                type="button"
                                onClick={() => setRating(value)}
                                className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-125 ${
                                  value === rating
                                    ? 'bg-violet-500 border-violet-500'
                                    : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 hover:border-violet-400'
                                }`}
                                aria-label={`Rating ${value}`}
                              >
                                <span className="sr-only">{value}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-full flex justify-between text-sm text-gray-500 dark:text-gray-400 italic mt-3">
                        <div>매우 나쁨</div>
                        <div>매우 좋음</div>
                      </div>
                    </div>
                  </section>

                  {/* Tell us in words */}
                  <section>
                    <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold mb-5">
                      내용 입력
                    </h3>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="form-textarea w-full focus:border-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                      rows={4}
                      placeholder="개선이 필요한 항목은 페이지의 URL을 함께 제출해주세요"
                    />
                  </section>
                </div>

                {/* Panel footer */}
                <footer>
                  <div className="flex flex-col px-6 py-5 border-t border-gray-200 dark:border-gray-700/60">
                    <div className="flex self-end">
                      <button
                        onClick={handleCancel}
                        className="btn dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white ml-3"
                      >
                        제출
                      </button>
                    </div>
                  </div>
                </footer>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}