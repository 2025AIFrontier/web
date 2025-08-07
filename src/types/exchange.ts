// ==================== Exchange 관련 타입 정의 ====================

export interface RawExchangeData {
  date: string;
  USD: number;
  EUR: number;
  JPY100: number;
  CNH: number;
}

export interface ApiResponse {
  success: boolean;
  data: RawExchangeData[];
  analysis?: string;
  metadata: {
    total_days: number;
    requested_days: number;
    latest_date: string;
    available_currencies: string[];
    format: string;
    description: string;
  };
}