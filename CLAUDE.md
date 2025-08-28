# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 프로젝트 개요

**web2는 기존 web 애플리케이션의 기능을 Next.js 15로 마이그레이션하기 위한 새로운 템플릿 프로젝트입니다.**

## 기술 스택
- **Framework**: Next.js 15.1.6 (React 19 기반)
- **Build Tool**: Turbopack (개발 서버)
- **Styling**: Tailwind CSS v4 + @tailwindcss/forms
- **UI Components**: @headlessui/react, @radix-ui
- **차트**: Chart.js 4.4
- **날짜 처리**: date-fns v4
- **테마**: next-themes (다크모드 지원)
- **타입스크립트**: TypeScript 5.7

## 프로젝트 구조
```
web2/
├── app/                      # App Router (Next.js 15 방식)
│   ├── (double-sidebar)/     # 더블 사이드바 레이아웃
│   ├── (onboarding)/        # 온보딩 관련 컴포넌트
│   ├── layout.tsx           # 루트 레이아웃
│   ├── theme-provider.tsx   # 테마 제공자
│   ├── flyout-context.tsx   # Flyout 상태 관리
│   └── css/style.css        # 전역 스타일
├── components/              # 재사용 가능한 컴포넌트
│   └── ui/                 # UI 기본 컴포넌트
├── lib/                    # 유틸리티 함수
├── public/                 # 정적 파일
│   └── images/            # 이미지 리소스
└── next.config.js         # Next.js 설정

```

## 개발 명령어

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint
```

## 마이그레이션 가이드

### 기존 web (Vite) → web2 (Next.js) 마이그레이션 시 주의사항

#### 1. 라우팅 시스템 변경
- **Vite (React Router)**: 클라이언트 사이드 라우팅
- **Next.js (App Router)**: 파일 기반 라우팅, 서버 컴포넌트 기본

#### 2. 환경변수 처리
- **Vite**: `VITE_` 접두사 필요, import.meta.env 사용
- **Next.js**: `NEXT_PUBLIC_` 접두사 (클라이언트), process.env 사용

#### 3. API 호출 패턴
- **기존**: 직접 API 호출 (CORS 설정 필요)
- **Next.js**: API Routes 또는 Server Actions 활용 가능

#### 4. 빌드 및 배포
- **Vite**: 정적 빌드 → nginx 서빙
- **Next.js**: Node.js 서버 필요 또는 정적 내보내기 옵션

## 주요 컴포넌트 패턴

### 1. Server Components (기본)
```tsx
// app/page.tsx - 서버 컴포넌트
export default async function Page() {
  const data = await fetch('...') // 서버에서 실행
  return <div>{data}</div>
}
```

### 2. Client Components
```tsx
// 'use client' 지시어 필요
'use client'
export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <button onClick={...}>Click</button>
}
```

### 3. 레이아웃 시스템
- `app/layout.tsx`: 전체 앱 레이아웃
- `app/(group)/layout.tsx`: 라우트 그룹별 레이아웃

## 통합 고려사항

### 1. API 서비스 연동
기존 백엔드 서비스와의 연동:
- PostgREST API (포트 3010)
- Employee API (포트 3003)
- Exchange API (포트 3011)
- PM2 Manager API (포트 3006)

### 2. 인증 및 세션 관리
- Next.js의 미들웨어 활용
- 서버 사이드 세션 관리 가능

### 3. 성능 최적화
- **자동 이미지 최적화**: next/image 컴포넌트
- **자동 코드 분할**: 라우트별 자동 분할
- **프리페칭**: Link 컴포넌트의 자동 프리페칭

## 개발 규칙

### 1. 컴포넌트 작성
- Server Components 우선 사용
- 상호작용이 필요한 경우만 Client Component
- 컴포넌트는 단일 책임 원칙 준수

### 2. 스타일링
- Tailwind CSS 클래스 우선 사용
- 커스텀 CSS는 최소화
- 다크모드 지원 필수 (dark: 접두사)

### 3. 타입 정의
- 모든 컴포넌트와 함수에 TypeScript 타입 정의
- any 타입 사용 금지
- interface 우선, type은 유니온/교차 타입에만 사용

### 4. 파일 구조
- 기능별로 그룹화 (route groups 활용)
- 공통 컴포넌트는 components/ 디렉토리
- 유틸리티는 lib/ 디렉토리

## 기존 시스템과의 호환성

### PM2 프로세스 관리
```javascript
// ecosystem.config.js에 추가 필요
{
  name: 'web2-next',
  script: 'npm',
  args: 'start',
  cwd: './web2',
  env: {
    PORT: 3000,
    NODE_ENV: 'production'
  }
}
```

### Nginx 설정
```nginx
# Next.js 앱을 위한 프록시 설정
location /next {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## 마이그레이션 체크리스트

- [ ] 라우트 구조 정의 (App Router)
- [ ] API Routes 설계
- [ ] 환경변수 마이그레이션
- [ ] 컴포넌트 이전 (CSR → SSR/CSR 혼합)
- [ ] 상태 관리 전략 수립
- [ ] 인증/인가 시스템 구현
- [ ] 빌드 및 배포 파이프라인 구성
- [ ] 성능 테스트 및 최적화
- [ ] 기존 서비스와의 통합 테스트

## 주의사항

1. **React 19 변경사항**: web2는 React 19를 사용하므로 일부 패턴이 기존과 다를 수 있음
2. **Turbopack**: 개발 모드에서 Webpack 대신 Turbopack 사용 (더 빠른 HMR)
3. **App Router**: Pages Router가 아닌 App Router 사용 (서버 컴포넌트 기본)
4. **Tailwind CSS v4**: 새로운 기능과 설정 방식 변경 확인 필요