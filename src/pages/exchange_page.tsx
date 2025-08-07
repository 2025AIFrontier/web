import React, { useState, useEffect } from 'react';
// 자식 컴포넌트들의 경로는 실제 프로젝트 구조에 맞게 확인해주세요.
import { ExchangeTopSection } from './exchange_page_top';
import { ExchangeBottomSection } from './exchange_page_bottom';
import { AIAnalysisSection } from './exchage_page_ai';

// ==================================
// 0. 타입 및 아이콘 정의
// ==================================
interface RawExchangeData {
  [key: string]: number | string;
  date: string;
  USD: number;
  EUR: number;
  JPY100: number;
  CNH: number;
}

// API 응답 구조에 대한 명시적인 타입 정의
interface ApiResponse {
    success: boolean;
    data: RawExchangeData[];
    error?: string;
}

// lucide-react 아이콘을 SVG로 대체
const RefreshCw = ({ size = 16, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>);
const AlertCircle = ({ size = 48, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const ChevronsDown = ({ size = 20, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7 13 5 5 5-5"/><path d="m7 6 5 5 5-5"/></svg>);
const LayoutDashboard = ({ size = 20, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>);


// ==================================
// 메인 페이지 컴포넌트
// ==================================
export const ExchangePage: React.FC = () => {
  const [rawData, setRawData] = useState<RawExchangeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [viewMode, setViewMode] = useState<'dashboard' | 'simulation'>('dashboard');

  const cacheManager = {
      load: () => JSON.parse(sessionStorage.getItem('exchange_cache') || 'null'),
      save: (data: RawExchangeData[]) => sessionStorage.setItem('exchange_cache', JSON.stringify(data)),
      getAge: () => sessionStorage.getItem('exchange_cache_time') || '',
      setAge: () => sessionStorage.setItem('exchange_cache_time', new Date().toLocaleTimeString('ko-KR')),
  };

  const fetchExchangeData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!forceRefresh) {
        const cachedData = cacheManager.load();
        if (cachedData) {
          setRawData(cachedData);
          setLastUpdated(cacheManager.getAge());
          setLoading(false);
          return;
        }
      }
      
      // --- API 통신 핵심 부분 ---
      // 1. .env 파일에 API 서버 주소를 설정해야 합니다.
      //    (예: VITE_EXCHANGE_API_URL=http://localhost:5000)
      const apiUrl = import.meta.env.VITE_EXCHANGE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL이 설정되지 않았습니다. 프로젝트 루트의 .env 파일에 VITE_EXCHANGE_API_URL을 설정해주세요.");
      }

      // 2. Python API의 `/exchange_db2api` 엔드포인트를 호출합니다.
      const url = `${apiUrl}/exchange_db2api?days=14&format=web&_t=${Date.now()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        // 서버에서 에러 응답이 온 경우, 응답 텍스트를 포함하여 에러를 표시
        const errorText = await response.text();
        throw new Error(`API 서버 에러: ${response.status} - ${errorText}`);
      }
      
      const result: ApiResponse = await response.json();

      // 3. API 응답 구조에 맞춰 데이터를 처리합니다.
      if (result && result.success) {
        setRawData(result.data);
        cacheManager.save(result.data);
        cacheManager.setAge();
        setLastUpdated(new Date().toLocaleTimeString('ko-KR'));
      } else {
        // API가 success: false를 반환한 경우
        throw new Error(result.error || 'API에서 데이터를 가져오는데 실패했습니다.');
      }
    } catch (err) {
      // 네트워크 에러 또는 기타 예외 처리
      console.error("Fetch Error:", err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExchangeData(false); }, []);

  const PageHeader = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex justify-between items-center">
        <div className="flex space-x-4 items-center">
            <div className="text-lg font-bold text-gray-800">환율조회</div>
            {lastUpdated && !loading && <div className="text-sm text-gray-500">마지막 업데이트: {lastUpdated}</div>}
            {loading && <div className="text-sm text-gray-500">데이터를 불러오는 중...</div>}
        </div>
        <button onClick={() => fetchExchangeData(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-70" disabled={loading}>
            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            <span>새로고침</span>
        </button>
    </div>
  );

  const PageContent = () => {
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">데이터 로딩 오류</h2>
                <p className="text-gray-600 mb-4 break-all">{error}</p>
                <button onClick={() => fetchExchangeData(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">다시 시도</button>
            </div>
        );
    }
    if (loading && rawData.length === 0) {
        return (
             <div className="text-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
                <p>환율 데이터를 불러오고 있습니다.</p>
            </div>
        );
    }
    
    if (viewMode === 'simulation') {
        return <ExchangeBottomSection rawData={rawData} />;
    }

    return (
        <>
            <ExchangeTopSection rawData={rawData} />
            <AIAnalysisSection rawData={rawData} />
        </>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <PageHeader />
      <PageContent />
      <div className="max-w-7xl mx-auto mt-8">
          <button 
            onClick={() => setViewMode(prev => prev === 'dashboard' ? 'simulation' : 'dashboard')}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            {viewMode === 'dashboard' ? (
                <><ChevronsDown size={20} /><span>교차환율 시뮬레이션 열기</span></>
            ) : (
                <><LayoutDashboard size={20} /><span>전체 대시보드로 돌아가기</span></>
            )}
          </button>
      </div>
    </div>
  );
};

export default ExchangePage;
