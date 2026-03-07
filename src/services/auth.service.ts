import { API } from "@/api/api";
import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  IntrospectRequest,
  IntrospectResponse,
  TwoFactorAuthenticationRequest,
} from "@/types/auth";

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API.LOGIN_USERNAME_PASSWORD,
      data,
    );

    if (response.data.code === 200) {
      if (response.data.data?.mftEnable) {
        return response.data;
      } else if (
        response.data.data?.accessToken &&
        response.data.data?.userId
      ) {
        localStorage.setItem("access_token", response.data.data.accessToken);
        localStorage.setItem("user_id", response.data.data.userId);
      }
    }
    return response.data;
  },

  logout: async () => {
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
    }

    if (hasToken) {
      try {
        await apiClient.post<ApiResponse<LogoutResponse>>(API.LOGOUT);
      } catch (error) {
        console.error("Logout API error (ignored):", error);
      }
    }
  },

  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },

  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  getUserId: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("user_id");
  },

  clearAuthData: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
  },

  introspect: async (): Promise<IntrospectResponse | null> => {
    try {
      const token = authApi.getAccessToken();
      if (!token) {
        return null;
      }

      const request: IntrospectRequest = { token };
      const response = await apiClient.post<ApiResponse<IntrospectResponse>>(
        API.INTROSPECT,
        request,
      );
      return response.data.data || null;
    } catch {
      return null;
    }
  },

  loginWithGoogle: async (code: string) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API.LOGIN_GOOGLE,
      null,
      { params: { code } },
    );

    if (
      response.data.code === 200 &&
      response.data.data?.accessToken &&
      response.data.data?.userId
    ) {
      localStorage.setItem("access_token", response.data.data.accessToken);
      localStorage.setItem("user_id", response.data.data.userId);
    }

    return response.data;
  },

  loginWithLinkedin: async (code: string) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API.LOGIN_LINKEDIN,
      null,
      { params: { code } },
    );

    if (
      response.data.code === 200 &&
      response.data.data?.accessToken &&
      response.data.data?.userId
    ) {
      localStorage.setItem("access_token", response.data.data.accessToken);
      localStorage.setItem("user_id", response.data.data.userId);
    }

    return response.data;
  },

  loginTwoFactor: async (data: TwoFactorAuthenticationRequest) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API.LOGIN_TWO_FACTOR,
      data,
    );

    if (
      response.data.code === 200 &&
      response.data.data?.accessToken &&
      response.data.data?.userId
    ) {
      localStorage.setItem("access_token", response.data.data.accessToken);
      localStorage.setItem("user_id", response.data.data.userId);
    }

    return response.data;
  },
};
