import { app } from "electron";
import path from "path";
import fs from "fs";

const SETTINGS_PATH = path.join(app.getPath("userData"), "settings.json");

const getTokensPath = (device: string) => {
  return path.join(app.getPath("userData"), `${device}_tokens.json`);
};

export const readTokens = async (device: string) => {
  try {
    const data = fs.readFileSync(getTokensPath(device), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

export const writeTokens = async (device: string, data: any) => {
  fs.writeFileSync(getTokensPath(device), JSON.stringify(data));
};

type Settings = {
  inverter: string;
  inverterIp: string;
  vehicle: "tesla" | "ford";
  homeMinWatts: string;
};

export const readSettings = (): Settings => {
  try {
    const data = fs.readFileSync(SETTINGS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

export const writeSettings = (data: any) => {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data));
};
