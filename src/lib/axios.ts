import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/f-learning";

let refreshPromise: Promise<string> | null = null;

const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;

  const publicEndpoints = [
    "/api/v1/auth/login",
    "/api/v1/auth/login-two-factor",
    "/api/v1/auth/register",
    "/api/v1/auth/forgot-password",
    "/api/v1/auth/reset-password",
    "/api/v1/auth/verify-email",
    "/api/v1/auth/refresh",
  ];

  return publicEndpoints.some((endpoint) => url.includes(endpoint));
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    const apiResponse = response.data as ApiResponse<unknown>;

    if (apiResponse.code < 200 || apiResponse.code > 299) {
      return Promise.reject({
        response: {
          status: apiResponse.code,
          data: apiResponse,
        },
      });
    }

    return response;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const apiResponse = error.response?.data;

    if (error.response?.status === 401) {
      if (isPublicEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          if (!refreshPromise) {
            refreshPromise = (async () => {
              const response = await axios.post(
                `${BASE_URL}/api/v1/auth/refresh`,
                {},
                {
                  withCredentials: true,
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );

              const token = response.data?.result?.accessToken;
              if (!token) {
                throw new Error("No access token from refresh");
              }

              if (typeof window !== "undefined") {
                localStorage.setItem("access_token", token);
              }
              return token;
            })();
          }

          const newAccessToken = await refreshPromise;

          originalRequest.headers.set(
            "Authorization",
            `Bearer ${newAccessToken}`,
          );
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          try {
            return await apiClient(originalRequest);
          } catch (innerError: unknown) {
            if ((innerError as AxiosError)?.response?.status === 401) {
              if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user_id");
                if (!window.location.pathname.includes("/login")) {
                  window.location.href = "/login";
                }
              }
            }
            throw innerError;
          }
        } catch {
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_id");
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
          }
          return Promise.reject(error);
        } finally {
          refreshPromise = null;
        }
      }
    }

    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/403";
      }
      return Promise.reject(error);
    }

    if (apiResponse?.message) {
      return Promise.reject({
        ...error,
        message: apiResponse.message,
      });
    }

    return Promise.reject(error);
  },
);
