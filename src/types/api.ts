export interface ApiResponse<T> {
    code: number;
    message?: string;
    result: T;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    userId: string;
    accessToken: string;
    refreshToken: string;
    authorities: string[];
}

export interface LogoutResponse {
    message: string;
    timestamp: string;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface CreateUserResponse {
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserDetailResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    university?: string;
    status: UserStatus;
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED'
}

export interface PageResponse<T> {
    currentPages: number;
    pageSizes: number;
    totalPages: number;
    totalElements: number;
    result: T[];
}
