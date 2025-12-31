"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user.service";
import { authApi } from "@/services/auth.service";

export const useCurrentUser = () => {
  const isAuthenticated = authApi.isAuthenticated();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await userApi.getCurrentUser();
      return res.result;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });
};
