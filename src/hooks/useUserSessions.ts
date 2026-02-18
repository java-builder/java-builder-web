import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userSessionService } from "@/services/userSession.service";

export const useUserSessions = (page: number = 1, size: number = 10) => {
  return useQuery({
    queryKey: ["userSessions", page, size],
    queryFn: async () => {
      const response = await userSessionService.getMySessions(page, size);
      return {
        sessions: response.data?.data || [],
        totalPages: response.data?.totalPages || 0,
        totalElements: response.data?.totalElements || 0,
      };
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => userSessionService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSessions"] });
    },
  });
};
