import { apiClient } from "@/api/axios";
import { CreateBlogRequest, CreateBlogResponse, Blog } from "@/types/blog";
import { API } from "@/api/api";
import { ApiResponse, PageResponse } from "@/types/api";
import { fileApi } from "./course.service";

export const blogService = {
  // Tạo blog mới
  async createBlog(data: CreateBlogRequest): Promise<CreateBlogResponse> {
    const response = await apiClient.post(API.CREATE_BLOG, data);
    return response.data;
  },

  // Lấy danh sách blogs
  async getBlogs(params?: {
    page?: number;
    size?: number;
    titleOrSummary?: string;
    blogType?: string;
  }): Promise<ApiResponse<PageResponse<Blog>>> {
    const response = await apiClient.get(API.GET_BLOGS, { params });
    return response.data;
  },

  // Lấy chi tiết blog theo ID
  async getBlogById(id: string): Promise<Blog> {
    const response = await apiClient.get(`${API.GET_BLOG_BY_ID}/${id}`);
    return (response.data as { data?: Blog }).data as Blog;
  },

  // Lấy chi tiết blog theo slug
  async getBlogBySlug(slug: string): Promise<Blog> {
    const response = await apiClient.get(`${API.GET_BLOG_BY_SLUG}/${slug}`);
    return (response.data as { data?: Blog }).data as Blog;
  },

  // Tăng lượt xem
  async incrementView(slug: string): Promise<number> {
    const response = await apiClient.patch(
      `${API.INCREMENT_VIEW}/${slug}/increment-view`,
    );
    return response.data.data as number;
  },

  // Tăng lượt thích
  async incrementLike(slug: string): Promise<number> {
    const response = await apiClient.patch(
      `${API.INCREMENT_LIKE}/${slug}/increment-like`,
    );
    return response.data.data as number;
  },

  // Cập nhật blog
  async updateBlog(
    id: string,
    data: Partial<CreateBlogRequest>,
  ): Promise<Blog> {
    const response = await apiClient.put(`${API.UPDATE_BLOG}/${id}`, data);
    return response.data;
  },

  // Xóa blog
  async deleteBlog(id: string): Promise<void> {
    await apiClient.delete(`${API.DELETE_BLOG}/${id}`);
  },

  // Lấy danh sách blogs nổi bật (top 10)
  async getFeaturedBlogs(): Promise<ApiResponse<Blog[]>> {
    const response = await apiClient.get(API.GET_FEATURED_BLOGS);
    return response.data;
  },

  // Lấy vị trí nổi bật lớn nhất hiện tại
  async getMaxFeaturedOrder(): Promise<ApiResponse<number>> {
    const response = await apiClient.get(API.GET_MAX_FEATURED_ORDER);
    return response.data;
  },

  // Upload ảnh featured bằng presigned URL
  async uploadFeaturedImage(file: File): Promise<{ key: string }> {
    return fileApi.uploadPublicImage(file);
  },
};
