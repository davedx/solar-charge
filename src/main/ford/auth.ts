import { BrowserWindow } from "electron";
import axios from "axios";
import log from "electron-log";
import { writeTokens } from "../storage";
import {
  base64Urlencode,
  computeSHA256,
  generateRandomString,
} from "../util/pkce";
import {
  AUTH_BASE_URL,
  AUTH_TOKEN_PATH,
  AUTH_CLIENT_ID,
  AUTH_PATH,
  AUTH_REDIRECT_URI,
  DEFAULT_HEADERS,
  AUTH_OIDC_PATH,
  API_BASE_URL,
  AUTH_SCOPE,
} from "./config";
import { OAuthRequest } from "./types";
import { AuthApi } from "../apis";

// Ref: https://github.com/ianjwhite99/connected-car-node-sdk/blob/stable/src/Authentication/OAuth2Client.ts

const REGION = "1E8C7794-FF5F-49BC-9596-A1E0C86C5B19"; // TODO

const fetchAndStoreToken = async (data: OAuthRequest) => {
  const result1 = await axios.post(
    `${AUTH_BASE_URL}/${AUTH_OIDC_PATH}`,
    new URLSearchParams(data).toString(),
    {
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  if (result1.status !== 200 || !result1.data.access_token) {
    log.error(`Could not retrieve access token (step 1)`);
    return false;
  }
  const result2 = await axios.post(
    `${API_BASE_URL}/${AUTH_TOKEN_PATH}`,
    {
      ciToken: result1.data.access_token,
    },
    {
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
        "Application-Id": REGION,
      },
    }
  );
  if (!result2.data.access_token) {
    log.error(`Could not retrieve access token (step 2)`);
    return false;
  }
  const token = {
    access_token: result2.data.access_token,
    expires_in: result2.data.expires_in,
    refresh_token: result2.data.refresh_token,
    refresh_expires_in: result2.data.refresh_expires_in,
    ford_consumer_id: result2.data.ford_consumer_id,
  };
  writeTokens("ford", token);
  return true;
};

const buildAuthUrl = () => {
  const codeVerifier = generateRandomString();
  log.info("codeVerifier:" + codeVerifier);
  const unencodedDigest = computeSHA256(codeVerifier);
  const codeChallenge = base64Urlencode(unencodedDigest);
  return {
    url:
      `${AUTH_BASE_URL}/${AUTH_PATH}?client_id=${AUTH_CLIENT_ID}&redirect_uri=${AUTH_REDIRECT_URI}&response_type=code&scope=${AUTH_SCOPE}` +
      `&max_age=3600&code_challenge=${codeChallenge}&code_challenge_method=S256`,
    codeVerifier: codeVerifier,
  };
};

function findRegexMatch(regex: RegExp, html: string): string | undefined {
  const match = regex.exec(html);
  if (match) {
    return match[1];
  }
  return undefined;
}

export class FordAuth implements AuthApi {
  authorize = async (
    mainWindow: BrowserWindow,
    setResult: (res: boolean) => void
  ) => {
    // Ford Auth flow has extra step. First we fetch the SSO signin URL
    const { url, codeVerifier } = buildAuthUrl();
    log.info("getting login url from " + url);

    const result = await axios.get(url, { headers: DEFAULT_HEADERS });
    const browserSigninUrl =
      AUTH_BASE_URL +
      findRegexMatch(/data-ibm-login-url="(.*)" /gm, result.data);
    const setCookie = result.headers["set-cookie"];
    log.info("signin url:", browserSigninUrl);
    const cookies = setCookie.map((str) => {
      const parts = str.split(";");
      const cookie: Record<string, string | boolean> = {};
      parts.forEach((part, idx) => {
        let [key, value] = part.split("=");
        if (idx === 0) {
          cookie["name"] = key;
          cookie["value"] = value;
        }
      });
      return cookie;
    });

    let authWindow = new BrowserWindow({
      width: 600,
      height: 600,
      show: false,
      modal: true,
      parent: mainWindow,
      webPreferences: {
        nodeIntegration: false, // IMPORTANT! Do not enable node integration for security reasons.
      },
    });

    const session = authWindow.webContents.session;
    cookies.forEach((cookie) =>
      session.cookies.set({
        ...cookie,
        url: browserSigninUrl,
      })
    );

    log.info("codeVerifier:" + codeVerifier);
    if (!codeVerifier) {
      return;
    }
    log.info("browserSigninUrl:", browserSigninUrl);
    authWindow.loadURL(browserSigninUrl);
    authWindow.show();

    // Detect when the OAuth2 callback is called
    authWindow.webContents.on("will-redirect", async (event, url) => {
      log.info("event:", event);
      log.info("url:", url);
      let tokensAcquired = false;

      if (url.indexOf("userauthorized") !== -1) {
        const urlParts = url.split("?")[1];
        const params = new URLSearchParams(urlParts);
        const code = params.get("code");
        const grantId = params.get("grant_id");

        // const result = await fetchCodeAndGrantId(url, setCookie);

        const data: OAuthRequest = {
          client_id: AUTH_CLIENT_ID,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "fordapp://userauthorized",
          grant_id: grantId,
          code_verifier: codeVerifier,
        };

        tokensAcquired = await fetchAndStoreToken(data);
        authWindow.close();
        setResult(tokensAcquired);
      }
    });

    authWindow.on("closed", () => {
      authWindow = null;
    });
  };
}
