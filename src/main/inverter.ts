import axios from "axios";
import { SettingsPayload } from "./types";

export const getSolarOutput = async (settings: SettingsPayload) => {
  if (settings?.inverter !== "omnik") {
    return { peak: 0, current: 0 };
  }
  if (!settings?.inverterIp) {
    return { peak: 0, current: 0 };
  }
  const result = await axios.get(`http://${settings.inverterIp}/js/status.js`);
  const text = result.data;

  const regex = /webData="([^"]+)"/;
  const matches = text.match(regex);
  const values = matches[1].split(",");
  return {
    peak: values[4],
    current: values[5],
  };
};
