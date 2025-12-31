import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface CreatePaymentRequest {
  courserId: string;
}

export interface CreatePaymentResponse {
  orderCode: number;
  checkoutUrl: string;
  qrCode: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  totalPrice: number;
  paymentGateway: string;
}

export const paymentApi = {
  createPaymentLink: async (courseId: string) => {
    const response = await apiClient.post<ApiResponse<CreatePaymentResponse>>(
      "/api/v1/payments/create-link",
      { courserId: courseId }
    );
    return response.data;
  },
};
