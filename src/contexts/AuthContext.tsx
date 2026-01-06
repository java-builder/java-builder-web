"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authApi } from "@/services/auth.service";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAdminAccess: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  logout: () => Promise<void>;
  checkAuth: () => Promise<string[]>;
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
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    hasAdminAccess: false,
    error: null,
  });

  const checkAuth = useCallback(async (): Promise<string[]> => {
    const token = authApi.getAccessToken();
    
    if (!token) {
      setState({ isAuthenticated: false, isLoading: false, hasAdminAccess: false, error: null });
      return [];
    }

    try {
      const result = await authApi.introspect();
      const authorities = result?.authorities || [];
      setState({
        isAuthenticated: result?.valid || false,
        isLoading: false,
        hasAdminAccess: authorities.includes("ADMIN"),
        error: null,
      });
      return authorities;
    } catch {
      setState({ isAuthenticated: false, isLoading: false, hasAdminAccess: false, error: "Lỗi xác thực" });
      return [];
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      authApi.clearAuthData();
    }
    setState({ isAuthenticated: false, isLoading: false, hasAdminAccess: false, error: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
