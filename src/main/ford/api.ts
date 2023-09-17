import axios from "axios";
import log from "electron-log";
import { Tokens, Vehicle, VehicleApi, VehicleState } from "../apis";

import {
  API_APPLICATION_ID,
  API_BASE_URL,
  API_REFRESH_ACCESS_PATH,
  DEFAULT_API_HEADERS,
  DEFAULT_HEADERS,
} from "./config";
import { writeTokens } from "../storage";

const makeHeaders = (accessToken: string) => ({
  ...DEFAULT_API_HEADERS,
  "Auth-Token": `${accessToken}`,
  Authorization: `Bearer ${accessToken}`,
});

export class FordApi implements VehicleApi {
  tokens: Tokens;
  type: string;

  constructor(tokens: Tokens) {
    this.type = "ford";
    this.tokens = tokens;
  }

  refreshAccessToken = async () => {
    log.info("refreshing access token");
    try {
      const result = await axios.post(
        `${API_BASE_URL}/${API_REFRESH_ACCESS_PATH}`,
        {
          refresh_token: this.tokens.refresh_token,
        },
        {
          headers: {
            ...DEFAULT_HEADERS,
            "Content-Type": "application/json",
            "Application-Id": API_APPLICATION_ID,
          },
        }
      );
      const token = {
        access_token: result.data.access_token,
        expires_in: result.data.expires_in,
        refresh_token: result.data.refresh_token,
        refresh_expires_in: result.data.refresh_expires_in,
        ford_consumer_id: result.data.ford_consumer_id,
      };
      log.info("refresh result:", result.data);
      writeTokens("ford", token);
      this.tokens = {
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
      };
    } catch (e) {
      log.error("failed to refresh Ford access token");
    }
  };

  getVehicleList = async (): Promise<Vehicle[]> => {
    let result;
    try {
      result = await axios.post(
        `${API_BASE_URL}/api/expdashboard/v1/details`,
        {
          dashboardRefreshRequest: "All",
        },
        {
          headers: makeHeaders(this.tokens.access_token),
        }
      );
    } catch (e) {
      log.info("error, trying to refresh token");
      await this.refreshAccessToken();
      result = await axios.post(
        `${API_BASE_URL}/api/expdashboard/v1/details`,
        {
          dashboardRefreshRequest: "All",
        },
        {
          headers: makeHeaders(this.tokens.access_token),
        }
      );
    }
    log.info("vl:", result.data.userVehicles.vehicleDetails);
    return result.data.userVehicles.vehicleDetails.map((v: any) => ({
      ...v,
      id: String(v.VIN),
      name: v.nickName,
    }));
  };

  getVehicleState = async (vehicleId: string): Promise<VehicleState> => {
    try {
      const result = await axios.get(
        `https://usapi.cv.ford.com/api/vehicles/v5/${vehicleId}/status`,
        {
          headers: makeHeaders(this.tokens.access_token),
        }
      );
      return {
        charge_state: {
          battery_level: result.data.vehiclestatus.batteryFillLevel.value,
          charging_state: result.data.vehiclestatus.chargingStatus.value,
          charge_amps: 8,
        },
      };
    } catch (e) {
      log.info(e);
    }
  };

  wakeVehicle = async (vehicleId: string) => {
    log.warn("Ford wake vehicle not implemented");
    return true;
  };

  chargeStart = async (vehicleId: string) => {
    try {
      // POST "/v1/vehicles/{vin}/global-charge-command/{command}"
      // POST "/api/cevs/v1/GlobalCharge" {}
      const result = await axios.post(
        // From APK:
        ///api/cevs/v1/GlobalCharge
        //v1/vehicles/{vin}/global-charge-command/{command}

        // start, startCharge, 0, charge, go, start-charge, chargeStart, global-start,
        `https://usapi.cv.ford.com/api/v1/vehicles/${vehicleId}/global-charge-command/globalStart`,

        // TRIED
        //`https://usapi.cv.ford.com/api/cevs/v1/GlobalCharge`,
        // `https://usapi.cv.ford.com/api/v1/vehicles/${vehicleId}/global-charge-command/start`,
        //`https://usapi.cv.ford.com/api/vehicles/v5/${vehicleId}/global-charge-command/start`,
        // `${API_BASE_URL}/api/vehicles/v5/${vehicleId}/startCharge`,
        {
          headers: {
            ...makeHeaders(this.tokens.access_token),
          },
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
        `${API_BASE_URL}/api/vehicles/v5/${vehicleId}/stopCharge`,
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
    log.warn("Ford wake vehicle not implemented");
    return true;
  };
}
