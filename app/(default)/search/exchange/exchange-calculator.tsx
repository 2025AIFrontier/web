'use client'

import { useState, useEffect, useCallback } from 'react'
import SingleDatePicker from '@/components/single-datepicker'

interface ExchangeCalculatorProps {
  isOpen: boolean
  onClose: () => void
  exchangeData?: any
}

export default function ExchangeCalculator({ isOpen, onClose, exchangeData }: ExchangeCalculatorProps) {
  const [baseDate, setBaseDate] = useState<Date>(new Date())
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('KRW')
  const [fromAmount, setFromAmount] = useState('1')
  const [toAmount, setToAmount] = useState('')
  const [bulkInput, setBulkInput] = useState('')
  const [bulkOutput, setBulkOutput] = useState('')
  const [dateExchangeData, setDateExchangeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 날짜별 환율 데이터 가져오기
  useEffect(() => {
    const fetchExchangeData = async () => {
      if (!baseDate) return
      
      setLoading(true)
      try {
        // 주말인 경우 가장 가까운 이전 평일로 변환
        const adjustedDate = new Date(baseDate)
        const dayOfWeek = adjustedDate.getDay()
        
        if (dayOfWeek === 0) { // 일요일
          adjustedDate.setDate(adjustedDate.getDate() - 2) // 금요일로
        } else if (dayOfWeek === 6) { // 토요일
          adjustedDate.setDate(adjustedDate.getDate() - 1) // 금요일로
        }
        
        // 조정된 날짜를 YYYY-MM-DD 형식으로 변환
        const year = adjustedDate.getFullYear()
        const month = String(adjustedDate.getMonth() + 1).padStart(2, '0')
        const day = String(adjustedDate.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`
        // 현재 페이지의 origin을 사용하여 API 호출
        const origin = window.location.origin
        const response = await fetch(`${origin}/api/exchange?format=web&date=${dateStr}&days=1`)
        
        if (response.ok) {
          const data = await response.json()
          setDateExchangeData(data)
        } else {
          // API 오류 시 조용히 처리 (콘솔 에러 제거)
          console.warn(`Exchange data not available for date: ${dateStr} (status: ${response.status})`)
          setDateExchangeData(null)
        }
      } catch (error) {
        // 네트워크 오류 등 예외 상황 조용히 처리
        console.warn('Unable to fetch exchange data:', error instanceof Error ? error.message : 'Unknown error')
        setDateExchangeData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeData()
  }, [baseDate])

  // API 데이터만 사용 (날짜별 데이터 우선, 없으면 현재 데이터)
  const currentData = dateExchangeData || exchangeData
  console.log('Using exchange data:', currentData)
  const exchangeRates: { [key: string]: number } = currentData ? {
    'KRW': 1,
    'USD': currentData.usd || 0,
    'EUR': currentData.eur || 0,
    'CNY': currentData.cny || 0,
    'JPY': currentData.jpy100 ? currentData.jpy100 / 100 : 0,
  } : {}

  const currencies = Object.keys(exchangeRates).filter(key => exchangeRates[key] > 0)

  // 환율 계산
  const calculateExchange = useCallback((amount: string, from: string, to: string) => {
    if (!amount || isNaN(Number(amount))) return ''
    const fromRate = exchangeRates[from]
    const toRate = exchangeRates[to]
    if (!fromRate || !toRate) {
      console.log('Exchange rates not available:', { from, to, fromRate, toRate })
      return ''
    }
    const result = (Number(amount) * fromRate) / toRate
    return result.toFixed(2)
  }, [exchangeRates])

  // 개별 환율 계산
  useEffect(() => {
    if (fromAmount) {
      const result = calculateExchange(fromAmount, fromCurrency, toCurrency)
      console.log('Calculating exchange:', fromAmount, fromCurrency, 'to', toCurrency, '=', result)
      setToAmount(result)
    }
  }, [fromAmount, fromCurrency, toCurrency, calculateExchange]) // calculateExchange 의존성 추가

  // 일괄 변환
  const handleBulkConvert = async () => {
    try {
      // 클립보드에서 읽기
      const clipboardText = await navigator.clipboard.readText()
      setBulkInput(clipboardText)
      
      // 숫자 추출 및 변환
      const numbers = clipboardText.match(/[\d,]+\.?\d*/g) || []
      const converted = numbers.map(num => {
        const cleanNum = num.replace(/,/g, '')
        const result = calculateExchange(cleanNum, fromCurrency, toCurrency)
        return result ? parseFloat(result).toLocaleString() : num
      })
      
      // 결과 생성
      let resultText = clipboardText
      numbers.forEach((num, idx) => {
        resultText = resultText.replace(num, converted[idx])
      })
      
      setBulkOutput(resultText)
      
      // 클립보드에 복사
      await navigator.clipboard.writeText(resultText)
      alert('변환된 내용이 클립보드에 복사되었습니다!')
    } catch (err) {
      console.error('클립보드 접근 실패:', err)
      alert('클립보드 접근에 실패했습니다. 브라우저 권한을 확인해주세요.')
    }
  }

  // 수동 일괄 변환
  const handleManualBulkConvert = () => {
    const numbers = bulkInput.match(/[\d,]+\.?\d*/g) || []
    const converted = numbers.map(num => {
      const cleanNum = num.replace(/,/g, '')
      const result = calculateExchange(cleanNum, fromCurrency, toCurrency)
      return result ? parseFloat(result).toLocaleString() : num
    })
    
    let resultText = bulkInput
    numbers.forEach((num, idx) => {
      resultText = resultText.replace(num, converted[idx])
    })
    
    setBulkOutput(resultText)
  }

  // 결과 복사
  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(bulkOutput)
      alert('결과가 클립보드에 복사되었습니다!')
    } catch (err) {
      console.error('복사 실패:', err)
      alert('복사에 실패했습니다.')
    }
  }

  return (
    <>
      {/* 오버레이 */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* 계산기 패널 */}
      <div className={`fixed right-0 top-16 w-96 bg-white dark:bg-gray-800 shadow-2xl z-40 max-h-[calc(100vh-64px)] overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">환율 계산기</h2>
            <div className="w-48">
              <SingleDatePicker 
                date={baseDate}
                onDateChange={(date) => date && setBaseDate(date)}
                placeholder="기준 날짜 선택"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* 개별 환율 계산 */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">개별 환율 계산</h3>
            {currentData && (
              <button
                onClick={() => {
                  // 통화 스왑
                  const tempCurrency = fromCurrency
                  setFromCurrency(toCurrency)
                  setToCurrency(tempCurrency)
                  // 금액도 스왑
                  const tempAmount = fromAmount
                  setFromAmount(toAmount)
                  setToAmount(tempAmount)
                }}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="통화 교환"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-4 text-gray-500">환율 데이터를 불러오는 중...</div>
          ) : !currentData ? (
            <div className="text-center py-4 text-gray-500">선택한 날짜의 환율 데이터가 없습니다.</div>
          ) : (
          <div className="space-y-3">
            {/* 기준 통화 */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[45px]">
                기준 통화
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {currencies.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="금액 입력"
                className="w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* 변환 통화 */}
            <div className="flex items-center gap-2 mt-3">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[45px]">
                변환 통화
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {currencies.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
              <input
                type="text"
                value={toAmount}
                readOnly
                className="w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          )}
        </div>

        {/* 일괄 변환 */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">일괄 변환</h3>
          
          {loading ? (
            <div className="text-center py-4 text-gray-500">환율 데이터를 불러오는 중...</div>
          ) : !currentData ? (
            <div className="text-center py-4 text-gray-500">선택한 날짜의 환율 데이터가 없습니다.</div>
          ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  자동 변환 (클립보드)
                </label>
                <button
                  onClick={handleBulkConvert}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                >
                  클립보드에서 변환
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                수동 변환 (입력 → 결과)
              </label>
              
              <div className="flex gap-2 items-start">
                <div className="flex-1 relative">
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="변환할 텍스트 입력..."
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y"
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.max(80, target.scrollHeight) + 'px';
                    }}
                  />
                </div>

                <button
                  onClick={handleManualBulkConvert}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex-shrink-0"
                  title="변환"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={bulkOutput}
                    readOnly
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 resize-y"
                    style={{ height: bulkInput ? 'auto' : '80px' }}
                    ref={(el) => {
                      if (el && bulkOutput) {
                        el.style.height = 'auto';
                        el.style.height = Math.max(80, el.scrollHeight) + 'px';
                      }
                    }}
                  />
                  {bulkOutput && (
                    <button
                      onClick={handleCopyResult}
                      className="absolute top-2 right-2 p-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
                      title="복사"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* 환율 정보 */}
        {currentData && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>* 선택한 날짜: {baseDate.toLocaleDateString('ko-KR')}</p>
            <p>* 환율 기준일: {currentData.date ? new Date(currentData.date).toLocaleDateString('ko-KR') : '정보 없음'}</p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}