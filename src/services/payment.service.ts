import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { API } from "@/api/api";

import { CreatePaymentResponse } from "@/types/payment";

export const paymentApi = {
  createPaymentLink: async (courseId: string) => {
    const response = await apiClient.post<ApiResponse<CreatePaymentResponse>>(
      API.PAYMENT_CREATE_LINK,
      { courserId: courseId }
    );
    return response.data;
  },
};
