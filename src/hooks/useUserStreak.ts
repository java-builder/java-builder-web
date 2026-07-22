"use client";

import { useQuery } from "@tanstack/react-query";
import { userStreakService } from "@/services/user-streak.service";
import { authApi } from "@/services/auth.service";

export const useUserStreak = (enabled: boolean = true) => {
  const isAuthenticated = authApi.isAuthenticated();

  return useQuery({
    queryKey: ["user-streak"],
    queryFn: async () => {
      const response = await userStreakService.getMyStreak();
      return response.data;
    },
    enabled: Boolean(enabled && isAuthenticated),
    staleTime: 5 * 60 * 1000,
  });
};

export const useStreakLeaderboard = () => {
  return useQuery({
    queryKey: ["streakLeaderboard"],
    queryFn: async () => {
      const res = await userStreakService.getLeaderboard();
      return res.data;
    },
  });
};
