"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/services/user.service";
import { ProfileDetailResponse } from "@/types/user";
import { authApi } from "@/services/auth.service";
import { useState, useEffect } from "react";

export const useProfileDetails = () => {
  const queryClient = useQueryClient();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
    setIsAuthChecked(true);
  }, []);

  const { data: profile, isLoading, isFetching, error: queryError } = useQuery<ProfileDetailResponse>({
    queryKey: ["profileDetails"],
    queryFn: async () => {
      const response = await userApi.getProfileDetails();
      if (!response.data) {
        throw new Error("Không thể lấy thông tin cá nhân");
      }
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const updateProfile = async (data: Partial<ProfileDetailResponse>) => {
    if (!profile) return;
    
    queryClient.setQueryData(["profileDetails"], (old: ProfileDetailResponse | undefined) => 
      old ? { ...old, ...data } : old
    );
  };

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["profileDetails"] });
  };

  const loading = !isAuthChecked || isLoading || (isFetching && !profile);

  return {
    profile: profile || null,
    loading,
    error: queryError ? (queryError as Error).message : null,
    updateProfile,
    refetch,
    isAuthenticated,
  };
};
