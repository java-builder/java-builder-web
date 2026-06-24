"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth.service";
import { clearInterviewQuestionsCache } from "@/hooks/useInterviewQuestions";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAdminAccess: boolean;
}

interface AuthContextType extends AuthState {
  logout: () => Promise<void>;
  checkAdmin: () => Promise<boolean>;
  setAuthFromLogin: (loginData?: { authorities?: string[]; accessToken?: string; userId?: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    hasAdminAccess: false,
  });

  // User thường: chỉ check token tồn tại, không gọi API
  // Nếu token expired thì khi gọi API → interceptor tự refresh
  useEffect(() => {
    const token = authApi.getAccessToken();
    setState({
      isAuthenticated: !!token,
      isLoading: false,
      hasAdminAccess: false,
    });
  }, []);

  // Admin: gọi introspect verify quyền — chỉ dùng ở ProtectedRoute(requireAdmin)
  const checkAdmin = useCallback(async (): Promise<boolean> => {
    try {
      const result = await authApi.introspect();
      if (result && result.isValid) {
        const isAdmin = (result.authorities || []).includes("ADMIN");
        setState(prev => ({ ...prev, isAuthenticated: true, hasAdminAccess: isAdmin }));
        return isAdmin;
      }
      // Token invalid + refresh fail
      authApi.clearAuthData();
      setState(prev => ({ ...prev, isAuthenticated: false, hasAdminAccess: false }));
      return false;
    } catch {
      setState(prev => ({ ...prev, isAuthenticated: false, hasAdminAccess: false }));
      return false;
    }
  }, []);

  const setAuthFromLogin = (loginData?: { authorities?: string[]; accessToken?: string; userId?: string } | null) => {
    const authorities = loginData?.authorities || [];
    setState({
      isAuthenticated: !!loginData?.accessToken,
      isLoading: false,
      hasAdminAccess: authorities.includes("ADMIN"),
    });
    // Xóa cache câu hỏi phỏng vấn để cập nhật quyền truy cập mới
    clearInterviewQuestionsCache();
  };

  const logout = async () => {
    setState({ isAuthenticated: false, isLoading: false, hasAdminAccess: false });
    queryClient.clear();
    // Xóa cache câu hỏi phỏng vấn
    clearInterviewQuestionsCache();
    try {
      await authApi.logout();
    } catch (error) {
      authApi.clearAuthData();
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, logout, checkAdmin, setAuthFromLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
