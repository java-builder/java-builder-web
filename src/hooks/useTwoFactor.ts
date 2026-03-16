"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { twoFactorApi } from "@/services/two-factor.service";
import { EnableTwoFactorRequest } from "@/types/two-factor";
import { authApi } from "@/services/auth.service";

export const useTwoFactorStatus = () => {
  const isAuthenticated = authApi.isAuthenticated();

  return useQuery({
    queryKey: ["twoFactorStatus"],
    queryFn: async () => {
      const response = await twoFactorApi.getStatus();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 phút
    gcTime: 5 * 60 * 1000, // 5 phút
  });
};

export const useTwoFactorActivate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await twoFactorApi.activate();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["twoFactorStatus"] });
    },
  });
};

export const useTwoFactorVerifySetup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: EnableTwoFactorRequest) => {
      const response = await twoFactorApi.verifyCodeSetup(request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["twoFactorStatus"], true);
      queryClient.setQueryData(["twoFactorStatus"], true);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useTwoFactorDisable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await twoFactorApi.disable();
      return response.data;
    },
    onSuccess: () => {
      // Update status to disabled
      queryClient.setQueryData(["twoFactorStatus"], false);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

// Combined hook for complete MFA management
export const useTwoFactor = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const statusQuery = useTwoFactorStatus();
  const activateMutation = useTwoFactorActivate();
  const verifyMutation = useTwoFactorVerifySetup();
  const disableMutation = useTwoFactorDisable();

  const isEnabled = statusQuery.data ?? false;
  const loading = statusQuery.isLoading || isLoading;

  const activate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const result = await activateMutation.mutateAsync();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi thiết lập 2FA";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activateMutation]);

  const verifySetup = useCallback(async (code: string) => {
    try {
      setIsLoading(true);
      setError("");
      await verifyMutation.mutateAsync({ code });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Mã xác thực không đúng";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [verifyMutation]);

  const disable = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      await disableMutation.mutateAsync();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tắt 2FA";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [disableMutation]);

  const refetch = useCallback(() => {
    statusQuery.refetch();
  }, [statusQuery]);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    isEnabled,
    loading,
    error,
    activate,
    verifySetup,
    disable,
    refetch,
    clearError,
  };
};