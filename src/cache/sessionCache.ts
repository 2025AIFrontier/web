interface CacheConfig {
  readonly cacheKey: string;
  readonly timestampKey: string;
  readonly duration: number; // milliseconds
}

interface CacheMetadata {
  timestamp: number;
  expiresAt: number;
  version: string;
}

interface CacheItem<T> {
  data: T;
  metadata: CacheMetadata;
}

/**
 * SessionStorage 기반 캐시 관리자
 * 탭이 닫히면 삭제되는 임시 캐시
 */
export class SessionCacheManager<T = any> {
  private config: CacheConfig;
  private version: string = '1.0.0';

  constructor(
    pageKey: string, 
    duration: number = 4 * 60 * 60 * 1000, // 기본 4시간
    version?: string
  ) {
    this.config = {
      cacheKey: `${pageKey}_session_cache`,
      timestampKey: `${pageKey}_session_timestamp`,
      duration
    };
    
    if (version) {
      this.version = version;
    }
  }

  /**
   * 캐시된 데이터 로드
   */
  load(): T | null {
    try {
      const cachedData = sessionStorage.getItem(this.config.cacheKey);
      const cachedTimestamp = sessionStorage.getItem(this.config.timestampKey);
      
      if (!cachedData || !cachedTimestamp) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      const timestamp = parseInt(cachedTimestamp);
      
      // 버전 체크
      if (cacheItem.metadata.version !== this.version) {
        console.log(`캐시 버전 불일치. 기존: ${cacheItem.metadata.version}, 현재: ${this.version}`);
        this.clear();
        return null;
      }

      // 만료 시간 체크
      const now = Date.now();
      const cacheAge = now - timestamp;
      
      if (cacheAge < this.config.duration) {
        const ageInMinutes = Math.floor(cacheAge / (60 * 1000));
        const ageInHours = Math.floor(ageInMinutes / 60);
        
        if (ageInMinutes < 60) {
          console.log(`[SessionCache] 캐시된 데이터 사용 중... (${ageInMinutes}분 전)`);
        } else {
          console.log(`[SessionCache] 캐시된 데이터 사용 중... (${ageInHours}시간 ${ageInMinutes % 60}분 전)`);
        }
        
        return cacheItem.data;
      } else {
        console.log('[SessionCache] 캐시 만료로 새 데이터를 가져옵니다.');
        this.clear();
        return null;
      }
    } catch (error) {
      console.error('[SessionCache] 캐시 데이터 로드 실패:', error);
      this.clear(); // 손상된 캐시 정리
      return null;
    }
  }

  /**
   * 데이터를 캐시에 저장
   */
  save(data: T): boolean {
    try {
      const now = Date.now();
      const cacheItem: CacheItem<T> = {
        data,
        metadata: {
          timestamp: now,
          expiresAt: now + this.config.duration,
          version: this.version
        }
      };

      sessionStorage.setItem(this.config.cacheKey, JSON.stringify(cacheItem));
      sessionStorage.setItem(this.config.timestampKey, now.toString());
      
      const durationInHours = this.config.duration / (60 * 60 * 1000);
      console.log(`[SessionCache] 데이터가 세션 캐시에 저장되었습니다. (${durationInHours}시간 유효)`);
      return true;
    } catch (error) {
      console.error('[SessionCache] 캐시 저장 실패:', error);
      return false;
    }
  }

  /**
   * 캐시 데이터 삭제
   */
  clear(): void {
    try {
      sessionStorage.removeItem(this.config.cacheKey);
      sessionStorage.removeItem(this.config.timestampKey);
      console.log('[SessionCache] 캐시가 정리되었습니다.');
    } catch (error) {
      console.error('[SessionCache] 캐시 정리 실패:', error);
    }
  }

  /**
   * 캐시 나이 정보 반환
   */
  getAge(): string {
    try {
      const cachedTimestamp = sessionStorage.getItem(this.config.timestampKey);
      if (!cachedTimestamp) {
        return '캐시 없음';
      }

      const timestamp = parseInt(cachedTimestamp);
      const ageInMinutes = Math.floor((Date.now() - timestamp) / (60 * 1000));
      
      if (ageInMinutes < 60) {
        return `${ageInMinutes}분 전 세션캐시`;
      } else {
        const ageInHours = Math.floor(ageInMinutes / 60);
        const remainingMinutes = ageInMinutes % 60;
        return `${ageInHours}시간 ${remainingMinutes}분 전 세션캐시`;
      }
    } catch (error) {
      console.error('[SessionCache] 캐시 나이 계산 실패:', error);
      return '캐시 정보 오류';
    }
  }

  /**
   * 캐시 상태 확인
   */
  getInfo(): {
    exists: boolean;
    age?: number;
    expiresIn?: number;
    version?: string;
    size?: number;
    type: 'session';
  } {
    try {
      const cachedData = sessionStorage.getItem(this.config.cacheKey);
      const cachedTimestamp = sessionStorage.getItem(this.config.timestampKey);
      
      if (!cachedData || !cachedTimestamp) {
        return { exists: false, type: 'session' };
      }

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      const timestamp = parseInt(cachedTimestamp);
      const now = Date.now();
      
      return {
        exists: true,
        age: now - timestamp,
        expiresIn: Math.max(0, (timestamp + this.config.duration) - now),
        version: cacheItem.metadata.version,
        size: new Blob([cachedData]).size,
        type: 'session'
      };
    } catch (error) {
      console.error('[SessionCache] 캐시 정보 조회 실패:', error);
      return { exists: false, type: 'session' };
    }
  }

  /**
   * 캐시 유효성 검사
   */
  isValid(): boolean {
    const info = this.getInfo();
    return info.exists && (info.expiresIn || 0) > 0 && info.version === this.version;
  }

  /**
   * 캐시 만료까지 남은 시간 (분)
   */
  getTimeToExpiry(): number {
    const info = this.getInfo();
    return info.expiresIn ? Math.floor(info.expiresIn / (60 * 1000)) : 0;
  }

  /**
   * 캐시 타입 반환
   */
  getType(): 'session' {
    return 'session';
  }
}