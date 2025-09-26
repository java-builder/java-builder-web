'use client';

import { useState } from 'react';
import { blogService } from '@/services/blog.service';
import { CreateBlogRequest } from '@/types/blog';

export const useBlog = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createBlog = async (data: CreateBlogRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await blogService.createBlog(data);
            return result;
        } catch (err: unknown) {
            const errorMessage = (err as Error)?.message || 'Có lỗi xảy ra khi tạo bài viết';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getBlogs = async (params?: {
        page?: number;
        size?: number;
        search?: string;
        blogType?: string;
        status?: string;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await blogService.getBlogs(params);
            return result;
        } catch (err: unknown) {
            const errorMessage = (err as Error)?.message || 'Có lỗi xảy ra khi tải danh sách bài viết';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBlog = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await blogService.deleteBlog(id);
        } catch (err: unknown) {
            const errorMessage = (err as Error)?.message || 'Có lỗi xảy ra khi xóa bài viết';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const uploadImage = async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await blogService.uploadFeaturedImage(file);
            return result;
        } catch (err: unknown) {
            const errorMessage = (err as Error)?.message || 'Có lỗi xảy ra khi tải ảnh lên';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        createBlog,
        getBlogs,
        deleteBlog,
        uploadImage,
        clearError: () => setError(null)
    };
};