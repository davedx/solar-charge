import { BrowserWindow } from "electron";
import crypto from "crypto";
import axios from "axios";
import log from "electron-log";
import { writeUserData } from "./storage";

const authBaseUrl = "https://auth.tesla.com";
const authPath = "oauth2/v3/authorize";
const tokenPath = "oauth2/v3/token";
const clientId = "ownerapi";
const redirectUri = "https://auth.tesla.com/void/callback";
const scope = "openid+email+offline_access";

function generateRandomString() {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let randomString = "";
  for (let i = 0; i < 43; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }

  return randomString;
}

function base64_urlencode(data: Buffer) {
  return data
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function computeSHA256(text: string) {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest();
}

const fetchAndStoreToken = async (code: string, codeVerifier: string) => {
  const url = `${authBaseUrl}/${tokenPath}`;
  const payload = `grant_type=authorization_code&client_id=${clientId}&code_verifier=${codeVerifier}&code=${code}&redirect_uri=https%3A%2F%2Fauth.tesla.com%2Fvoid%2Fcallback`;
  try {
    const result = await axios.post(url, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "X-Tesla-User-Agent": "TeslaApp/4.10.0",
        "User-Agent": "teslapy/2.8.0",
      },
    });
    log.info("result:", result.data);
    writeUserData({
      access_token: result.data.access_token,
      refresh_token: result.data.refresh_token,
    });
  } catch (e) {
    log.error(e.message);
  }
};

const buildAuthUrl = () => {
  const codeVerifier = generateRandomString();
  log.info("codeVerifier:" + codeVerifier);
  const unencodedDigest = computeSHA256(codeVerifier);
  const codeChallenge = base64_urlencode(unencodedDigest);
  const state = generateRandomString();
  return {
    url:
      `${authBaseUrl}/${authPath}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}` +
      `&code_challenge=${codeChallenge}&code_challenge_method=S256`,
    codeVerifier: codeVerifier,
  };
};

export const authenticate = (mainWindow: BrowserWindow) => {
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

    if (parsedUrl.origin === new URL(redirectUri).origin) {
      // Extract the authorization code from the callback URL
      const code = parsedUrl.searchParams.get("code");

      if (code) {
        fetchAndStoreToken(code, codeVerifier);

        // Close the auth window
        authWindow.close();
      } else {
        // Handle errors, e.g., user denied access, etc.
        // ...
      }
    }
  });

  authWindow.on("closed", () => {
    authWindow = null;
  });
};
