import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

// 환경변수에서 설정 로드 (load-config-and-start.js에서 전달된 설정 사용)
function getConfigFromEnv() {
  // VITE_DB_CONFIG 환경변수에서 전체 설정 로드
  const dbConfigStr = process.env.VITE_DB_CONFIG;
  if (!dbConfigStr) {
    throw new Error('VITE_DB_CONFIG environment variable is required');
  }
  
  const config = JSON.parse(dbConfigStr);
  console.log('✅ Configuration loaded from environment variables');
  return config;
}

const config = getConfigFromEnv();

export default defineConfig({
  define: {
    // DB에서 로드한 모든 서비스 설정을 __APP_CONFIG__로 주입
    __APP_CONFIG__: JSON.stringify({
      api: {
        baseUrl: '', // 런타임에 window.location.origin 사용
        timeout: 30000
      },
      services: config.services,
      environment: {
        nodeEnv: 'development',
        debug: true
      }
    })
  },
  server: {
    host: config.services['main-web'].host,
    port: parseInt(config.services['main-web'].port),
    hmr: {
      host: '127.0.0.1',
      port: 24678,
      clientPort: parseInt(config.services['main-web'].port)
    },
    proxy: {
      '/postgrest': {
        target: `http://${config.services['postgrest-api'].host}:${config.services['postgrest-api'].port}`,
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
  ]
});