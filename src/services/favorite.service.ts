import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse, PageResponse } from "@/types/api";
import { FavoriteResponse, FavoriteRequest, FavoriteTargetType } from "@/types/favorite";

export const favoriteService = {
  // Toggle favorite (add/remove)
  toggle: async (request: FavoriteRequest) => {
    const response = await apiClient.post<ApiResponse<boolean>>(
      API.FAVORITES_TOGGLE,
      request
    );
    return response.data;
  },

  // Check if item is favorited
  check: async (targetId: string, targetType: FavoriteTargetType) => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        `${API.FAVORITES_CHECK}/${targetId}`,
        { params: { targetType } }
      );
      return response.data;
    } catch {
      return { code: 200, data: false };
    }
  },

  // Get user's favorites
  getMyFavorites: async (page: number = 1, size: number = 12, targetType?: FavoriteTargetType) => {
    const params: { page: number; size: number; targetType?: FavoriteTargetType } = { page, size };
    if (targetType) {
      params.targetType = targetType;
    }
    const response = await apiClient.get<ApiResponse<PageResponse<FavoriteResponse>>>(
      API.FAVORITES_ME,
      { params }
    );
    return response.data;
  },
};
