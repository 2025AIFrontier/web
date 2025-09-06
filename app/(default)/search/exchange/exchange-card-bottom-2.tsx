
interface CrossRateData {
  pair: string
  rate: number
  change: number
  changePercent: string
  isPositive: boolean
  high52w: number
  low52w: number
}

interface ExchangeCardBottom2Props {
  exchangeData: {
    usd: number
    eur: number
    cny: number
    jpy100?: number
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
}

export default function ExchangeCard06({ exchangeData }: ExchangeCardBottom2Props) {
  // 교차 환율 계산 함수
  const calculateCrossRate = (fromCurrency: number, toCurrency: number) => {
    return fromCurrency / toCurrency
  }

  // 52주 최고/최저 계산
  const calculate52WeekHighLow = (history: any[], fromKey: string, toKey: string) => {
    if (!history || history.length === 0) return { high: 0, low: 0 }
    
    const rates = history.map(item => {
      const from = item[fromKey] || 0
      const to = item[toKey] || 0
      return to > 0 ? from / to : 0
    }).filter(rate => rate > 0)
    
    if (rates.length === 0) return { high: 0, low: 0 }
    
    return {
      high: Math.max(...rates),
      low: Math.min(...rates)
    }
  }

  // 변동률 계산
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return { change: 0, percent: '0.00%', isPositive: true }
    const change = current - previous
    const percent = ((change / previous) * 100).toFixed(2)
    return {
      change: change,
      percent: `${percent}%`,
      isPositive: change >= 0
    }
  }

  // USD/KRW는 직접 환율
  const usdKrw = exchangeData.usd
  const previousUsdKrw = exchangeData.previousUsd || usdKrw
  const usdKrwChange = calculateChange(usdKrw, previousUsdKrw)
  const usdKrw52w = calculate52WeekHighLow(exchangeData.history || [], 'usd', 'usd')

  // USD/EUR 교차 환율 계산 (USD/KRW ÷ EUR/KRW)
  const usdEur = calculateCrossRate(exchangeData.usd, exchangeData.eur)
  const previousUsdEur = exchangeData.previousUsd && exchangeData.previousEur 
    ? calculateCrossRate(exchangeData.previousUsd, exchangeData.previousEur)
    : usdEur
  const usdEurChange = calculateChange(usdEur, previousUsdEur)
  const usdEur52w = calculate52WeekHighLow(exchangeData.history || [], 'usd', 'eur')

  // USD/JPY 교차 환율 계산 (USD/KRW ÷ (JPY100/KRW / 100))
  const jpy = (exchangeData.jpy100 || 0) / 100
  const usdJpy = jpy > 0 ? calculateCrossRate(exchangeData.usd, jpy) : 0
  const previousJpy = (exchangeData.previousJpy100 || 0) / 100
  const previousUsdJpy = exchangeData.previousUsd && previousJpy > 0
    ? calculateCrossRate(exchangeData.previousUsd, previousJpy)
    : usdJpy
  const usdJpyChange = calculateChange(usdJpy, previousUsdJpy)
  const usdJpy52w = calculate52WeekHighLow(
    (exchangeData.history || []).map(item => ({
      ...item,
      jpy: (item.jpy100 || 0) / 100
    })),
    'usd',
    'jpy'
  )

  // USD/CNH 교차 환율 계산 (USD/KRW ÷ CNY/KRW)
  const usdCnh = calculateCrossRate(exchangeData.usd, exchangeData.cny)
  const previousUsdCnh = exchangeData.previousUsd && exchangeData.previousCny
    ? calculateCrossRate(exchangeData.previousUsd, exchangeData.previousCny)
    : usdCnh
  const usdCnhChange = calculateChange(usdCnh, previousUsdCnh)
  const usdCnh52w = calculate52WeekHighLow(exchangeData.history || [], 'usd', 'cny')

  const crossRates: CrossRateData[] = [
    {
      pair: 'USD/KRW',
      rate: usdKrw,
      ...usdKrwChange,
      high52w: usdKrw52w.high,
      low52w: usdKrw52w.low
    },
    {
      pair: 'USD/EUR',
      rate: usdEur,
      ...usdEurChange,
      high52w: usdEur52w.high,
      low52w: usdEur52w.low
    },
    {
      pair: 'USD/JPY',
      rate: usdJpy,
      ...usdJpyChange,
      high52w: usdJpy52w.high,
      low52w: usdJpy52w.low
    },
    {
      pair: 'USD/CNH',
      rate: usdCnh,
      ...usdCnhChange,
      high52w: usdCnh52w.high,
      low52w: usdCnh52w.low
    }
  ]
  return(
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">교차 환율</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">통화쌍</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">현재 환율</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">변동률</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-right">52주 최고/최저</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {crossRates.map((rate, index) => {
                const currencyColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500']
                const currencyLabels = ['KRW', 'EUR', 'JPY', 'CNH']
                
                return (
                  <tr key={index}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`shrink-0 rounded-full mr-2 sm:mr-3 ${currencyColors[index]}`}>
                          <span className="flex items-center justify-center w-9 h-9 text-white text-xs font-bold">
                            {currencyLabels[index]}
                          </span>
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">{rate.pair}</div>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center font-medium">
                        {rate.pair === 'USD/KRW' 
                          ? rate.rate.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : rate.rate.toFixed(4)}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className={`font-medium text-center ${rate.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {rate.isPositive ? '+' : ''}{rate.percent}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-right text-xs">
                        <div className="text-gray-500">
                          H: {rate.pair === 'USD/KRW' 
                            ? rate.high52w.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : rate.high52w.toFixed(4)}
                        </div>
                        <div className="text-gray-500">
                          L: {rate.pair === 'USD/KRW'
                            ? rate.low52w.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : rate.low52w.toFixed(4)}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="text-center border-t border-gray-100 dark:border-gray-700/60 px-2">
          <a className="block text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 pt-4 pb-1" href="#0">
            View All -&gt;
          </a>
        </div>
      </div>
    </div>
  )
}
