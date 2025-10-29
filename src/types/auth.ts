export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    mftEnable?: boolean;
    authorities?: string[];
}

export interface LogoutResponse {
    message: string;
    timestamp: string;
}

export interface IntrospectRequest {
    token: string;
}

export interface IntrospectResponse {
    valid: boolean;
    scopes: string[];
}

export interface TwoFactorAuthenticationRequest {
    email: string;
    code: string;
}