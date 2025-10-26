import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { LoginRequest, LoginResponse, LogoutResponse, IntrospectRequest, IntrospectResponse } from '@/types/auth';
import toast from 'react-hot-toast';

export const authApi = {
    login: async (data: LoginRequest) => {
        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', data);

            if (response.data.code === 200 && response.data.result) {
                localStorage.setItem('access_token', response.data.result.accessToken);
                localStorage.setItem('user_id', response.data.result.userId);

                toast.success('Đăng nhập thành công!');
            }

            return response.data;
        } catch (error) {
            toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await apiClient.post<ApiResponse<LogoutResponse>>('/api/v1/auth/logout');

            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');

            toast.success('Đăng xuất thành công!');
            return response.data;
        } catch (error) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            toast.success('Đăng xuất thành công!');
            throw error;
        }
    },

    isAuthenticated: () => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('access_token');
    },

    getAccessToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    },

    getUserId: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('user_id');
    },

    clearAuthData: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        toast.success('Phiên đăng nhập đã hết hạn');
    },

    introspect: async (): Promise<IntrospectResponse | null> => {
        try {
            const token = authApi.getAccessToken();
            if (!token) {
                return null;
            }

            const request: IntrospectRequest = { token };
            const response = await apiClient.post<ApiResponse<IntrospectResponse>>('/api/v1/auth/introspect', request);
            return response.data.result || null;
        } catch {
            return null;
        }
    },

    loginWithGoogle: async (code: string) => {
        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login-google', null, {
                params: { code }
            });

            if (response.data.code === 200 && response.data.result) {
                localStorage.setItem('access_token', response.data.result.accessToken);
                localStorage.setItem('user_id', response.data.result.userId);
                toast.success('Đăng nhập Google thành công!');
            }

            return response.data;
        } catch (error) {
            toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
            throw error;
        }
    },

    loginWithGithub: async (code: string) => {
        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login-github', null, {
                params: { code }
            });

            if (response.data.code === 200 && response.data.result) {
                localStorage.setItem('access_token', response.data.result.accessToken);
                localStorage.setItem('user_id', response.data.result.userId);
                toast.success('Đăng nhập GitHub thành công!');
            }

            return response.data;
        } catch (error) {
            toast.error('Đăng nhập GitHub thất bại. Vui lòng thử lại.');
            throw error;
        }
    },
};