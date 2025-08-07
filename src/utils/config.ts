// API 설정 및 환경 변수
export const API_CONFIG = {
  PROTOCOL: import.meta.env.VITE_API_PROTOCOL,
  HOST: import.meta.env.VITE_API_HOST,
  PORT: import.meta.env.VITE_API_PORT,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Exchange API 전용 설정
export const EXCHANGE_API_CONFIG = {
  PROTOCOL: import.meta.env.VITE_EXCHANGE_API_PROTOCOL || import.meta.env.VITE_API_PROTOCOL,
  HOST: import.meta.env.VITE_EXCHANGE_API_HOST || import.meta.env.VITE_API_HOST,
  PORT: import.meta.env.VITE_EXCHANGE_API_PORT || import.meta.env.VITE_API_PORT,
  TIMEOUT: 10000,
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