import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { API } from "@/api/api";

import {
  SubscriptionPlan,
  UserSubscription,
  SubscribeResponse,
} from "@/types/subscription";

export const subscriptionApi = {
  // Lấy danh sách gói Premium
  getPlans: async () => {
    const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
      API.SUBSCRIPTION_PLANS
    );
    return response.data;
  },

  // Đăng ký Premium
  subscribe: async (planId: string) => {
    const response = await apiClient.post<ApiResponse<SubscribeResponse>>(
      API.SUBSCRIPTION_SUBSCRIBE,
      { planId }
    );
    return response.data;
  },

  // Lấy subscription hiện tại
  getMySubscription: async () => {
    const response = await apiClient.get<ApiResponse<UserSubscription | null>>(
      API.SUBSCRIPTION_MY
    );
    return response.data;
  },

  // Check premium status
  checkPremium: async () => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        API.SUBSCRIPTION_CHECK_PREMIUM
      );
      return response.data;
    } catch {
      return { code: 200, data: false };
    }
  },

  // Hủy subscription
  cancel: async () => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.SUBSCRIPTION_CANCEL
    );
    return response.data;
  },
};
