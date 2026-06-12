import { API } from "@/api/api";
import { apiClient } from "@/api/axios";
import axios from "axios";
import { ApiResponse } from "@/types/api";
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  IntrospectRequest,
  IntrospectResponse,
  TwoFactorAuthenticationRequest,
} from "@/types/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/java-builder";

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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token) {
      try {
        await apiClient.post<ApiResponse<LogoutResponse>>(API.LOGOUT, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Logout API error (ignored):", error);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
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

  /**
   * Gọi introspect bằng axios raw (không qua apiClient) để tránh gắn
   * Authorization header — Spring Security reject expired token ở header
   * dù endpoint là permitAll.
   *
   * Nếu token hết hạn (isValid: false) → tự refresh rồi introspect lại.
   */
  introspect: async (): Promise<IntrospectResponse | null> => {
    const token = authApi.getAccessToken();
    if (!token) return null;

    try {
      const request: IntrospectRequest = { token };
      const response = await axios.post<ApiResponse<IntrospectResponse>>(
        `${BASE_URL}/api/v1/auth/introspect`,
        request,
        { headers: { "Content-Type": "application/json" } },
      );
      const data = response.data.data;

      // Token hết hạn → refresh → introspect lại với token mới
      if (data && !data.isValid) {
        const newToken = await authApi.refreshToken();
        if (!newToken) return null;

        const retry = await axios.post<ApiResponse<IntrospectResponse>>(
          `${BASE_URL}/api/v1/auth/introspect`,
          { token: newToken } as IntrospectRequest,
          { headers: { "Content-Type": "application/json" } },
        );
        return retry.data.data || null;
      }

      return data || null;
    } catch {
      return null;
    }
  },

  /**
   * Gọi refresh bằng axios raw — refresh token nằm trong cookie (withCredentials).
   * Không cần Authorization header.
   */
  refreshToken: async (): Promise<string | null> => {
    try {
      const response = await axios.post<ApiResponse<LoginResponse>>(
        `${BASE_URL}/api/v1/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      const newToken = response.data.data?.accessToken;
      if (newToken && typeof window !== "undefined") {
        localStorage.setItem("access_token", newToken);
        const userId = response.data.data?.userId;
        if (userId) {
          localStorage.setItem("user_id", userId);
        }
      }
      return newToken || null;
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

  loginWithLinkedin: async (code: string) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API.LOGIN_LINKEDIN,
      null,
      { params: { code } },
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

  loginWithGithub: async (code: string) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API.LOGIN_GITHUB,
      null,
      { params: { code } },
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
};
