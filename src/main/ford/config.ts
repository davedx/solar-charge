export const AUTH_BASE_URL = "https://sso.ci.ford.com";
export const AUTH_PATH = "v1.0/endpoint/default/authorize";
export const AUTH_OIDC_PATH = "oidc/endpoint/default/token";
export const AUTH_TOKEN_PATH = "api/token/v2/cat-with-ci-access-token";
export const AUTH_CLIENT_ID = "9fb503e0-715b-47e8-adfd-ad4b7770f73b";
export const AUTH_REDIRECT_URI = "fordapp://userauthorized";
export const AUTH_SCOPE = "openid";

export const API_APPLICATION_ID = "1E8C7794-FF5F-49BC-9596-A1E0C86C5B19";
export const API_BASE_URL = "https://api.mps.ford.com";
export const API_REFRESH_ACCESS_PATH = "api/token/v2/cat-with-refresh-token";

export const DEFAULT_HEADERS = {
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent": "FordPass/1 CFNetwork/1410.0.3 Darwin/22.6.0",
  "Accept-Encoding": "gzip, deflate, br",
};

export const DEFAULT_API_HEADERS = {
  Accept: "*/*",
  "Content-Type": "application/json",
  locale: "nl-NL",
  CountryCode: "NLD",
  "User-Agent": "FordPass/5 CFNetwork/1333.0.4 Darwin/21.5.0",
  "Application-Id": API_APPLICATION_ID,
};
