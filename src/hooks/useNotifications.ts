"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/services/notification.service";
import { authApi } from "@/services/auth.service";

export const useNotifications = (page = 1, type: "all" | "unread" = "all") => {
  const isAuthenticated = authApi.isAuthenticated();

  return useQuery({
    queryKey: ["notifications", type, page],
    queryFn: async () => {
      const res = type === "unread"
        ? await notificationApi.getUnreadNotifications(page)
        : await notificationApi.getMyNotifications(page);
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => notificationApi.markAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
