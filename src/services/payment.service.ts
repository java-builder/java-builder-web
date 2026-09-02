import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { CreatePaymentResponse, PaymentDetailResponse } from "@/types/payment";
import { API } from "@/api/api";

export interface PaymentSearchParams {
  page?: number;
  size?: number;
  orderCode?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const paymentApi = {
  createPaymentLink: async (courseId: string) => {
    const response = await apiClient.post<ApiResponse<CreatePaymentResponse>>(
      API.PAYMENT_CREATE_LINK,
      { courserId: courseId }
    );
    return response.data;
  },

  getMyPaymentHistory: async (page: number = 1, size: number = 10) => {
    const response = await apiClient.get<ApiResponse<PageResponse<PaymentDetailResponse>>>(
      API.PAYMENT_MY_HISTORY,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  getAllPayments: async (params: PaymentSearchParams) => {
    const response = await apiClient.get<ApiResponse<PageResponse<PaymentDetailResponse>>>(
      API.PAYMENT_ALL,
      {
        params: {
          page: params.page || 1,
          size: params.size || 10,
          orderCode: params.orderCode,
          startDate: params.startDate,
          endDate: params.endDate,
          status: params.status,
        },
      }
    );
    return response.data;
  },

  deleteExpiredPayment: async (paymentId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.PAYMENT_DELETE}/${paymentId}`
    );
    return response.data;
  },

  deleteAllExpiredPayments: async () => {
    const response = await apiClient.delete<ApiResponse<number>>(
      API.PAYMENT_DELETE_ALL_EXPIRED
    );
    return response.data;
  },
};
