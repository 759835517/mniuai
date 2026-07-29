// 通用 API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export type ID = string | number;

// HTTP 错误
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
