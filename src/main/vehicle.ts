import log from "electron-log";
import { VehicleApi } from "./apis";

const HOME_MIN_WATTS = 250;

// HARDCODE: Tesla
const VEHICLE_MIN_AMPS = 5;
const VEHICLE_MAX_AMPS = 16;

const VEHICLE_MAX_BATTERY_SOC = 90;

// HARDCODE: Netherlands
const MAINS_VOLTAGE = 230;

export const updateChargeStatus = async (
  vehicle: VehicleApi,
  currentPvWatts: number
) => {
  log.info("updating charge status for " + vehicle.type);

  // const tokens = await readTokens(tokenId);
  // if (!tokens || !tokens.access_token) {
  //   log.info("No tokens, will not update charge status");
  //   return;
  // }

  const vehicles = await vehicle.getVehicleList();

  if (vehicles.length < 1) {
    log.info("no vehicles found");
    return;
  }

  const firstVehicle = vehicles[0];
  const vehicleState = await vehicle.getVehicleState(firstVehicle.id);
  const chargeState = vehicleState.charge_state;
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
    await vehicle.wakeVehicle(firstVehicle.id);

    if (chargingState !== "Charging" && batterySoc < VEHICLE_MAX_BATTERY_SOC) {
      log.info(`Starting charge at ${carAmps} amps`);
      await vehicle.chargeSetAmps(firstVehicle.id, carAmps);
      await vehicle.chargeStart(firstVehicle.id);
      chargingState = "Charging";
      chargingAmps = carAmps;
    } else if (chargingState === "Charging" && carAmps > chargingAmps) {
      log.info(`Increasing charge to ${carAmps}`);
      await vehicle.chargeSetAmps(firstVehicle.id, carAmps);
      chargingAmps = carAmps;
    } else if (chargingState === "Charging" && carAmps < chargingAmps) {
      log.info(`Decreasing charge to ${carAmps}`);
      await vehicle.chargeSetAmps(firstVehicle.id, carAmps);
      chargingAmps = carAmps;
    }
  } else {
    await vehicle.wakeVehicle(firstVehicle.id);

    if (chargingState === "Charging") {
      log.info(`Available current ${carAmps} amps too low, stopping charging`);
      await vehicle.chargeStop(firstVehicle.id);
      chargingState = "Stopped";
      chargingAmps = 0;
    }
  }
  return {
    displayName: firstVehicle.name,
    chargingState,
    chargingAmps,
    batterySoc,
  };
};
