import { apiClient } from '@/lib/axios';
import { CreateBlogRequest, CreateBlogResponse, Blog } from '@/types/blog';
import { FileMetaDataResponse } from '@/types/file';

export const blogService = {
    // Tạo blog mới
    async createBlog(data: CreateBlogRequest): Promise<CreateBlogResponse> {
        const response = await apiClient.post('/api/v1/blogs', data);
        return response.data.result;
    },

    // Lấy danh sách blogs
    async getBlogs(params?: {
        page?: number;
        size?: number;
        search?: string;
        blogType?: string;
        status?: string;
    }): Promise<{
        content: Blog[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }> {
        const response = await apiClient.get('/api/v1/blogs', { params });
        return response.data.result;
    },

    // Lấy chi tiết blog
    async getBlogById(id: string): Promise<Blog> {
        const response = await apiClient.get(`/api/v1/blogs/${id}`);
        return response.data.result;
    },

    // Cập nhật blog
    async updateBlog(id: string, data: Partial<CreateBlogRequest>): Promise<Blog> {
        const response = await apiClient.put(`/api/v1/blogs/${id}`, data);
        return response.data.result;
    },

    // Xóa blog
    async deleteBlog(id: string): Promise<void> {
        await apiClient.delete(`/api/v1/blogs/${id}`);
    },

    // Upload ảnh featured
    async uploadFeaturedImage(file: File): Promise<FileMetaDataResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/api/v1/files/upload-single-media', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.result;
    }
};