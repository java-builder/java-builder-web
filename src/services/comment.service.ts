import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  CreateCommentRequest,
  CreateCommentResponse,
  CommentResponse,
  CommentDetailResponse,
} from "@/types/comment";
import { API } from "@/api/api";

export interface CommentSearchParams {
  page?: number;
  size?: number;
}

export interface AdminCommentParams {
  page?: number;
  size?: number;
  type: "BLOG" | "LESSON" | "POST" | "QUESTION";
  status?: "ACTIVE" | "DELETED"; 
}

export const commentApi = {
  create: async (data: CreateCommentRequest) => {
    const response = await apiClient.post<ApiResponse<CreateCommentResponse>>(
      API.CREATE_COMMENT,
      data,
    );
    return response.data;
  },

  getRootByBlogId: async (blogId: string, params: CommentSearchParams = {}) => {
    // Backwards-compatible wrapper that calls unified endpoint
    return await commentApi.getRootByTarget(blogId, "BLOG", params);
  },

  /**
   * Generic root comments loader by target id and type.
   * Backend should accept `targetId` and `type` as query params on GET_ROOT_COMMENTS.
   */
  getRootByTarget: async (targetId: string, type: "BLOG" | "LESSON" | "POST" | "QUESTION", params: CommentSearchParams = {}) => {
    const response = await apiClient.get<
      ApiResponse<PageResponse<CommentResponse>>
    >(API.GET_ROOT_COMMENTS, {
      params: {
        targetId,
        type,
        page: params.page || 1,
        size: params.size || 10,
      },
    });
    return response.data;
  },

  getRootByLessonId: async (lessonId: string, params: CommentSearchParams = {}) => {
    // Backwards-compatible wrapper that calls unified endpoint
    return await commentApi.getRootByTarget(lessonId, "LESSON", params);
  },

  getRepliesByParentId: async (
    parentId: string,
    params: CommentSearchParams = {},
  ) => {
    const response = await apiClient.get<
      ApiResponse<PageResponse<CommentDetailResponse>>
    >(API.GET_COMMENT_REPLIES, {
      params: {
        parentId,
        page: params.page || 1,
        size: params.size || 10,
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_COMMENT}/${id}`,
    );
    return response.data;
  },

  getCommentsForAdmin: async (params: AdminCommentParams) => {
    const response = await apiClient.get<
      ApiResponse<PageResponse<CommentDetailResponse>>
    >(`${API.COMMENTS}/admin`, {
      params: {
        page: params.page || 1,
        size: params.size || 10,
        type: params.type,
        ...(params.status && { status: params.status }), // Only include status if provided
      },
    });
    return response.data;
  },
};
