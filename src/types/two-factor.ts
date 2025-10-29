export interface EnableTwoFactorRequest {
    code: string;
}

export interface TwoFactorSetupResponse {
    qrCodeData: string; // Base64 data URL từ backend
}


export interface ApiResponse<T> {
    code: number;
    message: string;
    result?: T;
}
