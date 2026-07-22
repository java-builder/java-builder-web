"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { paymentApi, PaymentSearchParams } from "@/services/payment.service";

export const useMyPaymentHistory = (page: number = 1, size: number = 10) => {
  return useQuery({
    queryKey: ["myPaymentHistory", page, size],
    queryFn: async () => {
      const response = await paymentApi.getMyPaymentHistory(page, size);
      return response.data;
    },
    staleTime: 30 * 1000,
  });
};

export const useAllPayments = (params: PaymentSearchParams) => {
  return useQuery({
    queryKey: ["allPayments", params],
    queryFn: async () => {
      const response = await paymentApi.getAllPayments(params);
      return response.data;
    },
    staleTime: 30 * 1000,
  });
};

export const useCreatePaymentLink = () => {
  return useMutation({
    mutationFn: (courseId: string) => paymentApi.createPaymentLink(courseId),
  });
};
