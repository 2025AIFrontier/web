🗂️ 다중 캐시 전략 구조
캐시 파일별 분리
/cache/
  ├── sessionCache.ts     (임시 데이터용)
  ├── localCache.ts       (영구 데이터용)  
  ├── indexedDbCache.ts   (대용량 데이터용)
  └── cacheFactory.ts     (캐시 선택 로직)

페이지별 적합한 캐시 선택
📊 환율 페이지: sessionCache.ts

실시간성 중요, 탭 닫으면 삭제 OK

👤 사용자 설정: localCache.ts

브라우저 닫아도 유지 필요

📈 차트 데이터: indexedDbCache.ts

대용량 히스토리 데이터

🔔 알림 설정: localCache.ts

지속적 유지 필요

🎛️ 유연한 캐시 전략
페이지별 맞춤 적용

A페이지: sessionStorage (4시간)
B페이지: localStorage (7일)
C페이지: IndexedDB (무제한)
D페이지: 캐시 없음 (항상 최신)

하이브리드 전략도 가능

기본: sessionStorage
중요 데이터: localStorage 백업
대용량: IndexedDB 보관

💡 장점

성능 최적화: 각 페이지 특성에 맞는 캐시
사용자 경험: 페이지별 다른 지속성
메모리 효율: 적절한 저장소 선택
유지보수: 모듈화된 캐시 관리