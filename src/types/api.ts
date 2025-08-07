// API 응답 타입 정의

export interface ExchangeRate {
  currency: string;
  rate: number;
  change: number;
  changePercent: number;
}

export interface Manager {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  position: string;
}

export interface Employee {
  id: number;
  full_name: string;
  email_address: string;
  company_name: string;
  department_name: string;
  description: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface SCMData {
  suppliers: number;
  inventory: string;
  shipping: number;
  completed: number;
}

export interface CollectRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed';
  requestedBy: string;
  requestedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}