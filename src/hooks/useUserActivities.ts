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
  const formattedDate = date ? date.split(/[ T]/)[0] : undefined;

  return useQuery({
    queryKey: ["user-activities", page, size, formattedDate],
    queryFn: async () => {
      const response = await userActivityService.getMyActivities(page, size, formattedDate);
      return response.data;
    },
    enabled: Boolean(enabled && isAuthenticated),
    staleTime: 30 * 1000, // 30 seconds
  });
};
