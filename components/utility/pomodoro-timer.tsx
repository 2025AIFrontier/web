'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'

interface PomodoroTimerProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak' | 'test'

const TIMER_MODES = {
  work: { label: '긴 작업', duration: 25 * 60, color: 'text-red-500' },
  shortBreak: { label: '짧은 작업', duration: 5 * 60, color: 'text-green-500' },
  longBreak: { label: '긴 휴식', duration: 15 * 60, color: 'text-blue-500' },
  test: { label: '테스트', duration: 3, color: 'text-purple-500' }
}

export default function PomodoroTimer({ isOpen, setIsOpen }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.work.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showUsageGuide, setShowUsageGuide] = useState(false)
  const [showIntro, setShowIntro] = useState(false)

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      return permission === 'granted'
    }
    return false
  }

  // 컴포넌트 마운트 시 알림 권한 확인
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // 타이머 시작/일시정지
  const toggleTimer = useCallback(() => {
    if (!isRunning && notificationPermission === 'default') {
      requestNotificationPermission()
    }
    setIsRunning(!isRunning)
  }, [isRunning, notificationPermission])

  // 타이머 리셋
  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(TIMER_MODES[mode].duration)
  }, [mode])

  // 모드 변경
  const changeMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(TIMER_MODES[newMode].duration)
  }

  // 알림 보내기
  const sendNotification = useCallback(() => {
    const modeInfo = TIMER_MODES[mode]
    const title = `${modeInfo.label} 시간 종료!`
    let body = ''
    let icon = '🍅'

    if (mode === 'work') {
      body = '잠시 휴식을 취하세요!'
      icon = '☕'
      setCompletedPomodoros(prev => prev + 1)
    } else if (mode === 'shortBreak') {
      body = '짧은 작업이 끝났습니다!'
      icon = '✅'
      setCompletedPomodoros(prev => prev + 1)
    } else if (mode === 'test') {
      body = '테스트가 완료되었습니다!'
      icon = '🧪'
    } else {
      body = '다시 작업을 시작하세요!'
      icon = '💪'
    }

    // 브라우저 알림
    if ('Notification' in window && notificationPermission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [200, 100, 200],
          requireInteraction: true,
          tag: 'pomodoro-timer',
          renotify: true
        })
      } catch (error) {
        console.error('Notification error:', error)
      }
    }

    // 오디오 알림 (폴백)
    try {
      // 간단한 비프음 생성
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.error('Audio error:', error)
    }

    // 페이지 타이틀 변경
    const originalTitle = document.title
    let titleInterval: NodeJS.Timeout
    let counter = 0
    
    titleInterval = setInterval(() => {
      document.title = counter % 2 === 0 ? `${icon} ${title}` : originalTitle
      counter++
      
      if (counter > 10) {
        clearInterval(titleInterval)
        document.title = originalTitle
      }
    }, 500)

    // 다음 모드로 자동 전환 (테스트 모드는 제외)
    if (mode !== 'test') {
      if (mode === 'work' || mode === 'shortBreak') {
        const pomodoroCount = completedPomodoros + 1
        if (pomodoroCount % 4 === 0) {
          changeMode('longBreak')
        } else if (mode === 'work') {
          changeMode('shortBreak')
        } else {
          changeMode('work')
        }
      } else {
        changeMode('work')
      }
    }
  }, [mode, notificationPermission, completedPomodoros])

  // 타이머 실행
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            sendNotification()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, timeLeft, sendNotification])

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 진행률 계산
  const progress = ((TIMER_MODES[mode].duration - timeLeft) / TIMER_MODES[mode].duration) * 100

  return (
    <Transition show={isOpen}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        </TransitionChild>

        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <DialogPanel className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  🍅 뽀모도로 타이머
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 모드 선택 */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {(Object.keys(TIMER_MODES) as TimerMode[]).map((modeKey) => {
                  const modeInfo = TIMER_MODES[modeKey]
                  const isTestMode = modeKey === 'test'
                  
                  return (
                    <button
                      key={modeKey}
                      onClick={() => changeMode(modeKey)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        mode === modeKey
                          ? isTestMode 
                            ? 'bg-purple-500 text-white'
                            : 'bg-violet-500 text-white'
                          : isTestMode
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {modeInfo.label}
                      {isTestMode && (
                        <span className="ml-1 text-xs">(3초)</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* 타이머 디스플레이 */}
              <div className="relative mb-8">
                <div className="flex justify-center items-center">
                  <div className={`text-6xl font-bold ${TIMER_MODES[mode].color} font-mono`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* 진행 바 */}
                <div className="mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear ${
                      mode === 'work' ? 'bg-red-500' : 
                      mode === 'shortBreak' ? 'bg-green-500' : 
                      mode === 'test' ? 'bg-purple-500' : 
                      'bg-blue-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* 컨트롤 버튼 */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={toggleTimer}
                  className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
                    isRunning
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isRunning ? '일시정지' : '시작'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-8 py-3 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                  리셋
                </button>
              </div>

              {/* 통계 및 알림 상태 */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-600 dark:text-gray-400">
                    완료한 뽀모도로: <span className="font-bold text-violet-500">{completedPomodoros}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">알림:</span>
                    {notificationPermission === 'granted' ? (
                      <span className="text-green-500 font-medium">✓ 활성화</span>
                    ) : notificationPermission === 'denied' ? (
                      <span className="text-red-500 font-medium">✗ 거부됨</span>
                    ) : (
                      <button
                        onClick={requestNotificationPermission}
                        className="text-violet-500 hover:text-violet-600 font-medium"
                      >
                        권한 요청
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 사용 방법 */}
              <div className="mt-6 space-y-4">
                {/* 뽀모도로 기법 소개 - 접을 수 있는 섹션 */}
                <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-900/50 rounded-lg">
                  <button
                    onClick={() => setShowIntro(!showIntro)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors rounded-lg"
                  >
                    <h4 className="text-sm font-semibold text-violet-900 dark:text-violet-400 flex items-center">
                      🍅 뽀모도로 기법이란?
                    </h4>
                    <svg
                      className={`w-4 h-4 text-violet-600 dark:text-violet-400 transition-transform duration-200 ${showIntro ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <Transition
                    show={showIntro}
                    enter="transition-all duration-300 ease-out"
                    enterFrom="max-h-0 opacity-0"
                    enterTo="max-h-96 opacity-100"
                    leave="transition-all duration-300 ease-in"
                    leaveFrom="max-h-96 opacity-100"
                    leaveTo="max-h-0 opacity-0"
                  >
                    <div className="px-4 pb-4 overflow-hidden">
                      <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                        시간을 효율적으로 관리하는 기법입니다:
                      </p>
                      <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400 mb-4">
                        <li>• <strong>긴 작업(25분)</strong>: 깊은 집중이 필요한 작업</li>
                        <li>• <strong>짧은 작업(5분)</strong>: 간단한 작업이나 정리</li>
                        <li>• <strong>긴 휴식(15분)</strong>: 충분한 재충전 시간</li>
                        <li>• <strong>테스트(3초)</strong>: 알림 기능 테스트용</li>
                      </ul>
                      
                      <div className="border-t border-violet-200 dark:border-violet-800 pt-3">
                        <p className="text-xs font-semibold text-violet-900 dark:text-violet-400 mb-2">
                          💡 효과적인 활용 팁
                        </p>
                        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          <li>• 휴식 시간에는 스트레칭이나 가벼운 산책을 하세요</li>
                          <li>• 방해 요소를 미리 제거하고 시작하세요</li>
                          <li>• 큰 작업은 여러 개의 뽀모도로로 나누어 진행하세요</li>
                          <li>• 완료한 뽀모도로 개수를 기록하여 성취감을 높이세요</li>
                        </ul>
                      </div>
                    </div>
                  </Transition>
                </div>

                {/* 사용 방법 - 접을 수 있는 섹션 */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <button
                    onClick={() => setShowUsageGuide(!showUsageGuide)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                  >
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                      📋 사용 방법
                    </h4>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUsageGuide ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <Transition
                    show={showUsageGuide}
                    enter="transition-all duration-300 ease-out"
                    enterFrom="max-h-0 opacity-0"
                    enterTo="max-h-96 opacity-100"
                    leave="transition-all duration-300 ease-in"
                    leaveFrom="max-h-96 opacity-100"
                    leaveTo="max-h-0 opacity-0"
                  >
                    <div className="px-4 pb-4 overflow-hidden">
                      <ol className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <li>1. 작업할 내용을 정하고 타이머를 시작합니다</li>
                        <li>2. 25분 동안 온전히 해당 작업에만 집중합니다</li>
                        <li>3. 타이머가 울리면 5분간 휴식을 취합니다</li>
                        <li>4. 4번째 뽀모도로 후에는 15-30분 긴 휴식을 취합니다</li>
                      </ol>
                    </div>
                  </Transition>
                </div>
              </div>
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  )
}