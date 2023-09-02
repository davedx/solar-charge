import axios from "axios";
import { refreshAccessToken } from "./teslaAuth";
import log from "electron-log";

const API_BASE_URL = "https://owner-api.teslamotors.com";

const HEADERS = {
  Accept: "application/json",
  "X-Tesla-User-Agent": "TeslaApp/4.10.0",
  "User-Agent": "teslapy/2.8.0",
};

const makeHeaders = (accessToken: string) => ({
  ...HEADERS,
  Authorization: `Bearer ${accessToken}`,
});

export const getVehicleList = async (
  accessToken: string,
  refreshToken: string
) => {
  let result;
  try {
    result = await axios.get(`${API_BASE_URL}/api/1/vehicles`, {
      headers: makeHeaders(accessToken),
    });
  } catch (e) {
    const newAccessToken = await refreshAccessToken(refreshToken);
    log.info("refreshed access token, retrying");
    result = await axios.get(`${API_BASE_URL}/api/1/vehicles`, {
      headers: makeHeaders(newAccessToken),
    });
  }
  return result.data;
};

export const getVehicleState = async (
  accessToken: string,
  vehicleId: number
) => {
  try {
    const result = await axios.get(
      `${API_BASE_URL}/api/1/vehicles/${vehicleId}/vehicle_data`,
      {
        headers: makeHeaders(accessToken),
      }
    );
    return result.data;
  } catch (e) {
    log.info(e);
  }
};

export const wakeVehicle = async (accessToken: string, vehicleId: number) => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/1/vehicles/${vehicleId}/wake_up`,
      null,
      {
        headers: makeHeaders(accessToken),
      }
    );
    return result.data;
  } catch (e) {
    log.info(e);
  }
};

export const chargeStart = async (accessToken: string, vehicleId: number) => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/1/vehicles/${vehicleId}/command/charge_start`,
      null,
      {
        headers: makeHeaders(accessToken),
      }
    );
    return result.data;
  } catch (e) {
    log.info(e);
  }
};

export const chargeStop = async (accessToken: string, vehicleId: number) => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/1/vehicles/${vehicleId}/command/charge_stop`,
      null,
      {
        headers: makeHeaders(accessToken),
      }
    );
    return result.data;
  } catch (e) {
    log.info(e);
  }
};

export const chargeSetAmps = async (
  accessToken: string,
  vehicleId: number,
  current: number
) => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/1/vehicles/${vehicleId}/command/set_charging_amps`,
      {
        charging_amps: current,
      },
      {
        headers: makeHeaders(accessToken),
      }
    );
    return result.data;
  } catch (e) {
    log.info(e);
  }
};
