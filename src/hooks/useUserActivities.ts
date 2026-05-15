"use client";

import { useQuery } from "@tanstack/react-query";
import { userActivityService } from "@/services/user-activity.service";
import { authApi } from "@/services/auth.service";

export const useUserActivities = (
  page: number = 1,
  size: number = 10,
  date?: string,
  enabled: boolean = true
) => {
  const isAuthenticated = authApi.isAuthenticated();

  return useQuery({
    queryKey: ["user-activities", page, size, date],
    queryFn: async () => {
      const response = await userActivityService.getMyActivities(page, size, date);
      return response.data;
    },
    enabled: Boolean(enabled && isAuthenticated),
    staleTime: 30 * 1000, // 30 seconds
  });
};
