import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { TaskPageTopSection } from './TaskPageTopSection';
import { TaskPageBottomSection } from './TaskPageBottomSection';
const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
import { CacheFactory } from '../cache/cacheFactory';

export interface ProjectData {
  과제구분: string;
  과제: string;
  DVR계획: string;
  DVR실행: string;
  PVR계획: string;
  PVR실행: string;
  PRA계획: string;
  PRA실행: string;
  SRA계획: string;
  SRA실행: string;
}

interface ApiResponse {
  data: {
    columns: string[];
    rows: string[][];
  };
  success: boolean;
}

const TaskPage: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheAge, setCacheAge] = useState<string>('');
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // 프로젝트 일정 데이터용 캐시 (4시간 유효)
  const projectCacheManager = CacheFactory.createCustomSessionCache<ProjectData[]>('project_schedule', 240, '1.0.0');

  useEffect(() => {
    loadProjectData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadProjectData = async () => {
    try {
      // 1. 캐시에서 데이터 확인
      const cachedData = projectCacheManager.load();
      
      if (cachedData) {
        console.log('📋 캐시된 프로젝트 데이터 사용');
        setProjectData(cachedData);
        setCacheAge(projectCacheManager.getAge());
        setLoading(false);
        return;
      }

      // 2. 캐시에 없으면 API 호출
      console.log('🌐 API에서 프로젝트 데이터 로드');
      await fetchProjectData();
      
    } catch (error) {
      console.error('프로젝트 데이터 로딩 실패:', error);
      setError('데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const fetchProjectData = async (forceRefresh = false) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);
      
      if (forceRefresh) {
        projectCacheManager.clear();
      }
      
      // Simple Request로 변경 (OPTIONS 요청 방지)
      const url = forceRefresh 
        ? `http://${API_HOST}:${API_PORT}/api/project-schedule?_t=${Date.now()}` // 캐시 무효화용 타임스탬프
        : `http://${API_HOST}:${API_PORT}/api/project-schedule`;
        
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }

      const apiData: ApiResponse = await response.json();

      if (apiData.success && apiData.data) {
        const formattedData: ProjectData[] = apiData.data.rows.map(row => ({
          과제구분: row[0],
          과제: row[1],
          DVR계획: row[2],
          DVR실행: row[3],
          PVR계획: row[4],
          PVR실행: row[5],
          PRA계획: row[6],
          PRA실행: row[7],
          SRA계획: row[8],
          SRA실행: row[9]
        }));
        
        setProjectData(formattedData);
        
        // 캐시에 저장
        const saved = projectCacheManager.save(formattedData);
        if (saved) {
          setCacheAge('방금 전 API호출');
          console.log('💾 프로젝트 데이터가 캐시에 저장되었습니다.');
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRefresh = () => {
    console.log('🔄 수동 새로고침 요청');
    fetchProjectData(true);
  };

  const getCacheInfo = () => {
    const info = projectCacheManager.getInfo();
    if (!info.exists) return null;
    
    const expiresInMinutes = projectCacheManager.getTimeToExpiry();
    return {
      age: cacheAge,
      expiresIn: expiresInMinutes,
      sizeKB: info.size ? Math.round(info.size / 1024) : 0
    };
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <span className="ml-2 text-lg text-gray-600">데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="text-red-600 mr-2" size={20} />
            <span className="text-red-800 font-semibold">오류 발생</span>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button 
            onClick={() => fetchProjectData()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const cacheInfo = getCacheInfo();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">과제 조회</h1>
            <p className="text-gray-600 text-lg">진행 중인 프로젝트와 과제 현황을 확인하세요</p>
          </div>
          <div className="flex items-center gap-4">
            {/* 캐시 정보 표시 */}
            {cacheInfo && (
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{cacheInfo.age}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {cacheInfo.expiresIn}분 후 만료 • {cacheInfo.sizeKB}KB
                </div>
              </div>
            )}
            
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              새로고침
            </button>
          </div>
        </div>
      </div>

      <TaskPageTopSection projectData={projectData} />
      <TaskPageBottomSection projectData={projectData} />
    </div>
  );
};

export default TaskPage;