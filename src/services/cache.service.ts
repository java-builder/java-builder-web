import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { CacheInfo } from "@/types/cache";
import { API } from "@/api/api";

export const cacheService = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<CacheInfo[]>>(API.ADMIN_CACHES);
    return response.data;
  },

  getKeys: async (cacheName: string) => {
    const response = await apiClient.get<ApiResponse<string[]>>(`${API.ADMIN_CACHES}/${encodeURIComponent(cacheName)}/keys`);
    return response.data;
  },

  clearCache: async (cacheName: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`${API.ADMIN_CACHES}/${encodeURIComponent(cacheName)}`);
    return response.data;
  },

  clearAll: async () => {
    const response = await apiClient.delete<ApiResponse<void>>(API.ADMIN_CACHES);
    return response.data;
  },

  evictKey: async (cacheName: string, key: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`${API.ADMIN_CACHES}/${encodeURIComponent(cacheName)}/key`, {
      params: { key },
    });
    return response.data;
  },
};
