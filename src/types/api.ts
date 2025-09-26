export interface ApiResponse<T> {
    code: number;
    message?: string;
    result?: T;
}

export interface PageResponse<T> {
    currentPages: number;
    pageSizes: number;
    totalPages: number;
    totalElements: number;
    result: T[];
}
