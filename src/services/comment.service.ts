import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  CreateCommentRequest,
  CreateCommentResponse,
  CommentResponse,
} from "@/types/comment";
import toast from "react-hot-toast";

export interface CommentSearchParams {
  page?: number;
  size?: number;
}

export const commentApi = {
  create: async (data: CreateCommentRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<CreateCommentResponse>>(
        "/api/v1/comments",
        data,
      );
      toast.success("Bình luận đã được thêm thành công!");
      return response.data;
    } catch (error) {
      toast.error("Thêm bình luận thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  getRootByBlogId: async (blogId: string, params: CommentSearchParams = {}) => {
    try {
      const response = await apiClient.get<
        ApiResponse<PageResponse<CommentResponse>>
      >("/api/v1/comments/root", {
        params: {
          blogId,
          page: params.page || 1,
          size: params.size || 10,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error loading comments:", error.message);
      }
      throw error;
    }
  },

  getRepliesByParentId: async (
    parentId: string,
    params: CommentSearchParams = {},
  ) => {
    try {
      const response = await apiClient.get<
        ApiResponse<PageResponse<CommentResponse>>
      >("/api/v1/comments/replies", {
        params: {
          parentId,
          page: params.page || 1,
          size: params.size || 10,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error loading replies:", error.message);
      }
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/v1/comments/${id}`,
      );
      toast.success("Xóa bình luận thành công!");
      return response.data;
    } catch (error) {
      toast.error("Xóa bình luận thất bại. Vui lòng thử lại.");
      throw error;
    }
  },
};
