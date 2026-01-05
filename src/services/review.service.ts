import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { ReviewResponse, CreateReviewRequest, UpdateReviewRequest } from "@/types/review";
import toast from "react-hot-toast";

export const reviewApi = {
  // Tạo review mới
  create: async (data: CreateReviewRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<ReviewResponse>>(
        "/api/v1/reviews",
        data,
      );
      toast.success("Đánh giá thành công!");
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Đánh giá thất bại. Vui lòng thử lại.";
      toast.error(message);
      throw error;
    }
  },

  // Cập nhật review
  update: async (data: UpdateReviewRequest) => {
    try {
      const response = await apiClient.put<ApiResponse<ReviewResponse>>(
        "/api/v1/reviews",
        data,
      );
      toast.success("Cập nhật đánh giá thành công!");
      return response.data;
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Xóa review
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/v1/reviews/${id}`,
      );
      toast.success("Đã xóa đánh giá!");
      return response.data;
    } catch (error) {
      toast.error("Xóa thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Lấy reviews theo course
  getByCourse: async (courseId: string, page: number = 1, size: number = 10) => {
    try {
      const response = await apiClient.get<ApiResponse<PageResponse<ReviewResponse>>>(
        `/api/v1/reviews/course/${courseId}`,
        { params: { page, size } },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },
};
