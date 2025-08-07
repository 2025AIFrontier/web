# Web Frontend

React/TypeScript 기반 메인 웹 애플리케이션

## 📋 개요

이 프로젝트는 마이크로서비스 아키텍처를 기반으로 한 풀스택 애플리케이션의 메인 웹 인터페이스입니다. 사용자들이 환율 정보, 직원 연락처, 회의실 예약, 차량 예약, 업무 관리 등 다양한 기능을 이용할 수 있는 통합 플랫폼을 제공합니다.

## 🛠 기술 스택

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Development Server**: Vite Dev Server (포트 3001)

## 📁 프로젝트 구조

```
web/
├── src/
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── Calendar.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ReservationModal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SystemMonitor.tsx
│   │   └── useAsyncData.ts
│   ├── pages/             # 페이지별 컴포넌트
│   │   ├── AdminPage.tsx
│   │   ├── CarReservationPage.tsx
│   │   ├── CollectPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ExchangePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MeetingRoomPage.tsx
│   │   ├── SCMPage.tsx
│   │   ├── TaskPage.tsx
│   │   └── contact_page.tsx
│   ├── services/          # API 통신 서비스
│   │   ├── api.ts
│   │   └── index.ts
│   ├── types/             # TypeScript 타입 정의
│   │   ├── api.ts
│   │   ├── common.ts
│   │   ├── config.ts
│   │   ├── exchange.ts
│   │   └── reservation.ts
│   ├── utils/             # 유틸리티 함수
│   │   ├── AIAnalysisSection.tsx
│   │   ├── config.ts
│   │   └── constants.tsx
│   ├── cache/             # 캐싱 시스템
│   │   ├── cacheFactory.ts
│   │   ├── localCache.ts
│   │   └── sessionCache.ts
│   ├── App.tsx            # 메인 앱 컴포넌트
│   ├── main.tsx           # 앱 진입점
│   └── index.css          # 글로벌 스타일
├── public/                # 정적 파일
├── package.json           # 프로젝트 의존성
├── vite.config.ts         # Vite 설정
├── tailwind.config.js     # TailwindCSS 설정
├── tsconfig.json          # TypeScript 설정
└── env.config.js          # 환경설정
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm 8+

### 설치 및 실행

1. **의존성 설치**
   ```bash
   cd web
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **빌드**
   ```bash
   npm run build
   ```

4. **린트 검사**
   ```bash
   npm run lint
   ```

## 🌐 접근 방법

### 직접 접근
- **개발 서버**: http://localhost:3001
- **Host**: 0.0.0.0 (외부 접근 허용)

### 프록시를 통한 접근 (권장)
- **Nginx 프록시**: http://localhost/ (포트 80)
- **Samsung 도메인**: http://aipc.sec.samsung.net/
- **IP 주소**: http://10.252.92.75/

## 📖 주요 기능

### 1. 대시보드 (Dashboard)
- 시스템 전체 현황 모니터링
- 실시간 서비스 상태 확인
- 주요 지표 시각화

### 2. 환율 정보 (Exchange)
- 실시간 환율 정보 조회
- USD, EUR, JPY, CNH 지원
- 환율 변화 추이 분석
- 한국수출입은행 API 연동

### 3. 직원 연락처 (Contact)
- 직원 정보 검색 및 조회
- 부서별 필터링
- 연락처 세부 정보 표시
- 그래프 뷰 및 테이블 뷰 지원

### 4. 예약 시스템
- **회의실 예약**: 시간대별 회의실 예약 관리
- **차량 예약**: 업무용 차량 예약 시스템

### 5. 업무 관리 (Task)
- 업무 할당 및 진행 상황 추적
- AI 기반 업무 분석
- 업무 우선순위 관리

### 6. SCM (Supply Chain Management)
- 공급망 관리 기능
- 재고 현황 모니터링

### 7. 수집 도구 (Collect)
- 데이터 수집 및 관리
- 외부 소스 연동

## 🔧 설정

### 환경 변수
환경 설정은 `env.config.js`에서 관리됩니다:

```javascript
// API 엔드포인트 설정
const API_BASE_URL = 'http://localhost:80';

// 서비스별 포트 설정
const SERVICES = {
  exchange: 'http://localhost/api/exchange',
  contact: 'http://localhost:3003',
  postgrest: 'http://localhost/postgrest'
};
```

### Vite 설정
`vite.config.ts`에서 개발 서버 및 빌드 설정을 관리합니다:

- **포트**: 3001
- **호스트**: 0.0.0.0 (외부 접근 허용)
- **HMR**: 핫 모듈 리로딩 지원

## 📡 API 연동

### Exchange API (포트 3009)
```typescript
// 환율 정보 조회 (웹용)
GET /api/exchange/exchange_db2api?days=7&format=web

// 환율 정보 조회 (챗봇용)  
GET /api/exchange/exchange_db2api?days=2&format=chat

// 환율 데이터 동기화
GET /api/exchange/exchange_api2db

// 서비스 상태 확인
GET /api/exchange/health
```

### Employee API (포트 3003)
```typescript
// 직원 정보 조회
GET /api/contacts

// 부서 목록 조회
GET /api/contacts/departments

// 직원 통계 정보
GET /api/contacts/stats
```

### PostgREST API (포트 3010)
```typescript
// 데이터베이스 직접 접근
GET /postgrest/[table_name]
POST /postgrest/[table_name]
PATCH /postgrest/[table_name]
DELETE /postgrest/[table_name]
```

## 🎨 스타일링

### TailwindCSS
프로젝트는 TailwindCSS를 사용하여 일관된 디자인 시스템을 제공합니다:

- **색상 팔레트**: 브랜드 색상 및 시멘틱 색상
- **컴포넌트**: 재사용 가능한 UI 컴포넌트
- **반응형 디자인**: 모바일 우선 접근법

### 컴포넌트 스타일
```typescript
// 예시: 버튼 컴포넌트
const Button = ({ children, variant = 'primary' }) => (
  <button className={`px-4 py-2 rounded-lg font-medium ${
    variant === 'primary' 
      ? 'bg-blue-600 text-white hover:bg-blue-700' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  }`}>
    {children}
  </button>
);
```

## 🔐 보안

### CORS 설정
- 허용된 도메인에서만 API 접근 가능
- nginx에서 CORS 헤더 관리

### 환경별 설정
- 개발/프로덕션 환경 분리
- 민감한 정보는 환경 변수로 관리

## 🧪 테스트

### 개발 도구
```bash
# 타입 체크
npm run type-check

# 코드 포맷팅
npm run format

# 린트 검사 및 수정
npm run lint --fix
```

## 📈 성능 최적화

### 빌드 최적화
- **코드 분할**: 페이지별 번들 분할
- **트리 쉐이킹**: 미사용 코드 제거
- **압축**: Gzip 압축 적용

### 캐싱 전략
- **로컬 캐시**: 자주 사용하는 데이터 캐싱
- **세션 캐시**: 세션별 데이터 관리
- **HTTP 캐시**: API 응답 캐싱

## 🚀 배포

### 프로덕션 빌드
```bash
npm run build:prod
```

### PM2를 통한 배포
```bash
# 전체 시스템 시작
pm2 start ecosystem.config.js

# 웹 앱만 재시작
pm2 restart web-app-dev
```

## 🔍 모니터링

### 개발 도구
- **Vite DevTools**: 개발 서버 모니터링
- **React DevTools**: 컴포넌트 상태 디버깅
- **Network Tab**: API 호출 모니터링

### 프로덕션 모니터링
- **PM2 Monitoring**: 프로세스 상태 모니터링
- **Nginx Logs**: 웹서버 로그 분석

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경 사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 발생하거나 질문이 있으시면:

1. GitHub Issues를 통해 버그 리포트 또는 기능 요청
2. 개발팀에 직접 연락
3. 문서 검토 및 업데이트 제안

---

**참고**: 이 문서는 프로젝트 구조와 함께 지속적으로 업데이트됩니다.