'use client'

import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface PCPerformanceModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

type PowerMode = 'standard' | 'optimized' | 'always-high'

export default function PCPerformanceModal({ isOpen, setIsOpen }: PCPerformanceModalProps) {
  const [currentMode, setCurrentMode] = useState<PowerMode>('standard')
  const [currentPowerPlan, setCurrentPowerPlan] = useState<string>('balanced')
  const [isACConnected, setIsACConnected] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [powerStatus, setPowerStatus] = useState<any>(null)

  // 전원 상태 확인
  const checkPowerStatus = async () => {
    try {
      const response = await fetch('/api/power/status')
      const data = await response.json()
      setPowerStatus(data)
      setIsACConnected(data.isACConnected)
      setCurrentPowerPlan(data.currentPlan)
      if (data.powerMode) {
        setCurrentMode(data.powerMode)
      }
    } catch (error) {
      console.error('전원 상태 확인 실패:', error)
    }
  }

  // 전원 모드 변경
  const changePowerMode = async (mode: PowerMode) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/power/set-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode }),
      })
      const data = await response.json()
      if (data.success) {
        setCurrentMode(mode)
        // 모드에 따라 전원 계획 즉시 적용
        applyPowerModeSettings(mode)
      } else {
        alert('전원 모드 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('전원 모드 변경 실패:', error)
      alert('전원 모드 변경 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 모드에 따른 전원 설정 적용
  const applyPowerModeSettings = async (mode: PowerMode) => {
    let targetPlan = 'balanced'
    
    switch(mode) {
      case 'standard':
        // 표준: 항상 균형
        targetPlan = 'balanced'
        break
      case 'optimized':
        // 최적화된 고성능: 배터리=균형, 전원=고성능
        targetPlan = isACConnected ? 'high' : 'balanced'
        break
      case 'always-high':
        // 항상 고성능: 항상 고성능
        targetPlan = 'high'
        break
    }
    
    if (targetPlan !== currentPowerPlan) {
      await changePowerPlan(targetPlan)
    }
  }

  // 전원 계획 변경
  const changePowerPlan = async (plan: string) => {
    try {
      const response = await fetch('/api/power/set-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })
      const data = await response.json()
      if (data.success) {
        setCurrentPowerPlan(plan)
      }
    } catch (error) {
      console.error('전원 계획 변경 실패:', error)
    }
  }

  // 모달이 열릴 때 전원 상태 확인
  useEffect(() => {
    if (isOpen) {
      checkPowerStatus()
      
      // 5초마다 전원 상태 확인
      const interval = setInterval(checkPowerStatus, 5000)
      
      return () => clearInterval(interval)
    }
  }, [isOpen])

  // 전원 연결 상태 변경 시 현재 모드에 따라 자동 조정
  useEffect(() => {
    if (isOpen && currentMode === 'optimized') {
      applyPowerModeSettings('optimized')
    }
  }, [isACConnected])

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      PC 성능 개선
                    </Dialog.Title>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Windows 전원 옵션을 관리하여 PC 성능을 최적화합니다
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <span className="sr-only">닫기</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* 전원 상태 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">현재 전원 상태</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">전원 연결</span>
                          <span className={`text-sm font-medium ${isACConnected ? 'text-green-600' : 'text-orange-600'}`}>
                            {isACConnected ? '연결됨' : '배터리'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">현재 모드</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {currentPowerPlan === 'high' ? '고성능' : currentPowerPlan === 'balanced' ? '균형' : '절전'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 전원 모드 선택 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">전원 모드 선택</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {/* 표준 모드 */}
                      <button
                        onClick={() => changePowerMode('standard')}
                        disabled={isLoading || currentMode === 'standard'}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          currentMode === 'standard'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <svg className={`w-6 h-6 mx-auto mb-2 ${currentMode === 'standard' ? 'text-violet-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">표준</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">항상 균형</span>
                      </button>

                      {/* 최적화된 고성능 모드 */}
                      <button
                        onClick={() => changePowerMode('optimized')}
                        disabled={isLoading || currentMode === 'optimized'}
                        className={`p-4 rounded-lg border-2 transition-all relative ${
                          currentMode === 'optimized'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="absolute -top-2 -right-2 bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full">
                          추천
                        </div>
                        <svg className={`w-6 h-6 mx-auto mb-2 ${currentMode === 'optimized' ? 'text-violet-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">최적화된 고성능</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">스마트 전환</span>
                      </button>

                      {/* 항상 고성능 모드 */}
                      <button
                        onClick={() => changePowerMode('always-high')}
                        disabled={isLoading || currentMode === 'always-high'}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          currentMode === 'always-high'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <svg className={`w-6 h-6 mx-auto mb-2 ${currentMode === 'always-high' ? 'text-violet-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">항상 고성능</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">최고 성능</span>
                      </button>
                    </div>
                  </div>

                  {/* 현재 모드 설명 */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">현재 모드: {currentMode === 'standard' ? '표준' : currentMode === 'optimized' ? '최적화된 고성능' : '항상 고성능'}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {currentMode === 'standard' && '배터리와 전원 연결 상태 모두에서 균형 모드를 유지합니다.'}
                      {currentMode === 'optimized' && '배터리 사용 시 균형 모드, 전원 연결 시 고성능 모드로 자동 전환됩니다.'}
                      {currentMode === 'always-high' && '배터리와 전원 연결 상태 모두에서 고성능 모드를 유지합니다.'}
                    </p>
                  </div>

                  {/* 참고 정보 */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="ml-2 text-xs text-blue-800 dark:text-blue-200">
                        전원 모드 변경은 관리자 권한이 필요할 수 있습니다.
                        최적화된 고성능 모드에서는 전원 연결 상태에 따라 자동으로 성능이 조절됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}