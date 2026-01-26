import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { PostDetail, CreatePostRequest, UpdatePostRequest, CreatePostResponse } from "@/types/post";
import { API } from "@/api/api";

export const postService = {
    getAll: async (params: {
        page?: number;
        size?: number;
        search?: string;
        categoryName?: string;
    } = {}) => {
        const response = await apiClient.get<ApiResponse<PageResponse<PostDetail>>>(API.GET_POSTS, {
            params,
        });
        return response.data;
    },

    create: async (data: CreatePostRequest) => {
        const response = await apiClient.post<ApiResponse<CreatePostResponse>>(API.CREATE_POST, data);
        return response.data;
    },

    update: async (id: string, data: UpdatePostRequest) => {
        const response = await apiClient.put<ApiResponse<PostDetail>>(`${API.UPDATE_POST}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete<ApiResponse<void>>(`${API.DELETE_POST}/${id}`);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get<ApiResponse<PostDetail>>(`${API.GET_POST_BY_ID}/${id}`);
        return response.data;
    },
    // Get post by slug (e.g. /api/v1/posts/slug/{slug})
    getBySlug: async (slug: string): Promise<PostDetail> => {
        const response = await apiClient.get(`${API.GET_POST_BY_SLUG}/${slug}`);
        return (response.data as { data?: PostDetail }).data as PostDetail;
    },
};
