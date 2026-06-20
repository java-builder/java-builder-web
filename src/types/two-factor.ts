export interface EnableTwoFactorRequest {
  code: string;
}

export interface TwoFactorSetupResponse {
  qrCodeData: string;
  secret?: string;
}
