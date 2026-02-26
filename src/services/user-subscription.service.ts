import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { API } from "@/api/api";
import {
  UserSubscription,
  SubscribeRequest,
  SubscribeResponse,
} from "@/types/user-subscription";

export const userSubscriptionService = {
  // Đăng ký Premium
  subscribe: async (planId: string) => {
    const response = await apiClient.post<ApiResponse<SubscribeResponse>>(
      API.USER_SUBSCRIPTION_SUBSCRIBE,
      { planId } as SubscribeRequest
    );
    return response.data;
  },

  // Lấy subscription hiện tại
  getMySubscription: async () => {
    const response = await apiClient.get<ApiResponse<UserSubscription | null>>(
      API.USER_SUBSCRIPTION_MY
    );
    return response.data;
  },

  // Check premium status
  checkPremium: async () => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        API.USER_SUBSCRIPTION_CHECK_PREMIUM
      );
      return response.data;
    } catch {
      return { code: 200, data: false };
    }
  },

  // Hủy subscription
  cancel: async () => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.USER_SUBSCRIPTION_CANCEL
    );
    return response.data;
  },

  // Gia hạn subscription
  renew: async (subscriptionPlanId: string) => {
    const response = await apiClient.post<ApiResponse<{
      subscriptionPlanId: string;
      subscriptionPlanName: string;
      startDate: string;
      expirationDate: string;
    }>>(
      API.USER_SUBSCRIPTION_RENEW,
      { subscriptionPlanId }
    );
    return response.data;
  },

  // Admin: Lấy tất cả user subscriptions
  getAllUserSubscriptions: async (
    page: number = 1,
    size: number = 10,
    status?: string,
    search?: string
  ) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const response = await apiClient.get<
      ApiResponse<PageResponse<UserSubscription>>
    >(`${API.USER_SUBSCRIPTION_ADMIN_ALL}?${params.toString()}`);
    return response.data;
  },

  // Admin: Assign subscription cho user
  assignSubscription: async (email: string, subscriptionPlanId: string) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.USER_SUBSCRIPTION_ADMIN_ASSIGN,
      { email, subscriptionPlanId }
    );
    return response.data;
  },
};
