import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { API } from "@/api/api";
import {
  SubscriptionPlan,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
} from "@/types/subscription";

export const subscriptionPlanService = {
  // Lấy danh sách gói Premium (Public)
  getPlans: async () => {
    const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
      API.SUBSCRIPTION_PLANS
    );
    return response.data;
  },

  // Lấy tất cả gói Premium (Admin)
  getAllPlansAdmin: async () => {
    const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
      API.SUBSCRIPTION_ADMIN_PLANS
    );
    return response.data;
  },

  // Tạo gói Premium (Admin)
  createPlan: async (data: CreateSubscriptionPlanRequest) => {
    const response = await apiClient.post<ApiResponse<SubscriptionPlan>>(
      API.SUBSCRIPTION_CREATE_PLAN,
      data
    );
    return response.data;
  },

  // Cập nhật gói Premium (Admin)
  updatePlan: async (data: UpdateSubscriptionPlanRequest) => {
    const response = await apiClient.put<ApiResponse<SubscriptionPlan>>(
      API.SUBSCRIPTION_UPDATE_PLAN,
      data
    );
    return response.data;
  },

  // Xóa gói Premium (Admin)
  deletePlan: async (planId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.SUBSCRIPTION_DELETE_PLAN}/${planId}`
    );
    return response.data;
  },
};
