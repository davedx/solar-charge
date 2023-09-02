import log from "electron-log";
import { readTokens } from "./storage";
import {
  chargeSetAmps,
  chargeStart,
  chargeStop,
  getVehicleList,
  getVehicleState,
  wakeVehicle,
} from "./teslaApi";

const HOME_MIN_WATTS = 0; //250;

// HARDCODE: Tesla
const VEHICLE_MIN_AMPS = 5;
const VEHICLE_MAX_AMPS = 16;

const VEHICLE_MAX_BATTERY_SOC = 90;

// HARDCODE: Netherlands
const MAINS_VOLTAGE = 230;

export const updateChargeStatus = async (currentPvWatts: number) => {
  const tokens = await readTokens();
  if (!tokens || !tokens.access_token) {
    log.info("No tokens, first authenticate");
    return;
  }

  const vehicles = await getVehicleList(
    tokens.access_token,
    tokens.refresh_token
  );
  //console.log("vehicles:", vehicles.response);
  if (vehicles.response.length < 1) {
    log.info("no vehicles found");
    return;
  }

  const firstVehicle = vehicles.response[0];
  const vehicleState = await getVehicleState(
    tokens.access_token,
    firstVehicle.id
  );
  const chargeState = vehicleState.response.charge_state;
  //log.info(chargeState);
  if (!chargeState) {
    log.info("could not read vehicle charge state");
    return;
  }
  const batterySoc = chargeState["battery_level"];
  let chargingState = chargeState["charging_state"];
  let chargingAmps = chargeState["charge_amps"];

  const availableSolarWatts = currentPvWatts - HOME_MIN_WATTS;
  const availableSolarAmps = Math.floor(availableSolarWatts / MAINS_VOLTAGE);
  const carAmps = Math.min(availableSolarAmps, VEHICLE_MAX_AMPS);

  log.info(
    `charging_state: ${chargingState} battery_soc: ${batterySoc}% charging_amps: ${chargingAmps} amps availableCarAmps: ${carAmps}`
  );

  if (carAmps >= VEHICLE_MIN_AMPS) {
    await wakeVehicle(tokens.access_token, firstVehicle.id);

    if (chargingState !== "Charging" && batterySoc < VEHICLE_MAX_BATTERY_SOC) {
      log.info(`Starting charge at ${carAmps} amps`);
      await chargeSetAmps(tokens.access_token, firstVehicle.id, carAmps);
      await chargeStart(tokens.access_token, firstVehicle.id);
      chargingState = "Charging";
      chargingAmps = carAmps;
    } else if (chargingState === "Charging" && carAmps > chargingAmps) {
      log.info(`Increasing charge to ${carAmps}`);
      await chargeSetAmps(tokens.access_token, firstVehicle.id, carAmps);
      chargingAmps = carAmps;
    } else if (chargingState === "Charging" && carAmps < chargingAmps) {
      log.info(`Decreasing charge to ${carAmps}`);
      await chargeSetAmps(tokens.access_token, firstVehicle.id, carAmps);
      chargingAmps = carAmps;
    }
  } else {
    await wakeVehicle(tokens.access_token, firstVehicle.id);

    if (chargingState === "Charging") {
      log.info(`Available current ${carAmps} amps too low, stopping charging`);
      await chargeStop(tokens.access_token, firstVehicle.id);
      chargingState = "Stopped";
      chargingAmps = 0;
    }
  }
  return {
    displayName: firstVehicle.display_name,
    chargingState,
    chargingAmps,
    batterySoc,
  };
};
