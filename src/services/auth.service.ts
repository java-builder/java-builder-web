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
      if (response.data.result?.mftEnable) {
        return response.data;
      } else if (
        response.data.result?.accessToken &&
        response.data.result?.userId
      ) {
        localStorage.setItem("access_token", response.data.result.accessToken);
        localStorage.setItem("user_id", response.data.result.userId);
      }
    }
    return response.data;
  },

  logout: async () => {
    // Lấy token trước khi xóa
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");
    
    // Xóa localStorage trước để ngăn các component fetch data
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
    }

    // Chỉ gọi API logout nếu có token
    if (hasToken) {
      try {
        await apiClient.post<ApiResponse<LogoutResponse>>(API.LOGOUT);
      } catch (error) {
        // Ignore logout API errors since we already cleared local data
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
      return response.data.result || null;
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
      response.data.result?.accessToken &&
      response.data.result?.userId
    ) {
      localStorage.setItem("access_token", response.data.result.accessToken);
      localStorage.setItem("user_id", response.data.result.userId);
    }

    return response.data;
  },

  loginWithGithub: async (code: string) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API.LOGIN_GITHUB,
      null,
      { params: { code } },
    );

    if (
      response.data.code === 200 &&
      response.data.result?.accessToken &&
      response.data.result?.userId
    ) {
      localStorage.setItem("access_token", response.data.result.accessToken);
      localStorage.setItem("user_id", response.data.result.userId);
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
      response.data.result?.accessToken &&
      response.data.result?.userId
    ) {
      localStorage.setItem("access_token", response.data.result.accessToken);
      localStorage.setItem("user_id", response.data.result.userId);
    }

    return response.data;
  },
};
