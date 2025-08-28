'use client'

import { useFlyoutContext } from '@/app/flyout-context'
import Datepicker from '@/components/datepicker'

export default function ExchangeHeader() {
  const { setFlyoutOpen } = useFlyoutContext()

  return (
    <div className="sm:flex sm:justify-between sm:items-center mb-5">
      {/* Left: Title */}
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">환율</h1>
      </div>

      {/* Right: Actions */}
      <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        {/* Datepicker built with React Day Picker */}
        <Datepicker />

        {/* Calculator button */}
        <button 
          onClick={() => setFlyoutOpen(true)}
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          <svg className="fill-current shrink-0 mr-2" width="16" height="16" viewBox="0 0 16 16">
            <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1zM5 12H3v-2h2v2zm0-4H3V6h2v2zm0-4H3V2h2v2zm4 8H7v-2h2v2zm0-4H7V6h2v2zm0-4H7V2h2v2zm4 8h-2v-2h2v2zm0-4h-2V6h2v2zm0-4h-2V2h2v2z" />
          </svg>
          <span>환율 계산기</span>
        </button>
      </div>
    </div>
  )
}