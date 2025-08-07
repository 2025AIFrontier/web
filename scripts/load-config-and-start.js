#!/usr/bin/env node

import { execSync, spawn } from 'child_process';

// PostgREST에서 모든 서비스 설정을 로드하는 함수
async function loadAllServiceConfigsFromDB() {
  try {
    console.log('🔍 Loading all service configurations from PostgREST...');
    
    // PostgREST를 통해 모든 서비스 설정 조회
    const result = execSync(
      `curl -s "http://localhost:3010/env_configs?section=eq.services" -H "Accept: application/json" 2>/dev/null || echo "[]"`,
      { encoding: 'utf8', timeout: 10000 }
    );
    
    const configs = JSON.parse(result);
    if (!configs || configs.length === 0) {
      throw new Error('No service configurations found in database');
    }
    
    // 서비스별로 그룹화
    const services = {};
    configs.forEach(item => {
      if (!services[item.subsection]) {
        services[item.subsection] = {};
      }
      services[item.subsection][item.key] = item.value;
    });
    
    // web-api 필수 설정 확인
    if (!services['web-api']) {
      throw new Error('No web-api configuration found in database');
    }
    
    const requiredKeys = ['host', 'port', 'protocol'];
    for (const key of requiredKeys) {
      if (!services['web-api'][key]) {
        throw new Error(`Required web-api configuration '${key}' not found in database`);
      }
    }
    
    console.log('✅ All service configurations loaded from DB:', Object.keys(services));
    console.log('   ✅ Web 애플리케이션 환경변수 로딩 완료');
    return services;
  } catch (error) {
    console.error('❌ Failed to load service configurations from PostgREST:', error.message);
    console.error('❌ Cannot start web server without proper configuration from database');
    throw error;
  }
}

// 메인 실행 함수
async function main() {
  try {
    // DB에서 모든 서비스 설정 로드
    const services = await loadAllServiceConfigsFromDB();
    const webConfig = services['web-api'];
    
    console.log(`🚀 Starting web server on ${webConfig.host}:${webConfig.port}`);
    
    // 모든 서비스 설정을 환경변수로 설정
    const serviceEnvVars = {};
    Object.keys(services).forEach(serviceName => {
      const service = services[serviceName];
      const envPrefix = serviceName.toUpperCase().replace(/-/g, '_');
      
      serviceEnvVars[`VITE_${envPrefix}_HOST`] = service.host;
      serviceEnvVars[`VITE_${envPrefix}_PORT`] = service.port;
      serviceEnvVars[`VITE_${envPrefix}_PROTOCOL`] = service.protocol;
      serviceEnvVars[`VITE_${envPrefix}_URL`] = `${service.protocol}://${service.host}:${service.port}`;
    });
    
    console.log('🔧 Setting service environment variables:', Object.keys(serviceEnvVars));
    
    // vite 개발 서버 시작
    const viteProcess = spawn('npx', [
      'vite',
      '--host', webConfig.host,
      '--port', webConfig.port
    ], {
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_DEV_HOST: webConfig.host,
        VITE_DEV_PORT: webConfig.port,
        ...serviceEnvVars
      }
    });
    
    // 프로세스 종료 처리
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down web server...');
      viteProcess.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down web server...');
      viteProcess.kill('SIGTERM');
      process.exit(0);
    });
    
    viteProcess.on('exit', (code) => {
      console.log(`Web server exited with code ${code}`);
      process.exit(code);
    });
    
  } catch (error) {
    console.error('❌ Failed to start web server:', error.message);
    process.exit(1);
  }
}

main();