import { readTokens } from "./storage";
import log from "electron-log";
import { TeslaApi } from "./tesla/api";
import { FordApi } from "./ford/api";
import { BrowserWindow } from "electron";
import { TeslaAuth } from "./tesla/auth";
import { FordAuth } from "./ford/auth";

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type Vehicle = {
  id: string;
  vehicle_id: string;
  name: string;
};

export type VehicleState = {
  charge_state: {
    battery_level: number;
    charging_state: string;
    charge_amps: number;
  };
};

type AuthCallback = (res: boolean) => void;

export interface AuthApi {
  authorize(mainWindow: BrowserWindow, authCallback: AuthCallback): void;
}

export interface VehicleApi {
  type: string;
  getVehicleList(): Promise<Vehicle[]>;
  getVehicleState(vehicleId: string): Promise<VehicleState>;
  wakeVehicle(vehicleId: string): Promise<boolean>;
  chargeSetAmps(vehicleId: string, amps: number): Promise<boolean>;
  chargeStart(vehicleId: string): Promise<boolean>;
  chargeStop(vehicleId: string): Promise<boolean>;
}

export const createAuth = (type: string): AuthApi => {
  switch (type) {
    case "tesla":
      return new TeslaAuth();
    case "ford":
      return new FordAuth();
    default:
      log.warn(`unsupported auth api: ${type}`);
      return;
  }
};

export const createVehicle = async (type: string): Promise<VehicleApi> => {
  log.info("creating vehicle: " + type);
  const tokens = await readTokens(type);
  if (!tokens || !tokens.access_token) {
    log.info("No tokens, will not update charge status");
    return;
  }
  switch (type) {
    case "tesla":
      return new TeslaApi(tokens);
    case "ford":
      return new FordApi(tokens);
    default:
      log.warn(`unsupported vehicle api: ${type}`);
      return;
  }
};
