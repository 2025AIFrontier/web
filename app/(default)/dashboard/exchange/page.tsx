'use client'

import { useEffect, useState } from 'react'
import Datepicker from '@/components/datepicker'
import ExchangeCardTop from './exchange-card-top'
import ExchangeCardBottom1 from './exchange-card-bottom-1'
import ExchangeCardBottom2 from './exchange-card-bottom-2'
import ExchangeCardMiddle from './exchange-card-middle'
import ExchangeCalculator from './exchange-calculator'

interface ExchangeData {
  date: string
  usd: number
  eur: number
  cny: number
  jpy100?: number
  previousDate?: string
  previousUsd?: number
  previousEur?: number
  previousCny?: number
  previousJpy100?: number
  history?: Array<{
    date: string
    usd: number
    eur: number
    cny: number
    jpy100?: number
  }>
}

export default function Exchange() {
  const [exchangeData, setExchangeData] = useState<ExchangeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

  useEffect(() => {
    const fetchExchangeData = async () => {
      try {
        setLoading(true)
        // 현재 페이지의 origin을 사용하여 API 호출
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        // 로컬 날짜를 YYYY-MM-DD 형식으로 변환
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const today = `${year}-${month}-${day}`
        const response = await fetch(`${origin}/api/exchange?format=web&date=${today}&days=14`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setExchangeData(data)
      } catch (err) {
        console.error('Failed to fetch exchange data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch exchange data')
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeData()
    // 5분마다 데이터 갱신
    const interval = setInterval(fetchExchangeData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  // 환율 변동 계산
  const calculateChange = (current: number, previous?: number) => {
    if (!previous) return { change: 0, percent: 0, isPositive: true }
    const change = current - previous
    const percent = ((change / previous) * 100).toFixed(2)
    return {
      change: change.toFixed(2),
      percent: `${percent}%`,
      isPositive: change >= 0
    }
  }

  // 차트 데이터 준비 (최근 2주)
  const prepareChartData = (history: ExchangeData['history'], currency: 'usd' | 'eur' | 'cny') => {
    if (!history || history.length === 0) return { data: [], labels: [] }
    
    // 최근 14일 데이터만 추출
    const recentData = history.slice(-14)
    return {
      data: recentData.map(item => item[currency]),
      labels: recentData.map(item => {
        const date = new Date(item.date)
        return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
      })
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">환율 데이터를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">오류: {error}</div>
        </div>
      </div>
    )
  }

  if (!exchangeData) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">환율 데이터가 없습니다.</div>
        </div>
      </div>
    )
  }

  const stockData = [
    {
      ticker: 'USD',
      company: '미국 달러',
      price: `₩${exchangeData.usd.toFixed(2)}`,
      ...calculateChange(exchangeData.usd, exchangeData.previousUsd),
      ...prepareChartData(exchangeData.history, 'usd'),
      color: 'blue' as const
    },
    {
      ticker: 'EUR',
      company: '유럽 유로',
      price: `₩${exchangeData.eur.toFixed(2)}`,
      ...calculateChange(exchangeData.eur, exchangeData.previousEur),
      ...prepareChartData(exchangeData.history, 'eur'),
      color: 'green' as const
    },
    {
      ticker: 'CNY',
      company: '중국 위안',
      price: `₩${exchangeData.cny.toFixed(2)}`,
      ...calculateChange(exchangeData.cny, exchangeData.previousCny),
      ...prepareChartData(exchangeData.history, 'cny'),
      color: 'red' as const
    }
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">

      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-5">

        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">환율 정보</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            해당 페이지는 한국수출입은행의 환율을 기준으로 하고 있습니다
          </p>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

          {/* Datepicker built with React Day Picker */}
          <Datepicker />

          {/* Exchange Calculator button */}
          <button 
            onClick={() => setIsCalculatorOpen(true)}
            className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          >
            <svg className="fill-current shrink-0" width="16" height="16" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 00-2 2v3h2V2h3V0H2zm11 0v2h3v3h2V2a2 2 0 00-2-2h-3zM0 11v3a2 2 0 002 2h3v-2H2v-3H0zm16 0h-2v3h-3v2h3a2 2 0 002-2v-3zM8 3a5 5 0 100 10A5 5 0 008 3zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
            </svg>
            <span className="ml-2">환율 계산기</span>
          </button>

        </div>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">

        {/* Page Intro */}
        <ExchangeCardTop />
        
        {/* Stock cards using template */}
        {stockData.map((stock, index) => (
          <ExchangeCardMiddle
            key={index}
            ticker={stock.ticker}
            company={stock.company}
            price={stock.price}
            change={typeof stock.change === 'string' ? stock.change : `₩${stock.change}`}
            changePercent={typeof stock.percent === 'string' ? stock.percent : stock.changePercent}
            isPositive={stock.isPositive}
            data={stock.data}
            labels={stock.labels}
            color={stock.color}
          />
        ))}
        
        {/* Table (Recent Expenses) */}
        <ExchangeCardBottom1 />
        {/* Table (Recent Earnings) */}
        <ExchangeCardBottom2 />

      </div>

      {/* Exchange Calculator Sidebar */}
      <ExchangeCalculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)}
        exchangeData={exchangeData}
      />
    </div>
  )
}