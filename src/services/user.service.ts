import { apiClient } from '@/lib/axios';
import { ApiResponse, PageResponse } from '@/types/api';
import { UserDetailResponse, CreateUserRequest, CreateUserResponse } from '@/types/user';
import toast from 'react-hot-toast';

export interface UserSearchParams {
    page?: number;
    search?: string;
}

export const userApi = {
    create: async (data: CreateUserRequest) => {
        try {
            const response = await apiClient.post<ApiResponse<CreateUserResponse>>('/api/v1/users', data);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
            return response.data;
        } catch (error) {
            toast.error('Đăng ký thất bại. Vui lòng thử lại.');
            throw error;
        }
    },

    search: async (params: UserSearchParams) => {
        const queryParams: Record<string, string | number> = {
            page: params.page || 1,
        };

        try {
            const response = await apiClient.post<ApiResponse<PageResponse<UserDetailResponse>>>('/api/v1/users/search', {
                params: queryParams,
            });
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
            }
            throw error;

        }
    },

    getById: async (id: string) => {
        const response = await apiClient.get<ApiResponse<UserDetailResponse>>(`/api/v1/users/${id}`);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get<ApiResponse<UserDetailResponse>>('/api/v1/users/me');
        return response.data;
    },

    update: async (id: string, data: Partial<UserDetailResponse>) => {
        try {
            const response = await apiClient.put<ApiResponse<UserDetailResponse>>(`/api/v1/users/${id}`, data);
            toast.success('Cập nhật thông tin thành công!');
            return response.data;
        } catch (error) {
            toast.error('Cập nhật thông tin thất bại. Vui lòng thử lại.');
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const response = await apiClient.delete<ApiResponse<void>>(`/api/v1/users/${id}`);
            toast.success('Xóa tài khoản thành công!');
            return response.data;
        } catch (error) {
            toast.error('Xóa tài khoản thất bại. Vui lòng thử lại.');
            throw error;
        }
    },
};