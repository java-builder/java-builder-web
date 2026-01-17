import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import {
  EnableTwoFactorRequest,
  TwoFactorSetupResponse,
} from "@/types/two-factor";
import { API } from "@/api/api";


export const twoFactorApi = {
  async activate(): Promise<ApiResponse<TwoFactorSetupResponse>> {
    const response = await apiClient.post(API.TWO_FACTOR_ACTIVATE);
    return {
      ...response.data,
      result: {
        qrCodeData: response.data.result,
      },
    };
  },

  async verifyCodeSetup(
    request: EnableTwoFactorRequest,
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post(
      API.TWO_FACTOR_VERIFY_SETUP,
      request,
    );
    return response.data;
  },

  async disable(): Promise<ApiResponse<void>> {
    const response = await apiClient.put(API.TWO_FACTOR_DISABLE);
    return response.data;
  },
};
