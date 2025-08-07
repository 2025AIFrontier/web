import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
const AI_API_HOST = import.meta.env.VITE_AI_API_HOST;
const AI_API_PORT = import.meta.env.VITE_AI_API_PORT;
import { RawExchangeData } from '../types/exchange.ts';
import { CacheFactory } from '../cache/cacheFactory';

// ==================== 설정 ====================
const ENABLE_AI_ANALYSIS = true; // ✅ 이 값으로 AI 분석 on/off

interface AIAnalysisSectionProps {
  rawData: RawExchangeData[];
}

export const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({ rawData }) => {
  // AI 분석 관련 상태
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<string>('');

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingStartTimeRef = useRef<number | null>(null);
  
  // AI 분석 캐시 매니저
  const aiCacheManager = CacheFactory.createAIAnalysisCache();

  // 환율 데이터 해시 생성 (캐시 키로 사용)
  const generateDataHash = (data: RawExchangeData[]): string => {
    if (!data || data.length === 0) return '';
    const latest = data[0];
    return `${latest?.date}-${latest?.USD}-${latest?.EUR}-${latest?.JPY100}-${latest?.CNH}`;
  };

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    pollingStartTimeRef.current = null;
  };

  // ✅ AI 분석 시작 및 폴링 함수 (별도 AI API 사용)
  const runAIAnalysisPolling = async () => {
    if (!rawData || rawData.length === 0) {
      setAnalysisError('환율 데이터가 없습니다. 먼저 환율 데이터를 불러와주세요.');
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError(null);
    pollingStartTimeRef.current = Date.now();

    try {
      // 1. AI 분석 시작 (Exchange API 프록시를 통해)
      const startResponse = await fetch(`http://${AI_API_HOST}:${AI_API_PORT}/api/ai-analysis/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
        // 환율 데이터는 Exchange API에서 직접 DB에서 가져오므로 전송 불필요
      });

      if (!startResponse.ok) {
        throw new Error(`AI 분석 시작 실패: ${startResponse.status}`);
      }

      const startResult = await startResponse.json();
      console.log('AI 분석 시작:', startResult);

      // 2. 분석 상태 폴링 (가벼운 엔드포인트 사용)
      pollingIntervalRef.current = setInterval(async () => {
        // 타임아웃 체크 (30초)
        if (pollingStartTimeRef.current && Date.now() - pollingStartTimeRef.current > 30000) {
          clearPolling();
          setAnalysisLoading(false);
          setAnalysisError('분석 시간이 초과되었습니다. 다시 시도해주세요.');
          return;
        }

        try {
          // AI 상태 확인 (Exchange API 프록시를 통해)
          const statusResponse = await fetch(`http://${AI_API_HOST}:${AI_API_PORT}/api/ai-analysis/status`);
          if (!statusResponse.ok) throw new Error(`HTTP error! status: ${statusResponse.status}`);
          
          const statusResult = await statusResponse.json();

          console.log('AI Status Response:', statusResult); // 디버그 로그 추가
          
          if (statusResult.success && statusResult.status === 'completed' && statusResult.analysis) {
            const dataHash = generateDataHash(rawData);
            
            // 캐시에 분석 결과 저장
            aiCacheManager.save(statusResult.analysis);
            
            setAnalysisResult(statusResult.analysis);
            setAnalysisLoading(false);
            setAnalysisError(null);
            setAnalysisCompleted(true);
            setCacheInfo(`캐시됨 (${aiCacheManager.getAge()})`);
            clearPolling(); // Stop polling immediately when completed
            return; // Exit the polling function
          } else if (statusResult.success && statusResult.status === 'failed') {
            setAnalysisError(statusResult.error || 'AI 분석에 실패했습니다.');
            setAnalysisLoading(false);
            clearPolling(); // Stop polling on failure
            return; // Exit the polling function
          } else if (!statusResult.success) {
            setAnalysisError(statusResult.error || 'AI 서비스 오류가 발생했습니다.');
            setAnalysisLoading(false);
            clearPolling(); // Stop polling on error
            return; // Exit the polling function
          }
          // status === 'processing'인 경우 계속 폴링
        } catch (err) {
          console.error('Error polling AI analysis status:', err);
          // 연속된 에러 발생 시 폴링 중단
          if (err instanceof Error && err.message.includes('fetch')) {
            clearPolling();
            setAnalysisLoading(false);
            setAnalysisError('서버 연결이 중단되었습니다. 다시 시도해주세요.');
          }
        }
      }, 3000); // 3초마다 상태 확인

    } catch (err) {
      console.error('Error starting AI analysis:', err);
      setAnalysisError('AI 분석을 시작할 수 없습니다. 서버를 확인해주세요.');
      setAnalysisLoading(false);
    }
  };

  const handleRetryAnalysis = () => {
    clearPolling();
    
    // 캐시 초기화
    aiCacheManager.clear();
    
    setAnalysisResult(null);
    setAnalysisError(null);
    setAnalysisLoading(false);
    setAnalysisCompleted(false);
    setCacheInfo('');
    runAIAnalysisPolling();
  };

  // rawData가 변경되면 캐시 확인 후 필요시 AI 분석 시작
  const lastDataHashRef = useRef<string>('');
  
  useEffect(() => {
    if (ENABLE_AI_ANALYSIS && rawData && rawData.length > 0 && !analysisLoading) {
      const currentDataHash = generateDataHash(rawData);
      
      // 데이터가 실제로 변경되지 않았으면 아무것도 하지 않음
      if (lastDataHashRef.current === currentDataHash) {
        return;
      }
      
      lastDataHashRef.current = currentDataHash;
      
      // 기존 폴링이 진행중이면 정리
      clearPolling();
      
      // 캐시에서 분석 결과 확인
      const cachedResult = aiCacheManager.load();
      if (cachedResult) {
        // 캐시된 결과가 있으면 바로 사용
        setAnalysisResult(cachedResult);
        setAnalysisLoading(false);
        setAnalysisError(null);
        setAnalysisCompleted(true);
        setCacheInfo(`캐시됨 (${aiCacheManager.getAge()})`);
        console.log('AI analysis loaded from cache');
        return;
      }
      
      // 캐시가 없으면 기존 분석 결과 초기화 후 새로운 분석 시작
      setAnalysisResult(null);
      setAnalysisError(null);
      setAnalysisCompleted(false);
      setCacheInfo('');
      
      // 새로운 분석 시작
      runAIAnalysisPolling();
    }

    // 컴포넌트 언마운트 시 폴링 정리
    return () => clearPolling();
  }, [rawData, analysisLoading]);

  // AI 분석이 비활성화된 경우
  if (!ENABLE_AI_ANALYSIS) {
    return null;
  }

  return (
    <div className="mt-6 bg-white rounded-lg border p-6 shadow-sm max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">AI 분석 결과</h3>
        {!analysisLoading && !analysisError && !analysisResult && (
          <button
            onClick={runAIAnalysisPolling}
            className="ml-auto px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            분석 시작
          </button>
        )}
      </div>

      {analysisLoading && (
        <div className="text-center py-8 text-gray-600">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-2" size={20} />
          AI가 환율 데이터를 분석하고 있습니다...<br />
          <span className="text-sm text-gray-500">최대 30초 소요</span>
        </div>
      )}

      {analysisError && (
        <div className="text-center py-8">
          <AlertCircle className="text-red-500 mx-auto mb-2" size={20} />
          <p className="text-red-600 mb-4">{analysisError}</p>
          <button 
            onClick={handleRetryAnalysis} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 분석하기
          </button>
        </div>
      )}

      {analysisResult && (
        <div className="prose max-w-none bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-800 whitespace-pre-wrap">{analysisResult}</p>
          <div className="mt-4">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span>분석 완료 시간: {new Date().toLocaleTimeString('ko-KR')}</span>
              {cacheInfo && (
                <span className="px-2 py-1 bg-green-100 text-green-600 rounded">
                  🗄️ {cacheInfo}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {!analysisLoading && !analysisError && !analysisResult && (
        <div className="text-center text-gray-500 py-8">
          환율 데이터를 기반으로 AI 분석을 시작할 수 있습니다.
          <br />
          <span className="text-sm">위의 "분석 시작" 버튼을 클릭하세요.</span>
        </div>
      )}
    </div>
  );
};