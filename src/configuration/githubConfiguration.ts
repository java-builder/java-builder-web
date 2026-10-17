export const GITHUB_CONFIG = {
  client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "Ov23liPl4EJnuiio5JNY",
  redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || "http://localhost:3000/oauth2/callback/github",
  scope: process.env.NEXT_PUBLIC_GITHUB_SCOPE || "read:user user:email",
};
