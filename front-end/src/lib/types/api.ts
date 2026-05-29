export interface ApiResponse<T> {
  success: boolean;
  code?: string;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
  traceId?: string;
  timestamp?: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export type ID = string;
export type SnowflakeId = ID;
export type ISODateTime = string;
export type ISODate = string;
