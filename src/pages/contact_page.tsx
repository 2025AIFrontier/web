import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Grid3x3, Network, RefreshCw, Trash2, Clock, HardDrive } from 'lucide-react';
import { Employee } from '../types/api';
import { CacheFactory } from '../cache/cacheFactory';

const ContactPageTable = lazy(() => import('./contact_page_table'));
const ContactPageGraphView = lazy(() => import('./contact_page_graphview'));

export interface EmployeeListResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    count: number;
  };
  filters: {
    department_code?: string;
    company_code?: string;
  };
}

export interface GetEmployeesParams {
  fullname?: string;
  emailaddress?: string;
  departmentname?: string;
  companyname?: string;
}

const ContactPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');
  const [cacheInfo, setCacheInfo] = useState<string>('');
  
  const [audienceType, setAudienceType] = useState<Set<'internal' | 'external'>>(new Set());

  const toggleAudienceType = (type: 'internal' | 'external') => {
    setAudienceType(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };
  
  // 담당자 데이터용 로컬 캐시 생성
  const contactCache = CacheFactory.createContactCache();

  // 메시지 상수
  const MESSAGES = {
    LOAD_ERROR: '직원 데이터를 불러올 수 없습니다',
    API_ERROR: '데이터 로드 중 오류가 발생했습니다',
    CONNECTION_ERROR: 'API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
  };

  // 디버그 모드 (운영/개발 분리)
  const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';
  const debug = (action: string, data?: any) => {
    if (DEBUG_MODE) console.log(`[Contact] ${action}:`, data);
  };

  const getEmployeesFromDB = async (params?: GetEmployeesParams): Promise<EmployeeListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.fullname) queryParams.append('fullname', params.fullname);
    if (params?.emailaddress) queryParams.append('emailaddress', params.emailaddress);
    if (params?.departmentname) queryParams.append('departmentname', params.departmentname);
    if (params?.companyname) queryParams.append('companyname', params.companyname);

    // nginx 프록시를 통한 동적 baseUrl 사용
    const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
    const contactApiUrl = '/api/contacts';
    const url = `${baseUrl}${contactApiUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    debug('API 요청', { url, params });
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API 요청 실패 (${response.status}): ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error(`서버에서 JSON이 아닌 응답을 받았습니다. Content-Type: ${contentType}`);
      }
      
      const data = await response.json();
      debug('API 응답', data);
      return data;
    } catch (error) {
      debug('API 오류', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(MESSAGES.CONNECTION_ERROR);
      }
      throw error;
    }
  };

  // 캐시에서 데이터 로드 시도
  const loadFromCache = (): EmployeeListResponse | null => {
    const cachedData = contactCache.load();
    if (cachedData) {
      setCacheInfo(contactCache.getAge());
      debug('캐시에서 데이터 로드', cachedData);
      return cachedData;
    }
    return null;
  };

  // 서버에서 최신 데이터 확인 및 로드
  const loadEmployees = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // 강제 새로고침이 아닌 경우 캐시 먼저 확인
      if (!forceRefresh) {
        const cachedData = loadFromCache();
        if (cachedData && cachedData.success) {
          setEmployees(cachedData.data);
          setTotalCount(cachedData.pagination.total);
          setLoading(false);
          return;
        }
      }

      // 캐시에 데이터가 없거나 강제 새로고침인 경우 API 호출
      const response = await getEmployeesFromDB();
      
      if (response.success) {
        setEmployees(response.data);
        setTotalCount(response.pagination.total);
        
        // 응답 데이터를 캐시에 저장
        const lastModified = new Date().toISOString(); // 실제로는 서버 응답 헤더에서 가져와야 함
        contactCache.save(response, lastModified);
        setCacheInfo('방금 전 서버에서 업데이트');
        
        debug('데이터 로드 성공', { count: response.data.length, total: response.pagination.total });
      } else {
        setError(MESSAGES.LOAD_ERROR);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.API_ERROR;
      setError(errorMessage);
      debug('데이터 로드 실패', error);
    } finally {
      setLoading(false);
    }
  };

  // 캐시 삭제 함수
  const clearCache = () => {
    contactCache.clear();
    setCacheInfo('');
    debug('캐시 삭제됨');
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">담당자 조회</h1>
            <p className="text-gray-600 text-lg">부서별 담당자 정보와 연락처를 확인하세요</p>
            
            <div className="mt-4 flex gap-3">
              {['internal', 'external'].map(type => (
                <button
                  key={type}
                  onClick={() => toggleAudienceType(type as 'internal' | 'external')}
                  className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                    audienceType.has(type as 'internal' | 'external')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {type === 'internal' ? '사내' : '사외'}
                </button>
              ))}
            </div>
            
            {/* 캐시 정보 표시 */}
            {cacheInfo && (
              <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                <HardDrive size={16} />
                <span>{cacheInfo}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            {/* 뷰 모드 선택 */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid3x3 size={20} />
                표 보기
              </button>
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'graph'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Network size={20} />
                그래프
              </button>
            </div>
            
            {/* 캐시 제어 버튼들 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadEmployees(true)}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                새로고침
              </button>
              <button
                onClick={clearCache}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 size={16} />
                캐시 삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">컴포넌트를 불러오는 중...</span>
        </div>
      }>
        {viewMode === 'table' ? (
          <ContactPageTable
            employees={employees}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            totalCount={totalCount}
            onSearchChange={handleSearchChange}
            onRefresh={() => loadEmployees(true)}
          />
        ) : (
          <ContactPageGraphView
            employees={employees}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            totalCount={totalCount}
            onSearchChange={handleSearchChange}
            onRefresh={() => loadEmployees(true)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ContactPage; 