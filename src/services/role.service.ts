import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse, PageResponse } from "@/types/api";
import { RoleDetailResponse, CreateRoleRequest, UpdateRoleRequest } from "@/types/role";

export const roleService = {
  async getAll(search: string = ""): Promise<ApiResponse<PageResponse<RoleDetailResponse>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<RoleDetailResponse>>>(
      API.GET_ROLES,
      { params: { search, page: 1, size: 1000 } }
    );
    return response.data;
  },

  async getPage(page: number = 1, size: number = 10, search: string = ""): Promise<ApiResponse<PageResponse<RoleDetailResponse>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<RoleDetailResponse>>>(
      API.GET_ROLES,
      { params: { page, size, search } }
    );
    return response.data;
  },

  async createRole(data: CreateRoleRequest): Promise<ApiResponse<RoleDetailResponse>> {
    const response = await apiClient.post<ApiResponse<RoleDetailResponse>>(
      API.CREATE_ROLE,
      data
    );
    return response.data;
  },

  async updateRole(id: string, data: UpdateRoleRequest): Promise<ApiResponse<RoleDetailResponse>> {
    const response = await apiClient.put<ApiResponse<RoleDetailResponse>>(
      `${API.UPDATE_ROLE}/${id}`,
      data
    );
    return response.data;
  },
};
