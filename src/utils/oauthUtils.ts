import { GOOGLE_CONFIG } from "@/configuration/googleConfiguration";
import { LINKEDIN_CONFIG } from "@/configuration/linkedinConfiguration";

export const generateGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.client_id,
    response_type: GOOGLE_CONFIG.response_type,
    scope: GOOGLE_CONFIG.scope,
    redirect_uri: GOOGLE_CONFIG.redirect_uri,
    state: "google",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const generateLinkedinAuthUrl = (): string => {
  const params = new URLSearchParams({
    response_type: LINKEDIN_CONFIG.response_type,
    client_id: LINKEDIN_CONFIG.client_id,
    redirect_uri: LINKEDIN_CONFIG.redirect_uri,
    scope: LINKEDIN_CONFIG.scope,
    state: "linkedin",
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
};
