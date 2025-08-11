import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { execSync } from 'child_process';

// DB에서 모든 환경변수 직접 로드
function loadAllConfigFromDB() {
  console.log('🔧 Loading ALL configuration from database...');
  
  const result = execSync(
    'curl -s "http://localhost:3010/env_configs" -H "Accept: application/json"',
    { encoding: 'utf8', timeout: 10000 }
  );
  
  const configs = JSON.parse(result);
  if (!configs || configs.length === 0) {
    console.error('❌ No configuration found in database');
    process.exit(1);
  }
  
  const allConfig = {
    services: {},
    exchange: {},
    api: {},
    database: {},
    environment: {}
  };
  
  // DB의 모든 데이터를 섹션별로 정리
  configs.forEach(item => {
    const section = item.section;
    const subsection = item.subsection;
    const key = item.key;
    const value = item.value;
    
    if (!allConfig[section]) {
      allConfig[section] = {};
    }
    
    if (subsection) {
      if (!allConfig[section][subsection]) {
        allConfig[section][subsection] = {};
      }
      allConfig[section][subsection][key] = value;
    } else {
      allConfig[section][key] = value;
    }
  });
  
  console.log('✅ ALL configuration loaded from database:', Object.keys(allConfig));
  return allConfig;
}

const config = loadAllConfigFromDB();

export default defineConfig({
  server: {
    host: config.services['main-web'].host,
    port: parseInt(config.services['main-web'].port),
    allowedHosts: ['localhost', '10.252.92.75', 'aipc.sec.samsung.net'],
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
    }),
    // Keep-Alive 플러그인 - nginx proxy_read_timeout 방지
    {
      name: 'nginx-keepalive',
      configureServer(server) {
        server.middlewares.use('/__keepalive', (req, res) => {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache',
          });
          res.end('alive');
        });
        
        // 30초마다 자동으로 heartbeat (선택사항)
        // setInterval(() => {
        //   console.log('💓 Keep-Alive heartbeat');
        // }, 30000);
      }
    }
  ],
  
  // 환경변수 정의 (빌드 시 클라이언트에서 사용 가능) - 모든 설정 포함
  define: {
    __APP_CONFIG__: JSON.stringify({
      // 모든 서비스 정보
      services: config.services,
      // Exchange API 전용 설정
      exchange: config.exchange || {},
      // API 설정 - nginx 프록시를 통한 접근
      api: {
        baseUrl: `http://${config.services.nginx.host}:${config.services.nginx.port}`,
        timeout: '30000',
        // 모든 API 서비스들의 정보를 매핑
        services: Object.keys(config.services)
          .filter(key => key.includes('-api'))
          .reduce((acc, serviceName) => {
            const service = config.services[serviceName];
            acc[serviceName] = {
              host: service.host,
              port: service.port,
              protocol: service.protocol,
              url: `${service.protocol}://${service.host}:${service.port}`
            };
            return acc;
          }, {})
      },
      // 환경 설정
      environment: config.environment || { nodeEnv: 'development' },
      // 데이터베이스 설정
      database: config.database || {}
    })
  }
});
