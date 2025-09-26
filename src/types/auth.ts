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