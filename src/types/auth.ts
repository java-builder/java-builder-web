export interface LoginRequest {
  email: string;
  password: string;
  turnstileToken?: string;
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
  isValid: boolean;
  authorities: string[];
}

export interface TwoFactorAuthenticationRequest {
  userId: string;
  code: string;
  identityProvider: 'USERNAME_PASSWORD' | 'GOOGLE' | 'GITHUB' | 'LINKEDIN';
}
