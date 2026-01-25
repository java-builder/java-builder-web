export interface ApiResponse<T> {
  code: number;
  message?: string;
  data?: T;
}

export interface ErrorResponse {
  code: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

export interface PageResponse<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: T[];
}
