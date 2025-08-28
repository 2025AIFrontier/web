'use client'

import { useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react'
import { useFlyoutContext } from '@/app/flyout-context'
import { format } from "date-fns"
import { ko } from 'date-fns/locale'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function ExchangeCalculatorPanel() {
  const { flyoutOpen, setFlyoutOpen } = useFlyoutContext()
  
  const panelContent = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  // State for calculator
  const [baseDate, setBaseDate] = useState<Date | undefined>(new Date())
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('KRW')
  const [fromAmount, setFromAmount] = useState<string>('1')
  const [toAmount, setToAmount] = useState<string>('')
  const [currentRate, setCurrentRate] = useState<number>(0)
  const [previousRate, setPreviousRate] = useState<number>(0)
  const [conversionResult, setConversionResult] = useState<string>('')

  // Currency options
  const currencies = [
    { code: 'USD', name: '미국 달러', symbol: '$' },
    { code: 'EUR', name: '유럽 유로', symbol: '€' },
    { code: 'JPY', name: '일본 엔', symbol: '¥' },
    { code: 'CNH', name: '중국 위안', symbol: '¥' },
    { code: 'KRW', name: '한국 원', symbol: '₩' },
  ]

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/exchange')
        const result = await response.json()
        
        if (result?.data?.[0]) {
          const latestData = result.data[0]
          const previousData = result.data[1] || latestData
          
          // Handle JPY100 특별 케이스
          const currentKey = fromCurrency === 'JPY' ? 'JPY100' : fromCurrency
          const currentValue = latestData[currentKey] || 1
          const previousValue = previousData[currentKey] || currentValue
          
          setCurrentRate(currentValue)
          setPreviousRate(previousValue)
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }
    
    if (flyoutOpen && fromCurrency !== 'KRW') {
      fetchRates()
    } else if (fromCurrency === 'KRW') {
      setCurrentRate(1)
      setPreviousRate(1)
    }
  }, [flyoutOpen, fromCurrency, baseDate])

  // Calculate conversion
  useEffect(() => {
    if (fromAmount && currentRate) {
      let calculatedAmount: number
      
      if (fromCurrency === 'KRW') {
        // KRW to other currency
        calculatedAmount = parseFloat(fromAmount) / currentRate
      } else if (toCurrency === 'KRW') {
        // Other currency to KRW
        if (fromCurrency === 'JPY') {
          // JPY는 100엔 기준이므로 조정
          calculatedAmount = (parseFloat(fromAmount) * currentRate) / 100
        } else {
          calculatedAmount = parseFloat(fromAmount) * currentRate
        }
      } else {
        // Cross currency (not implemented yet)
        calculatedAmount = 0
      }
      
      setToAmount(calculatedAmount.toFixed(2))
    }
  }, [fromAmount, fromCurrency, toCurrency, currentRate])

  // Calculate change percentage
  const change = currentRate - previousRate
  const changePercent = previousRate ? ((change / previousRate) * 100).toFixed(2) : '0.00'
  const isPositive = change >= 0

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }) => {
      if (!panelContent.current || !closeBtn.current) return
      if (!flyoutOpen || panelContent.current.contains(target as Node) || closeBtn.current.contains(target as Node)) return
      setFlyoutOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // Close if ESC key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!flyoutOpen || keyCode !== 27) return
      setFlyoutOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  // Swap currencies
  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  // Handle clipboard batch conversion
  const handleClipboardConversion = async () => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        // Fallback for older browsers or HTTP
        setConversionResult('클립보드 기능은 HTTPS에서만 사용 가능합니다.')
        setTimeout(() => setConversionResult(''), 3000)
        return
      }

      // Try to read from clipboard with user interaction
      let text = ''
      try {
        text = await navigator.clipboard.readText()
      } catch (readErr) {
        // If read fails, prompt user to paste
        text = prompt('변환할 숫자들을 붙여넣기 하세요 (Ctrl+V):') || ''
        if (!text) {
          setConversionResult('입력이 취소되었습니다.')
          setTimeout(() => setConversionResult(''), 3000)
          return
        }
      }
      
      // Parse numbers from clipboard (handle various formats)
      const lines = text.split(/[\n\r\t]+/).filter(line => line.trim())
      const numbers = lines.map(line => {
        // Remove commas, spaces, and currency symbols, then parse
        const cleanValue = line.replace(/[,\s$₩¥€]/g, '').trim()
        return parseFloat(cleanValue)
      }).filter(num => !isNaN(num) && num !== 0)
      
      if (numbers.length === 0) {
        setConversionResult('유효한 숫자가 없습니다.')
        setTimeout(() => setConversionResult(''), 3000)
        return
      }
      
      // Convert each number using current currency settings
      // 클립보드의 숫자들은 fromCurrency로 간주하고 toCurrency로 변환
      const converted = numbers.map(num => {
        let result: number
        
        // Same logic as the single conversion
        if (fromCurrency === 'KRW') {
          // KRW to other currency
          result = num / currentRate
        } else if (toCurrency === 'KRW') {
          // Other currency to KRW
          if (fromCurrency === 'JPY') {
            // JPY는 100엔 기준이므로 조정
            result = (num * currentRate) / 100
          } else {
            result = num * currentRate
          }
        } else {
          // Cross currency conversion (not implemented)
          result = 0
        }
        return result.toFixed(2)
      })
      
      const resultText = converted.join('\n')
      
      // Try to copy converted values back to clipboard
      try {
        await navigator.clipboard.writeText(resultText)
        setConversionResult(`✅ ${numbers.length}개의 ${fromCurrency}를 ${toCurrency}로 변환하여 클립보드에 복사했습니다.`)
      } catch (writeErr) {
        // If write fails, show result in a copyable textarea
        setConversionResult(`✅ ${numbers.length}개 ${fromCurrency} → ${toCurrency} 변환 완료:\n${resultText}\n(위 결과를 선택하여 복사하세요)`)
      }
      
      setTimeout(() => setConversionResult(''), 10000)
      
    } catch (err) {
      console.error('Clipboard operation failed:', err)
      setConversionResult('오류가 발생했습니다. 다시 시도해주세요.')
      setTimeout(() => setConversionResult(''), 3000)
    }
  }

  return (
    <Transition
      show={flyoutOpen}
      unmount={false}
      as="div"
      id="exchange-calculator"
      ref={panelContent}
      className="absolute inset-0 sm:left-auto z-20 shadow-xl"
      enter="transition-transform duration-200 ease-in-out"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transition-transform duration-200 ease-in-out"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      <div className="sticky top-16 bg-white dark:bg-gray-900 overflow-x-hidden overflow-y-auto shrink-0 border-l border-gray-200 dark:border-gray-700/60 w-full sm:w-[420px] h-[calc(100dvh-64px)]">
        {/* Close button */}
        <button ref={closeBtn} onClick={() => setFlyoutOpen(false)} className="absolute top-0 right-0 mt-6 mr-6 group p-2">
          <svg
            className="fill-gray-400 group-hover:fill-gray-600 pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m7.95 6.536 4.242-4.243a1 1 0 1 1 1.415 1.414L9.364 7.95l4.243 4.242a1 1 0 1 1-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 0 1-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 0 1 1.414-1.414L7.95 6.536Z" />
          </svg>
        </button>

        <div className="py-6 px-6 pb-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">환율 계산기</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">실시간 환율로 통화를 변환하세요</p>
          </div>

          {/* Base Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              기준일
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "btn w-full px-2.5 bg-white border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium text-left justify-start",
                    !baseDate && "text-muted-foreground"
                  )}
                >
                  <svg className="fill-current text-gray-400 dark:text-gray-500 ml-1 mr-2" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                    <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"></path>
                  </svg>
                  {baseDate ? (
                    format(baseDate, "yyyy년 MM월 dd일", { locale: ko })
                  ) : (
                    <span>날짜를 선택하세요</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={baseDate}
                  onSelect={setBaseDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* From Currency */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                변환할 통화
              </label>
              <div className="flex space-x-2">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="form-select w-32"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="form-input flex-1"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                변환된 통화
              </label>
              <div className="flex space-x-2">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="form-select w-32"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={toAmount}
                  readOnly
                  className="form-input flex-1 bg-gray-50 dark:bg-gray-800"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Clipboard Batch Conversion */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClipboardConversion}
              className="btn w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              클립보드 일괄 변환
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              클립보드의 {fromCurrency} 값들을 {toCurrency}로 일괄 변환
            </p>
          </div>

          {/* Conversion Result Modal */}
          {conversionResult && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">결과</h3>
                  {conversionResult.includes('\n') ? (
                    <textarea 
                      className="mt-2 w-full p-2 text-xs bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded text-green-700 dark:text-green-300"
                      rows={5}
                      readOnly
                      value={conversionResult}
                    />
                  ) : (
                    <div className="mt-1 text-xs text-green-700 dark:text-green-300 whitespace-pre-wrap">
                      {conversionResult}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">안내</h3>
                <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                  실제 송금 시에는 수수료와 환율 우대율이 적용될 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}