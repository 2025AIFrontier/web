// 웹 애플리케이션용 환경설정
// 빌드 시 vite.config.ts에서 주입된 글로벌 설정 사용

// 빌드 시 주입된 설정 사용 (권장)
export const config = typeof __APP_CONFIG__ !== 'undefined' ? {
  api: {
    baseUrl: __APP_CONFIG__.api.baseUrl,
    timeout: parseInt(__APP_CONFIG__.api.timeout),
    retries: 3, // 기본값
  },
  
  services: {
  },

  environment: {
    isDevelopment: __APP_CONFIG__.environment.nodeEnv === 'development',
    isProduction: __APP_CONFIG__.environment.nodeEnv === 'production',
    debug: __APP_CONFIG__.environment.debug,
  }
} : {
  // 개발 시 fallback (런타임 설정)
  api: {
    baseUrl: 'http://localhost',
    timeout: 30000,
    retries: 3,
  },
  
  services: {
  },

  environment: {
    isDevelopment: true,
    isProduction: false,
    debug: true,
  }
};

export default config;