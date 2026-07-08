import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse } from "@/types/api";
import {
  CloudflareAccessRule,
  CloudflareResponse,
  CreateAccessRuleRequest,
  UpdateAccessRuleRequest,
} from "@/types/cloudflare";

export const cloudflareService = {
  async getAll(
    params?: Record<string, string | number>
  ): Promise<ApiResponse<CloudflareResponse<CloudflareAccessRule[]>>> {
    const response = await apiClient.get<ApiResponse<CloudflareResponse<CloudflareAccessRule[]>>>(API.CLOUDFLARE, { params });
    return response.data;
  },

  async create(
    data: CreateAccessRuleRequest
  ): Promise<ApiResponse<CloudflareResponse<CloudflareAccessRule>>> {
    const response = await apiClient.post<ApiResponse<CloudflareResponse<CloudflareAccessRule>>>(API.CLOUDFLARE, data);
    return response.data;
  },

  async update(
    id: string,
    data: UpdateAccessRuleRequest
  ): Promise<ApiResponse<CloudflareResponse<CloudflareAccessRule>>> {
    const response = await apiClient.patch<ApiResponse<CloudflareResponse<CloudflareAccessRule>>>(`${API.CLOUDFLARE}/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<CloudflareResponse<unknown>>> {
    const response = await apiClient.delete<ApiResponse<CloudflareResponse<unknown>>>(`${API.CLOUDFLARE}/${id}`);
    return response.data;
  },
};
