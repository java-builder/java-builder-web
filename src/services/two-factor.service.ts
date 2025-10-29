import { apiClient } from '@/lib/axios';
import {
    EnableTwoFactorRequest,
    TwoFactorSetupResponse,
    ApiResponse
} from '@/types/two-factor';

export const twoFactorApi = {
    async activate(): Promise<ApiResponse<TwoFactorSetupResponse>> {
        const response = await apiClient.post('/api/v1/two-factor/activate');
        return {
            ...response.data,
            result: {
                qrCodeData: response.data.result
            }
        };
    },

    async verifyCodeSetup(request: EnableTwoFactorRequest): Promise<ApiResponse<void>> {
        const response = await apiClient.post('/api/v1/two-factor/verify-code-setup', request);
        return response.data;
    },

    async disable(): Promise<ApiResponse<void>> {
        const response = await apiClient.put('/api/v1/two-factor/disable');
        return response.data;
    }
};
