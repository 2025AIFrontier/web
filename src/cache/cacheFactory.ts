import { SessionCacheManager } from './sessionCache';
import { LocalCacheManager } from './localCache';
// import { IndexedDbCacheManager } from './indexedDbCache'; // 향후 추가

/**
 * 캐시 매니저 통합 팩토리
 * 모든 종류의 캐시 생성 및 관리
 */
export const CacheFactory = {
  
  // ==================== Session Cache (임시 데이터) ====================
  
  /**
   * 환율 데이터용 세션 캐시 (4시간)
   * 실시간성이 중요하지만 탭 내에서만 유지
   */
  createExchangeCache: () => new SessionCacheManager('exchange_rates', 4 * 60 * 60 * 1000, '1.0.0'),
  
  /**
   * 주식 데이터용 세션 캐시 (1시간)
   * 변동성이 높아 짧은 캐시 시간
   */
  createStockCache: () => new SessionCacheManager('stock_data', 1 * 60 * 60 * 1000, '1.0.0'),
  
  /**
   * 뉴스 데이터용 세션 캐시 (30분)
   * 실시간성이 매우 중요
   */
  createNewsCache: () => new SessionCacheManager('news_data', 30 * 60 * 1000, '1.0.0'),
  
  /**
   * 검색 결과용 세션 캐시 (15분)
   * 일시적 데이터, 짧은 유효기간
   */
  createSearchCache: () => new SessionCacheManager('search_results', 15 * 60 * 1000, '1.0.0'),

  /**
   * AI 분석 결과용 세션 캐시 (6시간)
   * 환율 데이터 기반 분석 결과, 중간 정도의 캐시 시간
   */
  createAIAnalysisCache: () => new SessionCacheManager('ai_analysis', 6 * 60 * 60 * 1000, '1.0.0'),

  /**
   * 시스템 모니터링 데이터용 세션 캐시 (10분)
   * 실시간 시스템 리소스 데이터
   */
  createSystemMonitorCache: () => new SessionCacheManager('system_monitor', 10 * 60 * 1000, '1.0.0'),

  // ==================== Local Cache (영구 데이터) ====================
  
  /**
   * 담당자 조회 데이터용 로컬 캐시 (7일)
   * 브라우저를 닫아도 유지되는 담당자 정보
   */
  createContactCache: () => new LocalCacheManager('contact_data', 7 * 24 * 60 * 60 * 1000, '1.0.0'),
  
  /**
   * 사용자 설정용 로컬 캐시 (30일)
   * 브라우저를 닫아도 유지되어야 하는 데이터
   */
  createUserSettingsCache: () => new LocalCacheManager('user_settings', 30 * 24 * 60 * 60 * 1000, '1.0.0'),
  
  /**
   * 테마/UI 설정용 로컬 캐시 (무기한)
   * 사용자 커스터마이징 데이터
   */
  createThemeCache: () => new LocalCacheManager('theme_settings', Infinity, '1.0.0'),

  // ==================== IndexedDB Cache (대용량 데이터) - 향후 구현 ====================
  
  /**
   * 차트 히스토리 데이터용 IndexedDB 캐시 (7일)
   * 대용량 시계열 데이터
   */
  // createChartDataCache: () => new IndexedDbCacheManager('chart_history', 7 * 24 * 60 * 60 * 1000, '1.0.0'),
  
  /**
   * 오프라인 데이터용 IndexedDB 캐시 (무기한)
   * 오프라인에서도 사용 가능한 데이터
   */
  // createOfflineDataCache: () => new IndexedDbCacheManager('offline_data', Infinity, '1.0.0'),

  // ==================== 커스텀 캐시 생성기 ====================
  
  /**
   * 커스텀 세션 캐시 생성
   */
  createCustomSessionCache: <T>(pageKey: string, durationMinutes: number, version?: string) => 
    new SessionCacheManager<T>(pageKey, durationMinutes * 60 * 1000, version),

  /**
   * 커스텀 로컬 캐시 생성
   */
  createCustomLocalCache: <T>(pageKey: string, durationDays: number, version?: string) => 
    new LocalCacheManager<T>(pageKey, durationDays * 24 * 60 * 60 * 1000, version),

  /**
   * 커스텀 IndexedDB 캐시 생성 (향후 구현)
   */
  // createCustomIndexedDbCache: <T>(pageKey: string, durationDays: number, version?: string) => 
  //   new IndexedDbCacheManager<T>(pageKey, durationDays * 24 * 60 * 60 * 1000, version),

  // ==================== 캐시 관리 유틸리티 ====================
  
  /**
   * 모든 세션 캐시 정리
   */
  clearAllSessionCaches: () => {
    const sessionKeys = Object.keys(sessionStorage).filter(key => key.includes('_session_'));
    sessionKeys.forEach(key => sessionStorage.removeItem(key));
    console.log(`[CacheFactory] ${sessionKeys.length}개의 세션 캐시가 정리되었습니다.`);
  },

  /**
   * 모든 로컬 캐시 정리
   */
  clearAllLocalCaches: () => {
    const localKeys = Object.keys(localStorage).filter(key => key.includes('_local_'));
    localKeys.forEach(key => localStorage.removeItem(key));
    console.log(`[CacheFactory] ${localKeys.length}개의 로컬 캐시가 정리되었습니다.`);
  },

  /**
   * 특정 페이지의 모든 캐시 정리 (세션 + 로컬)
   */
  clearPageCaches: (pageKey: string) => {
    // 세션 캐시 정리
    const sessionKeys = Object.keys(sessionStorage).filter(key => key.startsWith(pageKey));
    sessionKeys.forEach(key => sessionStorage.removeItem(key));
    
    // 로컬 캐시 정리
    const localKeys = Object.keys(localStorage).filter(key => key.startsWith(pageKey));
    localKeys.forEach(key => localStorage.removeItem(key));
    
    const totalCleared = sessionKeys.length + localKeys.length;
    console.log(`[CacheFactory] ${pageKey} 페이지의 ${totalCleared}개 캐시가 정리되었습니다.`);
  },

  /**
   * 캐시 사용량 통계
   */
  getCacheStats: () => {
    const sessionKeys = Object.keys(sessionStorage).filter(key => key.includes('_session_'));
    const localKeys = Object.keys(localStorage).filter(key => key.includes('_local_'));
    
    const sessionSize = sessionKeys.reduce((size, key) => {
      const value = sessionStorage.getItem(key);
      return size + (value ? new Blob([value]).size : 0);
    }, 0);
    
    const localSize = localKeys.reduce((size, key) => {
      const value = localStorage.getItem(key);
      return size + (value ? new Blob([value]).size : 0);
    }, 0);

    const totalSize = sessionSize + localSize;

    return {
      sessionCacheCount: sessionKeys.length,
      localCacheCount: localKeys.length,
      totalSizeKB: Math.round(totalSize / 1024),
      sessionSizeKB: Math.round(sessionSize / 1024),
      localSizeKB: Math.round(localSize / 1024),  
      maxSizeKB: 10240, // sessionStorage(5MB) + localStorage(5MB)
      usagePercent: Math.round((totalSize / (10240 * 1024)) * 100)
    };
  }
};