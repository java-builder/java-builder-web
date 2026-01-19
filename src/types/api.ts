export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface ErrorResponse {
  code: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

export interface PageResponse<T> {
  currentPages: number;
  pageSizes: number;
  totalPages: number;
  totalElements: number;
  result: T[];
}
