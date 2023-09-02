import { app } from "electron";
import path from "path";
import fs from "fs";

const TOKENS_PATH = path.join(app.getPath("userData"), "tokens.json");
const SETTINGS_PATH = path.join(app.getPath("userData"), "settings.json");

export const readTokens = async () => {
  try {
    const data = fs.readFileSync(TOKENS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error retrieving user data", error);
    // you may want to propagate the error, up to you
    return null;
  }
};

export const writeTokens = async (data: any) => {
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(data));
};

export const readSettings = async () => {
  try {
    const data = fs.readFileSync(SETTINGS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error retrieving user data", error);
    // you may want to propagate the error, up to you
    return null;
  }
};

export const writeSettings = async (data: any) => {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data));
};
