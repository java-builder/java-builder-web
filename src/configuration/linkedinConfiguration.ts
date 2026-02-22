export const LINKEDIN_CONFIG = {
  client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID ||"864ebvh1x94nt9",
  response_type: process.env.NEXT_PUBLIC_LINKEDIN_RESPONSE_TYPE || "code",
  scope: process.env.NEXT_PUBLIC_LINKEDIN_SCOPE || "openid profile email",
  redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || "http://localhost:3000/oauth2/callback/linkedin",
};