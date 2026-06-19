import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse } from "@/types/api";
import {
  RegistrationOptionsResponse,
  CreatePasskeyRequest,
  AuthenticationOptionsResponse,
  LoginPasskeyOptionRequest,
  LoginPasskeyRequest
} from "@/types/passkey";
import { LoginResponse } from "@/types/auth";

export const passkeyApi = {
  getRegistrationOptions: async (): Promise<ApiResponse<RegistrationOptionsResponse>> => {
    const response = await apiClient.post<ApiResponse<RegistrationOptionsResponse>>(
      API.PASSKEY_REG_OPTIONS
    );
    return response.data;
  },

  registerPasskey: async (data: CreatePasskeyRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.PASSKEY_REGISTER,
      data
    );
    return response.data;
  },

  getLoginOptions: async (email?: string | null): Promise<ApiResponse<AuthenticationOptionsResponse>> => {
    const requestData: LoginPasskeyOptionRequest = { email: email || null };
    const response = await apiClient.post<ApiResponse<AuthenticationOptionsResponse>>(
      API.PASSKEY_AUTH_OPTIONS,
      requestData
    );
    return response.data;
  },

  loginPasskey: async (data: LoginPasskeyRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API.PASSKEY_AUTH_LOGIN,
      data
    );

    if (response.data.code === 200 && response.data.data) {
      if (response.data.data.accessToken && response.data.data.userId) {
        localStorage.setItem("access_token", response.data.data.accessToken);
        localStorage.setItem("user_id", response.data.data.userId);
      }
    }

    return response.data;
  }
};
