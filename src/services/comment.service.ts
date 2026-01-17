import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  CreateCommentRequest,
  CreateCommentResponse,
  CommentResponse,
} from "@/types/comment";
import { API } from "@/api/api";


export interface CommentSearchParams {
  page?: number;
  size?: number;
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
    const response = await apiClient.get<
      ApiResponse<PageResponse<CommentResponse>>
    >(API.GET_ROOT_COMMENTS, {
      params: {
        blogId,
        page: params.page || 1,
        size: params.size || 10,
      },
    });
    return response.data;
  },

  getRootByLessonId: async (lessonId: string, params: CommentSearchParams = {}) => {
    const response = await apiClient.get<
      ApiResponse<PageResponse<CommentResponse>>
    >(API.GET_LESSON_ROOT_COMMENTS, {
      params: {
        lessonId,
        page: params.page || 1,
        size: params.size || 10,
      },
    });
    return response.data;
  },

  getRepliesByParentId: async (
    parentId: string,
    params: CommentSearchParams = {},
  ) => {
    const response = await apiClient.get<
      ApiResponse<PageResponse<CommentResponse>>
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
};
