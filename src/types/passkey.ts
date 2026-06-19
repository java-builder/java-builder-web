export interface RegistrationOptionsResponse {
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  challenge: string;
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number;
  }>;
  timeout: number;
  authenticatorSelection?: {
    residentKey?: 'discouraged' | 'preferred' | 'required';
    userVerification?: 'discouraged' | 'preferred' | 'required';
    authenticatorAttachment?: 'platform' | 'cross-platform';
  };
  attestation?: 'none' | 'indirect' | 'direct' | 'enterprise';
  extensions?: {
    credProps?: boolean;
  };
}

export interface CreatePasskeyRequest {
  registrationResponseJson: string;
  label: string;
  transports?: string[];
}

export interface AuthenticationOptionsResponse {
  challenge: string;
  rpId?: string;
  allowCredentials?: Array<{
    id: string;
    type: string;
    transports?: string[];
  }>;
  userVerification?: 'discouraged' | 'preferred' | 'required';
}

export interface LoginPasskeyOptionRequest {
  email?: string | null;
}

export interface LoginPasskeyRequest {
  credential: string;
}