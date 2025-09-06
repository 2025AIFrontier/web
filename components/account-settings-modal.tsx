'use client'

import { useState, Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import Image from 'next/image'
import AccountImage from '@/public/images/user-avatar-80.png'

interface AccountSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AccountSettingsModal({ isOpen, onClose }: AccountSettingsModalProps) {
  const [userInfo, setUserInfo] = useState({
    name: '홍길동',
    department: '개발팀',
    position: '선임연구원',
    jobDuty: 'Frontend',
    subDuty: 'React/Next.js',
    tags: '개발, 프론트엔드, React'
  })

  const handleSave = () => {
    // Save logic here
    console.log('Saving user info:', userInfo)
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 text-left align-middle shadow-xl transition-all">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700/60">
                  <DialogTitle as="h3" className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    계정 정보
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    현재의 부서와 업무에 맞게 정보를 업데이트해주세요.
                  </div>

                  {/* Picture */}
                  <section>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Image className="w-20 h-20 rounded-full" src={AccountImage} width={80} height={80} alt="User upload" />
                      </div>
                      <button className="btn-sm dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">
                        Change
                      </button>
                    </div>
                  </section>

                  {/* Business Profile */}
                  <section>
                    <h3 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold mb-4">기본 정보</h3>
                    <div className="space-y-0">
                      {/* 이름 - 두 개의 열 (우측은 빈 열) */}
                      <div className="grid md:grid-cols-2 md:gap-x-16 py-3 border-b border-gray-200 dark:border-gray-700/60">
                        <div className="flex justify-between items-center pr-8 md:border-r border-gray-200 dark:border-gray-700/60">
                          <div className="text-sm text-gray-800 dark:text-gray-100 font-medium">이름</div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="mr-3">{userInfo.name}</span>
                            <button className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                              Edit
                            </button>
                          </div>
                        </div>
                        <div className="pl-8 mt-4 md:mt-0">
                          {/* 우측 빈 열 */}
                        </div>
                      </div>
                      
                      {/* 부서명 / 직책 - 두 개의 열 */}
                      <div className="grid md:grid-cols-2 md:gap-x-16 py-3 border-b border-gray-200 dark:border-gray-700/60">
                        <div className="flex justify-between items-center pr-8 md:border-r border-gray-200 dark:border-gray-700/60">
                          <div className="text-sm text-gray-800 dark:text-gray-100 font-medium">부서명</div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="mr-3">{userInfo.department}</span>
                            <button className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                              Edit
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pl-8 mt-4 md:mt-0">
                          <div className="text-sm text-gray-800 dark:text-gray-100 font-medium">직책</div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="mr-3">{userInfo.position}</span>
                            <button className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 직무 / 세부직무 - 두 개의 열 */}
                      <div className="grid md:grid-cols-2 md:gap-x-16 py-3 border-b border-gray-200 dark:border-gray-700/60">
                        <div className="flex justify-between items-center pr-8 md:border-r border-gray-200 dark:border-gray-700/60">
                          <div className="text-sm text-gray-800 dark:text-gray-100 font-medium">직무</div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="mr-3">{userInfo.jobDuty}</span>
                            <button className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                              Edit
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pl-8 mt-4 md:mt-0">
                          <div className="text-sm text-gray-800 dark:text-gray-100 font-medium">세부직무</div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="mr-3">{userInfo.subDuty}</span>
                            <button className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 태그 */}
                      <div className="py-3 border-b border-gray-200 dark:border-gray-700/60">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-800 dark:text-gray-100 font-medium">태그</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="mr-3">{userInfo.tags}</span>
                            <button className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700/60">
                  <button
                    onClick={onClose}
                    className="btn dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  >
                    저장
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}