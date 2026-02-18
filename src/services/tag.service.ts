import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse, PageResponse } from "@/types/api";
import { Tag, TagDetailResponse, CreateTagRequest, UpdateTagRequest } from "@/types/tag";

export const tagService = {
  async getAll(search: string = ""): Promise<ApiResponse<PageResponse<TagDetailResponse>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<TagDetailResponse>>>(
      API.GET_TAGS,
      { params: { search, page: 1, size: 1000 } }
    );
    return response.data;
  },

  async search(query: string, page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<Tag>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<Tag>>>(
      API.GET_TAGS,
      { params: { page, size, search: query } }
    );
    return response.data;
  },

  async createTag(data: CreateTagRequest): Promise<ApiResponse<TagDetailResponse>> {
    const response = await apiClient.post<ApiResponse<TagDetailResponse>>(
      API.CREATE_TAG,
      data
    );
    return response.data;
  },

  async updateTag(id: string, data: UpdateTagRequest): Promise<ApiResponse<TagDetailResponse>> {
    const response = await apiClient.put<ApiResponse<TagDetailResponse>>(
      `${API.UPDATE_TAG}/${id}`,
      data
    );
    return response.data;
  },

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_TAG}/${id}`
    );
    return response.data;
  },
};
