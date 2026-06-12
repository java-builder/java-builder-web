"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";

export const useCurrentUser = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await userApi.getCurrentUser();
      return res.data;
    },
    enabled: isAuthenticated && !isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
