import { app } from "electron";
import path from "path";
import fs from "fs";

const USER_DATA_PATH = path.join(app.getPath("userData"), "charge_solar.json");

export function readUserData() {
  try {
    const data = fs.readFileSync(USER_DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error retrieving user data", error);
    // you may want to propagate the error, up to you
    return null;
  }
}

export function writeUserData(data: any) {
  fs.writeFileSync(USER_DATA_PATH, JSON.stringify(data));
}
