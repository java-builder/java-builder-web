"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/services/user.service";
import { UserDetailResponse } from "@/types/user";
import { authApi } from "@/services/auth.service";
import { useState, useEffect } from "react";

export const useUser = (userId?: string) => {
  const queryClient = useQueryClient();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth sau khi mount (client-side)
  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
    setIsAuthChecked(true);
  }, []);

  const { data: user, isLoading, isFetching, error: queryError } = useQuery({
    queryKey: userId ? ["user", userId] : ["currentUser"],
    queryFn: async () => {
      const response = userId 
        ? await userApi.getById(userId)
        : await userApi.getCurrentUser();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const updateUser = async (data: Partial<UserDetailResponse>) => {
    if (!user) return;
    
    const queryKey = userId ? ["user", userId] : ["currentUser"];
    queryClient.setQueryData(queryKey, (old: UserDetailResponse | undefined) => 
      old ? { ...old, ...data } : old
    );
  };

  const refetch = () => {
    const queryKey = userId ? ["user", userId] : ["currentUser"];
    queryClient.invalidateQueries({ queryKey });
  };

  // Loading khi: chưa check auth xong HOẶC đang fetch
  const loading = !isAuthChecked || isLoading || (isFetching && !user);

  return {
    user: user || null,
    loading,
    error: queryError ? (queryError as Error).message : null,
    updateUser,
    refetch,
    isAuthenticated,
  };
};
