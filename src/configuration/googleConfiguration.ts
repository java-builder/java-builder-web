export const GOOGLE_CONFIG = {
  client_id:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "441587123979-qds882ebt12bna4t4pldj9ausd2udpu2.apps.googleusercontent.com",
  response_type: process.env.NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE || "code",
  scope: process.env.NEXT_PUBLIC_GOOGLE_SCOPE || "email profile openid",
  redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "http://localhost:3000/oauth2/callback/google",
};
