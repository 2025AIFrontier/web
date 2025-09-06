'use client'

import DoughnutChart from '@/components/charts/doughnut-chart'

// Import utilities
import { getCssVariable } from '@/components/utils/utils'

export default function DashboardCard06() {

  // 실제 개수 데이터
  const projectCounts = {
    production: 45,      // 양산
    developmentDVR: 30,  // 개발(~DVR)
    developmentPVR: 25   // 개발(~PVR)
  }

  const total = projectCounts.production + projectCounts.developmentDVR + projectCounts.developmentPVR

  const chartData = {
    labels: [
      `양산: ${projectCounts.production}건`,
      `개발(~DVR): ${projectCounts.developmentDVR}건`,
      `개발(~PVR): ${projectCounts.developmentPVR}건`
    ],
    datasets: [
      {
        label: '과제 현황',
        data: [
          projectCounts.production,
          projectCounts.developmentDVR,
          projectCounts.developmentPVR,
        ],
        backgroundColor: [
          getCssVariable('--color-violet-500'),
          getCssVariable('--color-sky-500'),
          getCssVariable('--color-violet-800'),
        ],
        hoverBackgroundColor: [
          getCssVariable('--color-violet-600'),
          getCssVariable('--color-sky-600'),
          getCssVariable('--color-violet-900'),
        ],
        borderWidth: 0,
      },
    ],
  }

  return(
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">과제 현황</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">총 {total}건</span>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  )
}
