// src/types/reservation.ts

/**
 * API와 통신할 때 사용하는 예약 데이터의 기본 구조입니다.
 * Flask 백엔드의 reservation_table과 일치합니다.
 */
export interface Reservation {
  id: number;
  type: 'car' | 'meeting';
  target: number; // e.g., 차량 번호 또는 회의실 번호
  emailaddress: string;
  time: string; // ISO 8601 형식의 문자열 (e.g., "2025-08-07T14:00:00+09:00")
  session: number; // 예약 시간 (단위: 시간)
  reason: string;
  created_at?: string; // 자동 생성 타임스탬프
}

/**
 * 예약 생성을 위해 API에 전송하는 데이터 타입입니다.
 * id와 created_at은 서버에서 생성되므로 제외됩니다.
 */
export type NewReservation = Omit<Reservation, 'id' | 'created_at'>;

/**
 * GET /api/reservations API의 응답 형식입니다.
 */
export interface PaginatedReservations {
  success: boolean;
  data: Reservation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    offset: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  timestamp: string;
}
