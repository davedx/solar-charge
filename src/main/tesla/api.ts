import axios from "axios";
import { refreshAccessToken } from "./auth";
import log from "electron-log";
import { Tokens, Vehicle, VehicleApi, VehicleState } from "../apis";

import { API_BASE_URL, DEFAULT_HEADERS } from "./config";
import { writeTokens } from "../storage";

const makeHeaders = (accessToken: string) => ({
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${accessToken}`,
});

export class TeslaApi implements VehicleApi {
  tokens: Tokens;
  type: string;

  constructor(tokens: Tokens) {
    this.tokens = tokens;
  }
  getVehicleList = async (): Promise<Vehicle[]> => {
    let result;
    try {
      result = await axios.get(`${API_BASE_URL}/api/1/vehicles`, {
        headers: makeHeaders(this.tokens.access_token),
      });
    } catch (e) {
      this.tokens.access_token = await refreshAccessToken(
        this.tokens.refresh_token
      );
      log.info("refreshed access token, retrying");
      result = await axios.get(`${API_BASE_URL}/api/1/vehicles`, {
        headers: makeHeaders(this.tokens.access_token),
      });
      writeTokens(this.type, this.tokens);
    }
    log.info("vl:", result.data);
    return result.data.response.map((v: any) => ({
      ...v,
      id: String(v.id),
      name: v.display_name,
    }));
  };

  getVehicleState = async (vehicleId: string): Promise<VehicleState> => {
    try {
      const result = await axios.get(
        `${API_BASE_URL}/api/1/vehicles/${vehicleId}/vehicle_data`,
        {
          headers: makeHeaders(this.tokens.access_token),
        }
      );
      return result.data.response;
    } catch (e) {
      log.info(e);
    }
  };

  wakeVehicle = async (vehicleId: string) => {
    try {
      const result = await axios.post(
        `${API_BASE_URL}/api/1/vehicles/${vehicleId}/wake_up`,
        null,
        {
          headers: makeHeaders(this.tokens.access_token),
        }
      );
      return result.data;
    } catch (e) {
      log.info(e);
    }
  };

  chargeStart = async (vehicleId: string) => {
    try {
      const result = await axios.post(
        `${API_BASE_URL}/api/1/vehicles/${vehicleId}/command/charge_start`,
        null,
        {
          headers: makeHeaders(this.tokens.access_token),
        }
      );
      return result.data;
    } catch (e) {
      log.info(e);
    }
  };

  chargeStop = async (vehicleId: string) => {
    try {
      const result = await axios.post(
        `${API_BASE_URL}/api/1/vehicles/${vehicleId}/command/charge_stop`,
        null,
        {
          headers: makeHeaders(this.tokens.access_token),
        }
      );
      return result.data;
    } catch (e) {
      log.info(e);
    }
  };

  chargeSetAmps = async (vehicleId: string, amps: number) => {
    try {
      const result = await axios.post(
        `${API_BASE_URL}/api/1/vehicles/${vehicleId}/command/set_charging_amps`,
        {
          charging_amps: amps,
        },
        {
          headers: makeHeaders(this.tokens.access_token),
        }
      );
      return result.data;
    } catch (e) {
      log.info(e);
    }
  };
}
