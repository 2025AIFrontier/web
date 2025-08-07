// 글로벌 설정 타입 정의
declare global {
  const __APP_CONFIG__: {
    api: {
      baseUrl: string;
      timeout: string;
    };
    services: {
      exchange: string;
      employee: string;
      database: string;
    };
    environment: {
      nodeEnv: string;
      debug: boolean;
    };
  };
}

export type AppConfig = typeof __APP_CONFIG__;

export {};