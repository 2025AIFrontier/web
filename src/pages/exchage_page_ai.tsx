import React, { useState, useEffect } from 'react';

// ==================================
// 0. 타입 정의
// ==================================
interface RawExchangeData {
  [key: string]: number | string;
  date: string;
  USD: number;
  EUR: number;
  JPY100: number;
  CNH: number;
}

const Bot = ({ size = 20, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M12 18v-2"/><path d="M9 16h6"/></svg>);
const RefreshCw = ({ size = 16, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>);


// ==================================
// 메인 컴포넌트
// ==================================
export const AIAnalysisSection = ({ rawData }: { rawData: RawExchangeData[] }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');

    // --- AI 모델 호출 로직 (시뮬레이션) ---
    // 실제 구현 시, 이 부분에 Gemini 같은 LLM API 호출 코드를 작성합니다.
    // rawData를 요약하여 프롬프트를 만들고, API로 전송합니다.
    try {
      // 예시: 2초 후 더미 분석 결과 반환
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const latest = rawData[0];
      const weekAgo = rawData[6];
      const usdChange = (((latest.USD - weekAgo.USD) / weekAgo.USD) * 100).toFixed(2);

      const dummyAnalysis = `지난 1주일간 미국 달러(USD)는 원화 대비 약 ${usdChange}% 변동하며 안정적인 모습을 보였습니다. 반면, 일본 엔(JPY)과 중국 위안(CNH)은 상대적으로 변동성이 크게 나타나, 단기적인 추세에 유의할 필요가 있습니다. 전반적으로는 주요 통화들이 박스권 내에서 움직이는 양상입니다.`;
      
      setAnalysis(dummyAnalysis);

    } catch (err) {
      setError('AI 분석 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 자동으로 분석 시작
  useEffect(() => {
    if (rawData.length > 0) {
      handleAnalysis();
    }
  }, [rawData]);

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <Bot className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">AI 환율 동향 분석</h2>
          </div>
          <button 
            onClick={handleAnalysis} 
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>다시 분석</span>
          </button>
        </div>

        {isLoading && (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!isLoading && !error && analysis && (
          <p className="text-gray-700 leading-relaxed">{analysis}</p>
        )}
         {!isLoading && !error && !analysis && (
          <p className="text-gray-500 text-sm">환율 데이터를 기반으로 AI 분석을 생성합니다.</p>
        )}
      </div>
    </div>
  );
};
