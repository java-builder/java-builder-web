import { CreatePasskeyRequest, RegistrationOptionsResponse, AuthenticationOptionsResponse, LoginPasskeyRequest } from "@/types/passkey";
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

export async function registerPasskeyCredential(
  options: RegistrationOptionsResponse
): Promise<CreatePasskeyRequest> {
  const registrationResponse = await startRegistration({
    optionsJSON: options as unknown as Parameters<typeof startRegistration>[0]['optionsJSON']
  });

  return {
    registrationResponseJson: JSON.stringify(registrationResponse),
    label: `Device ${new Date().toLocaleDateString('vi-VN')}`,
    transports: registrationResponse.response.transports || [],
  };
}

export async function authenticatePasskey(
  options: AuthenticationOptionsResponse
): Promise<LoginPasskeyRequest> {
  const assertion = await startAuthentication({
    optionsJSON: options as unknown as Parameters<typeof startAuthentication>[0]['optionsJSON']
  });

  return {
    credential: JSON.stringify(assertion),
  };
}
