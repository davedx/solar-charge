export const AUTH_BASE_URL = "https://auth.tesla.com";
export const AUTH_PATH = "oauth2/v3/authorize";
export const AUTH_TOKEN_PATH = "oauth2/v3/token";
export const AUTH_CLIENT_ID = "ownerapi";
export const AUTH_REDIRECT_URI = "https://auth.tesla.com/void/callback";
export const AUTH_SCOPE = "openid+email+offline_access";

export const API_BASE_URL = "https://owner-api.teslamotors.com";

export const DEFAULT_HEADERS = {
  Accept: "application/json",
  "X-Tesla-User-Agent": "TeslaApp/4.10.0",
  "User-Agent": "teslapy/2.8.0",
};
