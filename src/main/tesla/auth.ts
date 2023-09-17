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
  AUTH_PATH,
  AUTH_TOKEN_PATH,
  AUTH_CLIENT_ID,
  AUTH_REDIRECT_URI,
  AUTH_SCOPE,
} from "./config";
import { AuthApi } from "../apis";

export const refreshAccessToken = async (refreshToken: string) => {
  const url = `${AUTH_BASE_URL}/${AUTH_TOKEN_PATH}`;
  const payload = `grant_type=refresh_token&client_id=${AUTH_CLIENT_ID}&refresh_token=${refreshToken}&scope=${AUTH_SCOPE}`;
  const result = await axios.post(url, payload, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "X-Tesla-User-Agent": "TeslaApp/4.10.0",
      "User-Agent": "teslapy/2.8.0",
    },
  });
  log.info("refresh token result:", result.data);
  writeTokens("tesla", {
    access_token: result.data.access_token,
    refresh_token: result.data.refresh_token,
  });
  return result.data.access_token;
};

const fetchAndStoreToken = async (
  code: string,
  codeVerifier: string
): Promise<boolean> => {
  const url = `${AUTH_BASE_URL}/${AUTH_TOKEN_PATH}`;
  const payload = `grant_type=authorization_code&client_id=${AUTH_CLIENT_ID}&code_verifier=${codeVerifier}&code=${code}&redirect_uri=https%3A%2F%2Fauth.tesla.com%2Fvoid%2Fcallback`;
  try {
    log.info(`Trying to get token with ${code} at ${url}`);
    const result = await axios.post(url, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "X-Tesla-User-Agent": "TeslaApp/4.10.0",
        "User-Agent": "teslapy/2.8.0",
      },
    });
    log.info("got token successfully");
    writeTokens("tesla", {
      access_token: result.data.access_token,
      refresh_token: result.data.refresh_token,
    });
    return true;
  } catch (e) {
    log.error(e.message);
    return false;
  }
};

const buildAuthUrl = () => {
  const codeVerifier = generateRandomString();
  log.info("codeVerifier:" + codeVerifier);
  const unencodedDigest = computeSHA256(codeVerifier);
  const codeChallenge = base64Urlencode(unencodedDigest);
  const state = generateRandomString();
  return {
    url:
      `${AUTH_BASE_URL}/${AUTH_PATH}?client_id=${AUTH_CLIENT_ID}&redirect_uri=${AUTH_REDIRECT_URI}&response_type=code&scope=${AUTH_SCOPE}&state=${state}` +
      `&code_challenge=${codeChallenge}&code_challenge_method=S256`,
    codeVerifier: codeVerifier,
  };
};

export class TeslaAuth implements AuthApi {
  authorize = (
    mainWindow: BrowserWindow,
    setResult: (res: boolean) => void
  ) => {
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
    session.clearStorageData();

    const { url, codeVerifier } = buildAuthUrl();
    log.info("codeVerifier:" + codeVerifier);
    if (!codeVerifier) {
      return;
    }
    log.info("url:", url);
    authWindow.loadURL(url);
    authWindow.show();

    // Detect when the OAuth2 callback is called
    authWindow.webContents.on("will-redirect", async (event, url) => {
      const parsedUrl = new URL(url);

      console.log("parsedUrl:", parsedUrl);
      let tokensAcquired = false;

      if (parsedUrl.origin === new URL(AUTH_REDIRECT_URI).origin) {
        // Extract the authorization code from the callback URL
        const code = parsedUrl.searchParams.get("code");

        if (code) {
          tokensAcquired = await fetchAndStoreToken(code, codeVerifier);
        }
        authWindow.close();
      }
      setResult(tokensAcquired);
    });

    authWindow.on("closed", () => {
      authWindow = null;
    });
  };
}
