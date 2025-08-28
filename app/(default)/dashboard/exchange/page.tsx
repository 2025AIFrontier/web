export const metadata = {
  title: '환율 - Mosaic',
  description: '환율 정보 페이지',
}

import ExchangeHeader from './exchange-header'
import FintechIntro from './fintech-intro'
import FintechCard14 from './fintech-card-14'
import ExchangeRateCard from './ExchangeRateCard'

export default function Exchange() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">

      {/* Page header with calculator button */}
      <ExchangeHeader />

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">

        {/* Page Intro - Hey Mary 카드를 맨 위에 배치 */}
        <FintechIntro />
        
        {/* Line charts (Exchange Rate graphs) - 4개 환율 카드를 두 번째 줄에 배치 */}
        <ExchangeRateCard currency="USD" currencyName="미국 달러" currencySymbol="USD" />
        <ExchangeRateCard currency="EUR" currencyName="유럽 유로" currencySymbol="EUR" />
        <ExchangeRateCard currency="CNH" currencyName="중국 위안화" currencySymbol="CNY" />
        <ExchangeRateCard currency="JPY100" currencyName="일본 엔(100엔)" currencySymbol="JPY" />
        
        {/* Table (Market Trends) - 마켓 트렌드 테이블을 세 번째 줄에 배치 */}
        <FintechCard14 />

      </div>
    </div>
  )
}
