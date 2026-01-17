import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { ReviewResponse, CreateReviewRequest, UpdateReviewRequest } from "@/types/review";
import { API } from "@/api/api";

export const reviewApi = {
  // Tạo review mới
  create: async (data: CreateReviewRequest) => {
    const response = await apiClient.post<ApiResponse<ReviewResponse>>(
      API.CREATE_REVIEW,
      data,
    );
    return response.data;
  },

  // Cập nhật review
  update: async (data: UpdateReviewRequest) => {
    const response = await apiClient.put<ApiResponse<ReviewResponse>>(
      API.UPDATE_REVIEW,
      data,
    );
    return response.data;
  },

  // Xóa review
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_REVIEW}/${id}`,
    );
    return response.data;
  },

  // Lấy reviews theo course
  getByCourse: async (courseId: string, page: number = 1, size: number = 10) => {
    const response = await apiClient.get<ApiResponse<PageResponse<ReviewResponse>>>(
      `${API.GET_REVIEWS_BY_COURSE}/${courseId}`,
      { params: { page, size } },
    );
    return response.data;
  },
};
