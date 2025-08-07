// src/services/reservationApi.ts

import axios from 'axios';
import { Reservation, NewReservation, PaginatedReservations } from '../types/reservation';

// 타입 선언
declare const __APP_CONFIG__: {
  api: {
    baseUrl: string;
    timeout: number;
  };
  services: {
    database: string;
  };
  environment: {
    nodeEnv: string;
    debug: boolean;
  };
};

// 전역 설정에서 reservation-api 서비스 주소를 가져오는 함수
const getReservationApiBaseUrl = (): string => {
  // 1차: window 객체에 저장된 런타임 설정 확인 (ConfigContext에서 설정)
  const runtimeConfig = (window as any).__RUNTIME_CONFIG__;
  if (runtimeConfig?.servicesConfig?.['reservation-api']) {
    const config = runtimeConfig.servicesConfig['reservation-api'];
    return `${config.protocol}://${config.host}:${config.port}/api`;
  }
  
  // 2차: 빌드타임 설정의 환경변수 사용
  if (typeof __APP_CONFIG__ !== 'undefined') {
    // env.js 기반 환경변수에서 reservation-api 설정 추출
    const envConfig = (window as any).__ENV_CONFIG__;
    if (envConfig?.services?.reservationApi) {
      const config = envConfig.services.reservationApi;
      return `${config.protocol}://${config.host}:${config.port}/api`;
    }
  }
  
  // 환경변수를 찾을 수 없는 경우 오류 발생
  throw new Error('reservation-api 설정을 찾을 수 없습니다. 환경변수를 확인해주세요.');
};

// axios 인스턴스를 동적으로 생성하는 함수
const getApiClient = () => {
  const baseURL = getReservationApiBaseUrl();
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 예약 생성 API를 호출하는 함수
 * @param reservation - 생성할 예약 정보
 * @returns 생성된 예약 정보와 API 응답
 */
const createReservation = async (reservation: NewReservation): Promise<{ success: boolean; data?: Reservation; message?: string }> => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.post<{ success: boolean; data: Reservation; message: string }>('/reservations', reservation);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.message || '예약 생성에 실패했습니다.' };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  }
};

/**
 * 모든 예약을 조회하는 함수 (페이지네이션 지원)
 * @param params - 필터링, 정렬, 페이지네이션 파라미터
 * @returns 페이지네이션된 예약 목록
 */
const getReservations = async (params: Record<string, any>): Promise<PaginatedReservations | null> => {
    try {
        const apiClient = getApiClient();
        const response = await apiClient.get<PaginatedReservations>('/reservations', { params });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch reservations:", error);
        return null;
    }
}


/**
 * 특정 예약을 조회하는 함수
 * @param reservationId - 조회할 예약 ID
 * @returns 예약 정보
 */
const getReservationById = async (reservationId: number): Promise<{ success: boolean; data?: Reservation; message?: string }> => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.get<{ success: boolean; data: Reservation; message: string }>(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.message || '예약 조회에 실패했습니다.' };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  }
};

/**
 * 예약을 수정하는 함수
 * @param reservationId - 수정할 예약 ID
 * @param updates - 수정할 내용 (부분 업데이트)
 * @returns 수정된 예약 정보
 */
const updateReservation = async (reservationId: number, updates: Partial<NewReservation>): Promise<{ success: boolean; data?: Reservation; message?: string }> => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.patch<{ success: boolean; data: Reservation; message: string }>(`/reservations/${reservationId}`, updates);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.message || '예약 수정에 실패했습니다.' };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  }
};

/**
 * 예약을 삭제하는 함수
 * @param reservationId - 삭제할 예약 ID
 * @returns 삭제된 예약 정보
 */
const deleteReservation = async (reservationId: number): Promise<{ success: boolean; data?: Reservation; message?: string }> => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.delete<{ success: boolean; data: Reservation; message: string }>(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.message || '예약 삭제에 실패했습니다.' };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  }
};

/**
 * 예약 관련 API 함수들을 모아놓은 커스텀 훅
 * CalendarPage 컴포넌트에서 이 훅을 사용합니다.
 */
export const useReservationApi = () => {
  return {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
  };
};
