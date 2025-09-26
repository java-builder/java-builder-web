import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { LoginRequest, LoginResponse, LogoutResponse } from '@/types/auth';
import { CreateUserRequest, CreateUserResponse } from '@/types/user';

export const authApi = {
    login: async (data: LoginRequest) => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', data);

        if (response.data.code === 200 && response.data.result) {

            localStorage.setItem('access_token', response.data.result.accessToken);
        }

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