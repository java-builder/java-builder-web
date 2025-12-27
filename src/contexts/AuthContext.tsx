"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { authApi } from "@/services/auth.service";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAdminAccess: boolean;
  userScopes: string[];
  error: string | null;
}

interface AuthContextType extends AuthState {
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    hasAdminAccess: false,
    userScopes: [],
    error: null,
  });

  const checkAuth = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = authApi.getAccessToken();
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          hasAdminAccess: false,
          userScopes: [],
          error: null,
        });
        return;
      }

      const introspectResult = await authApi.introspect();

      if (!introspectResult) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          hasAdminAccess: false,
          userScopes: [],
          error: "Không thể xác thực token",
        });
        return;
      }

      const isValid = introspectResult.valid;
      const hasAdminAccess =
        isValid && introspectResult.scopes?.includes("ADMIN");

      setAuthState({
        isAuthenticated: isValid,
        isLoading: false,
        hasAdminAccess,
        userScopes: introspectResult.scopes || [],
        error: null,
      });
    } catch {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        hasAdminAccess: false,
        userScopes: [],
        error: "Lỗi xác thực",
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Silent fail for logout
    } finally {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        hasAdminAccess: false,
        userScopes: [],
        error: null,
      });
    }
  }, []);

  // Chỉ gọi 1 lần khi provider mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    ...authState,
    checkAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
