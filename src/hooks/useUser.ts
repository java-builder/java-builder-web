"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/services/user.service";
import { UserDetailResponse, UserStatisticsResponse } from "@/types/user";
import { authApi } from "@/services/auth.service";
import { useState, useEffect, useCallback } from "react";
import { ApiResponse, PageResponse } from "@/types/api";

export const useUser = (userId?: string) => {
  const queryClient = useQueryClient();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

export const useUsersList = (debouncedSearch: string, currentPage: number) => {
  const [response, setResponse] = useState<ApiResponse<PageResponse<UserDetailResponse>> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState<UserStatisticsResponse | null>(null);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const result = await userApi.search({
        page: currentPage + 1,
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      setResponse(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!statsLoaded) {
      const fetchStats = async () => {
        try {
          const res = await userApi.getStatistics();
          setStats(res.data ?? null);
          setStatsLoaded(true);
        } catch (err) {
          console.error("Failed to fetch user statistics", err);
        }
      };
      fetchStats();
    }
  }, [statsLoaded]);

  return {
    response,
    isLoading,
    error,
    stats,
    refetch: fetchUsers,
  };
};
