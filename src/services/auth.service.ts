import { apiClient } from '@/lib/axios';
import { ApiResponse, LoginRequest, LoginResponse, LogoutResponse, CreateUserRequest, CreateUserResponse } from '@/types/api';

export const authApi = {
    login: async (data: LoginRequest) => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', data);

        localStorage.setItem('access_token', response.data.result.accessToken);

        return response.data;
    },

    register: async (data: CreateUserRequest) => {
        const response = await apiClient.post<ApiResponse<CreateUserResponse>>('/api/v1/auth/register', data);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post<ApiResponse<LogoutResponse>>(
            '/api/v1/auth/logout',
        );
        localStorage.removeItem('access_token');
        return response.data;
    }
};