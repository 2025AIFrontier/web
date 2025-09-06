'use client'

import LineChart08 from '@/components/charts/line-chart-08'
import { chartAreaGradient } from '@/components/charts/chartjs-config'

// Import utilities
import { adjustColorOpacity, getCssVariable } from '@/components/utils/utils'

interface StockCardProps {
  ticker: string
  company: string
  price: string
  change: string
  changePercent: string
  isPositive: boolean
  data: number[]
  labels?: string[]
  color: 'red' | 'green' | 'blue' | 'yellow'
}

export default function StockCardTemplate({
  ticker,
  company,
  price,
  change,
  changePercent,
  isPositive,
  data,
  labels,
  color
}: StockCardProps) {

  const colorMap = {
    red: '--color-red-500',
    green: '--color-green-500',
    blue: '--color-blue-500',
    yellow: '--color-yellow-500'
  }

  const changeColorClass = isPositive ? 'text-green-600' : 'text-red-500'

  const chartData = {
    labels: labels || [],
    datasets: [
      {
        data: data,
        fill: true,
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          const gradientOrColor = chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable(colorMap[color]), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable(colorMap[color]), 0.2) }
          ]);
          return gradientOrColor || 'transparent';
        }, 
        borderColor: getCssVariable(colorMap[color]),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable(colorMap[color]),
        pointHoverBackgroundColor: getCssVariable(colorMap[color]),
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
            <span className="text-gray-800 dark:text-gray-100">{ticker}</span> - {company}
          </h3>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{price}</div>
          <div className="text-sm">
            <span className={`font-medium ${changeColorClass}`}>
              {isPositive ? '+' : ''}{change} ({changePercent})
            </span> - Today
          </div>
        </header>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart08 data={chartData} width={286} height={98} />
      </div>
    </div>
  )
}