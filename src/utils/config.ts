// 빌드타임 설정 사용 - nginx 프록시를 통한 API 호출
declare global {
  const __APP_CONFIG__: {
    api: {
      baseUrl: string;
      timeout: number;
    };
    services: {
      database: string;
    };
    environment: {
      nodeEnv: string;
      debug: boolean;
    };
  };
}

// API 설정 - nginx 프록시를 통한 통합 접근
export const API_CONFIG = {
  BASE_URL: __APP_CONFIG__.api.baseUrl,  // nginx 프록시 주소 사용
  TIMEOUT: __APP_CONFIG__.api.timeout,
  RETRY_ATTEMPTS: 3
};

// Exchange API 전용 설정 - nginx 프록시 경로 사용
export const EXCHANGE_API_CONFIG = {
  BASE_URL: __APP_CONFIG__.api.baseUrl,  // nginx 프록시를 통해 접근
  TIMEOUT: __APP_CONFIG__.api.timeout,
  RETRY_ATTEMPTS: 3
};

// 앱 설정
export const APP_CONFIG = {
  APP_NAME: 'Business Dashboard',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'ko',
  ITEMS_PER_PAGE: 20
};

// 환율 API 설정
export const EXCHANGE_CONFIG = {
  UPDATE_INTERVAL: 60000, // 1분마다 업데이트
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'JPY100', 'CNH']
};