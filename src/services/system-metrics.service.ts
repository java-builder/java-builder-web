import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { SystemHealthResponse } from "@/types/system-metric";
import { API } from "@/api/api";

export const systemMetricsService = {
  getSystemHealth: async (): Promise<ApiResponse<SystemHealthResponse>> => {
    const response = await apiClient.get<ApiResponse<SystemHealthResponse>>(API.SYSTEM_METRICS);
    return response.data;
  },
};
