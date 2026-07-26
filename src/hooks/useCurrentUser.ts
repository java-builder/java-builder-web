"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";
import { EnrolledUserResponse } from "@/services/enrollment.service";

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

export const useChatCurrentUser = (): EnrolledUserResponse => {
  const { data: user } = useCurrentUser();

  if (user && user.id) {
    return {
      id: user.id,
      username: user.username || user.email || "Người dùng",
      avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: (user.authorities?.[0] as string) || "USER",
      status: "online",
    };
  }

  return {
    id: "usr_me",
    username: "Bạn",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "USER",
    status: "online",
  };
};
