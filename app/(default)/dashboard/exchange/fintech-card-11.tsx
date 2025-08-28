'use client'

import { useState, useEffect } from 'react'
import LineChart08 from '@/components/charts/line-chart-08'
import { chartAreaGradient } from '@/components/charts/chartjs-config'

// Import utilities
import { adjustColorOpacity, getCssVariable } from '@/components/utils/utils'

export default function FintechCard11() {
  const [exchangeData, setExchangeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExchangeData = async () => {
      try {
        // API route를 통해 exchange API 호출 (CORS 우회)
        const response = await fetch('/api/exchange')
        const result = await response.json()
        
        if (result && result.data && Array.isArray(result.data)) {
          // 최근 21일 데이터만 사용
          setExchangeData(result.data.slice(0, 21))
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching exchange data:', error)
        setLoading(false)
      }
    }

    fetchExchangeData()
    // 30초마다 업데이트
    const interval = setInterval(fetchExchangeData, 30000)
    return () => clearInterval(interval)
  }, [])

  // 최신 환율과 변동률 계산 (EUR는 대문자)
  const currentRate = exchangeData[0]?.EUR || 0
  const previousRate = exchangeData[1]?.EUR || currentRate
  const change = currentRate - previousRate
  const changePercent = ((change / previousRate) * 100).toFixed(2)
  const isPositive = change >= 0

  // 차트 데이터 준비 (역순으로 표시)
  // 날짜 포맷 변환: YYYY-MM-DD -> MM-DD-YYYY
  const chartLabels = exchangeData.slice(0, 21).reverse().map(item => {
    if (item?.date) {
      const parts = item.date.split('-')
      if (parts.length === 3) {
        return `${parts[1]}-${parts[2]}-${parts[0]}`
      }
    }
    return ''
  })
  const chartValues = exchangeData.slice(0, 21).reverse().map(item => item?.EUR || 0)
  
  // Y축 범위 계산 (min/max의 ±10%)
  const validValues = chartValues.filter(v => v > 0)
  const minValue = validValues.length > 0 ? Math.min(...validValues) : 0
  const maxValue = validValues.length > 0 ? Math.max(...validValues) : 0
  const range = maxValue - minValue
  const yMin = minValue - (range * 0.1) // 최소값에서 10% 아래
  const yMax = maxValue + (range * 0.1) // 최대값에서 10% 위

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        fill: true,
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          const gradientOrColor = chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(isPositive ? getCssVariable('--color-green-500') : getCssVariable('--color-red-500'), 0) },
            { stop: 1, color: adjustColorOpacity(isPositive ? getCssVariable('--color-green-500') : getCssVariable('--color-red-500'), 0.2) }
          ]);
          return gradientOrColor || 'transparent';
        }, 
        borderColor: isPositive ? getCssVariable('--color-green-500') : getCssVariable('--color-red-500'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: isPositive ? getCssVariable('--color-green-500') : getCssVariable('--color-red-500'),
        pointHoverBackgroundColor: isPositive ? getCssVariable('--color-green-500') : getCssVariable('--color-red-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
            <span className="text-gray-800 dark:text-gray-100">EUR</span> - 유럽 유로
          </h3>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {loading ? '로딩중...' : `₩${currentRate.toFixed(2)}`}
          </div>
          <div className="text-sm">
            <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}₩{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent}%)
            </span> - Today
          </div>
        </header>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        {!loading && chartValues.length > 0 && chartValues.some(v => v > 0) ? (
          <LineChart08 data={chartData} width={286} height={98} yMin={yMin} yMax={yMax} />
        ) : (
          <div className="flex items-center justify-center h-[98px] text-gray-400 text-sm">
            {loading ? '차트 로딩중...' : '데이터 없음'}
          </div>
        )}
      </div>
    </div>
  )
}