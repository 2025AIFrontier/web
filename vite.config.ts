import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

// 환경설정 불러오기
const config = require('../env.js');

export default defineConfig({
  server: {
    host: process.env.VITE_DEV_HOST || config.services.web.host,
    port: parseInt(process.env.VITE_DEV_PORT || config.services.web.port),
    hmr: {
      host: process.env.VITE_ALLOW_HOST || 'localhost'
    },
    proxy: {
      '/postgrest': {
        target: `http://${config.services.postgrestApi.host}:${config.services.postgrestApi.port}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/postgrest/, '')
      }
    }
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false
    })
  ],
  
  // 환경변수 정의 (빌드 시 클라이언트에서 사용 가능)
  define: {
    __APP_CONFIG__: JSON.stringify({
      api: {
        baseUrl: `${config.services.nginx.protocol}://${config.services.nginx.host}:${config.services.nginx.port}`,
        timeout: config.api.timeout,
      },
      services: {
        database: `${config.services.postgrestApi.protocol}://${config.services.postgrestApi.host}:${config.services.postgrestApi.port}`,
      },
      environment: {
        nodeEnv: config.environment.nodeEnv,
        debug: config.environment.debug,
      }
    })
  }
});
