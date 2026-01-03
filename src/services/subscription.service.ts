import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  features: string;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface SubscribeResponse {
  orderCode: number;
  checkoutUrl: string;
  qrCode: string;
  status: string;
  totalPrice: number;
  paymentGateway: string;
}

export const subscriptionApi = {
  // Lấy danh sách gói Premium
  getPlans: async () => {
    try {
      const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
        "/api/v1/subscriptions/plans"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get plans:", error);
      throw error;
    }
  },

  // Đăng ký Premium
  subscribe: async (planId: string) => {
    try {
      const response = await apiClient.post<ApiResponse<SubscribeResponse>>(
        "/api/v1/subscriptions/subscribe",
        { planId }
      );
      return response.data;
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Lấy subscription hiện tại
  getMySubscription: async () => {
    try {
      const response = await apiClient.get<ApiResponse<UserSubscription | null>>(
        "/api/v1/subscriptions/my-subscription"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get subscription:", error);
      throw error;
    }
  },

  // Check premium status
  checkPremium: async () => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        "/api/v1/subscriptions/check-premium"
      );
      return response.data;
    } catch {
      return { code: 200, result: false };
    }
  },

  // Hủy subscription
  cancel: async () => {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        "/api/v1/subscriptions/cancel"
      );
      toast.success("Đã hủy subscription thành công");
      return response.data;
    } catch (error) {
      toast.error("Hủy subscription thất bại. Vui lòng thử lại.");
      throw error;
    }
  },
};
