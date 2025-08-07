interface CacheConfig {
  readonly cacheKey: string;
  readonly timestampKey: string;
  readonly duration: number; // milliseconds
}

interface CacheMetadata {
  timestamp: number;
  expiresAt: number;
  version: string;
  lastModified?: string; // 서버 데이터의 lastModified 또는 etag
}

interface CacheItem<T> {
  data: T;
  metadata: CacheMetadata;
}

/**
 * LocalStorage 기반 영구 캐시 관리자
 * 브라우저를 닫아도 유지되는 클라이언트 로컬 파일 캐시
 */
export class LocalCacheManager<T = any> {
  private config: CacheConfig;
  private version: string = '1.0.0';

  constructor(
    pageKey: string, 
    duration: number = 7 * 24 * 60 * 60 * 1000, // 기본 7일
    version?: string
  ) {
    this.config = {
      cacheKey: `${pageKey}_local_cache`,
      timestampKey: `${pageKey}_local_timestamp`,
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
      const cachedData = localStorage.getItem(this.config.cacheKey);
      const cachedTimestamp = localStorage.getItem(this.config.timestampKey);
      
      if (!cachedData || !cachedTimestamp) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      const timestamp = parseInt(cachedTimestamp);
      
      // 버전 체크
      if (cacheItem.metadata.version !== this.version) {
        console.log(`[LocalCache] 캐시 버전 불일치. 기존: ${cacheItem.metadata.version}, 현재: ${this.version}`);
        this.clear();
        return null;
      }

      // 만료 시간 체크
      const now = Date.now();
      const cacheAge = now - timestamp;
      
      if (cacheAge < this.config.duration) {
        const ageInMinutes = Math.floor(cacheAge / (60 * 1000));
        const ageInHours = Math.floor(ageInMinutes / 60);
        const ageinDays = Math.floor(ageInHours / 24);
        
        if (ageInMinutes < 60) {
          console.log(`[LocalCache] 로컬 캐시 데이터 사용 중... (${ageInMinutes}분 전)`);
        } else if (ageInHours < 24) {
          console.log(`[LocalCache] 로컬 캐시 데이터 사용 중... (${ageInHours}시간 ${ageInMinutes % 60}분 전)`);
        } else {
          console.log(`[LocalCache] 로컬 캐시 데이터 사용 중... (${ageinDays}일 ${ageInHours % 24}시간 전)`);
        }
        
        return cacheItem.data;
      } else {
        console.log('[LocalCache] 캐시 만료로 새 데이터를 가져옵니다.');
        this.clear();
        return null;
      }
    } catch (error) {
      console.error('[LocalCache] 캐시 데이터 로드 실패:', error);
      this.clear(); // 손상된 캐시 정리
      return null;
    }
  }

  /**
   * 데이터를 캐시에 저장
   */
  save(data: T, lastModified?: string): boolean {
    try {
      const now = Date.now();
      const cacheItem: CacheItem<T> = {
        data,
        metadata: {
          timestamp: now,
          expiresAt: now + this.config.duration,
          version: this.version,
          lastModified
        }
      };

      localStorage.setItem(this.config.cacheKey, JSON.stringify(cacheItem));
      localStorage.setItem(this.config.timestampKey, now.toString());
      
      const durationInDays = this.config.duration / (24 * 60 * 60 * 1000);
      console.log(`[LocalCache] 데이터가 로컬 캐시에 저장되었습니다. (${durationInDays}일 유효)`);
      return true;
    } catch (error) {
      console.error('[LocalCache] 캐시 저장 실패:', error);
      return false;
    }
  }

  /**
   * 캐시 데이터 삭제
   */
  clear(): void {
    try {
      localStorage.removeItem(this.config.cacheKey);
      localStorage.removeItem(this.config.timestampKey);
      console.log('[LocalCache] 로컬 캐시가 정리되었습니다.');
    } catch (error) {
      console.error('[LocalCache] 캐시 정리 실패:', error);
    }
  }

  /**
   * 서버 데이터의 최신 여부 확인을 위한 lastModified 값 반환
   */
  getLastModified(): string | null {
    try {
      const cachedData = localStorage.getItem(this.config.cacheKey);
      if (!cachedData) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      return cacheItem.metadata.lastModified || null;
    } catch (error) {
      console.error('[LocalCache] lastModified 조회 실패:', error);
      return null;
    }
  }

  /**
   * 캐시 나이 정보 반환
   */
  getAge(): string {
    try {
      const cachedTimestamp = localStorage.getItem(this.config.timestampKey);
      if (!cachedTimestamp) {
        return '캐시 없음';
      }

      const timestamp = parseInt(cachedTimestamp);
      const ageInMinutes = Math.floor((Date.now() - timestamp) / (60 * 1000));
      const ageInHours = Math.floor(ageInMinutes / 60);
      const ageInDays = Math.floor(ageInHours / 24);
      
      if (ageInMinutes < 60) {
        return `${ageInMinutes}분 전 로컬캐시`;
      } else if (ageInHours < 24) {
        const remainingMinutes = ageInMinutes % 60;
        return `${ageInHours}시간 ${remainingMinutes}분 전 로컬캐시`;
      } else {
        const remainingHours = ageInHours % 24;
        return `${ageInDays}일 ${remainingHours}시간 전 로컬캐시`;
      }
    } catch (error) {
      console.error('[LocalCache] 캐시 나이 계산 실패:', error);
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
    lastModified?: string;
    type: 'local';
  } {
    try {
      const cachedData = localStorage.getItem(this.config.cacheKey);
      const cachedTimestamp = localStorage.getItem(this.config.timestampKey);
      
      if (!cachedData || !cachedTimestamp) {
        return { exists: false, type: 'local' };
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
        lastModified: cacheItem.metadata.lastModified,
        type: 'local'
      };
    } catch (error) {
      console.error('[LocalCache] 캐시 정보 조회 실패:', error);
      return { exists: false, type: 'local' };
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
   * 캐시 만료까지 남은 시간 (시간)
   */
  getTimeToExpiry(): number {
    const info = this.getInfo();
    return info.expiresIn ? Math.floor(info.expiresIn / (60 * 60 * 1000)) : 0;
  }

  /**
   * 캐시 타입 반환
   */
  getType(): 'local' {
    return 'local';
  }

  /**
   * 서버 데이터 업데이트 확인이 필요한지 판단
   * lastModified 값이 있으면 조건부 요청 가능
   */
  needsUpdateCheck(): boolean {
    const info = this.getInfo();
    return info.exists && info.lastModified !== undefined;
  }
}