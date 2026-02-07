import { apiClient } from "@/api/axios";
import { CreateBlogRequest, CreateBlogResponse, Blog } from "@/types/blog";
import { FileMetaDataResponse } from "@/types/file";
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

  // Upload ảnh featured bằng presigned URL
  async uploadFeaturedImage(file: File): Promise<{ key: string }> {
    // 1. Lấy presigned URL từ BE
    const presignedResponse = await fileApi.getPresignedUrl(file.name, 'public');
    if (!presignedResponse.data) {
      throw new Error("Không thể lấy URL upload");
    }

    const { url, key } = presignedResponse.data;

    // 2. Upload trực tiếp lên S3
    await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    // 3. Trả về key để lưu vào DB
    return { key };
  },

  // Upload ảnh featured (old method - qua backend)
  async uploadFeaturedImageViaBackend(file: File): Promise<FileMetaDataResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      API.FILES_UPLOAD_SINGLE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return (response.data as { data?: FileMetaDataResponse }).data as FileMetaDataResponse;
  },
};
