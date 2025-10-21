import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { LoginRequest, LoginResponse, LogoutResponse } from '@/types/auth';
import toast from 'react-hot-toast';

export const authApi = {
    login: async (data: LoginRequest) => {
        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', data);

            if (response.data.code === 200 && response.data.result) {
                // Lưu accessToken vào localStorage
                localStorage.setItem('access_token', response.data.result.accessToken);

                // Lưu userId để sử dụng sau này
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

            // Xóa tokens khỏi localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');

            toast.success('Đăng xuất thành công!');
            return response.data;
        } catch (error) {
            // Vẫn logout local ngay cả khi API call thất bại
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            toast.success('Đăng xuất thành công!');
            throw error;
        }
    },

    // Kiểm tra xem user đã đăng nhập chưa
    isAuthenticated: () => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('access_token');
    },

    // Lấy access token từ localStorage
    getAccessToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    },

    // Lấy user ID từ localStorage
    getUserId: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('user_id');
    },

    clearAuthData: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        toast.success('Phiên đăng nhập đã hết hạn');
    }
};