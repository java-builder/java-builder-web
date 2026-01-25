import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { CreateCategoryRequest, CreateCategoryResponse, CategoryDetailResponse } from "@/types/category";
import { API } from "@/api/api";

export const categoryService = {
  create: async (data: CreateCategoryRequest) => {
    const response = await apiClient.post<ApiResponse<CreateCategoryResponse>>(API.CREATE_CATEGORY, data);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get<ApiResponse<CategoryDetailResponse[]>>(API.GET_CATEGORIES);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`${API.DELETE_CATEGORY}/${id}`);
    return response.data;
  },
 
  updateCategory: async (id: string, data: Partial<CreateCategoryRequest>) => {
    const response = await apiClient.put<ApiResponse<CreateCategoryResponse>>(`${API.UPDATE_CATEGORY}/${id}`, data);
    return response.data;
  },
};


