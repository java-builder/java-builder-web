import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { ApiResponse, UserDetailResponse, PageResponse } from '@/types/api';

export interface UserSearchParams {
    page?: number;
    search?: string;
}

export const userApi = {
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

    update: async (id: string, data: Partial<UserDetailResponse>) => {
        const response = await apiClient.put<ApiResponse<UserDetailResponse>>(`/api/v1/users/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete<ApiResponse<void>>(`/api/v1/users/${id}`);
        return response.data;
    },
};