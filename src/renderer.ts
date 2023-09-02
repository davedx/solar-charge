import "./renderer/App";
import "./renderer/index.css";

console.log("renderer");

document.getElementById("auth")?.addEventListener("click", () => {
  (window as any).electronAPI.setTitle("dave");
});

(window as any).electronAPI.handlePv((event: any, value: any) => {
  document.getElementById("pv_current").innerHTML = value.current;
  document.getElementById("pv_peak").innerHTML = value.peak;
});

(window as any).electronAPI.handleVehicle((event: any, value: any) => {
  document.getElementById("charging_state").innerHTML = value.chargingState;
  document.getElementById(
    "charging_details"
  ).innerHTML = `${value.chargingAmps}A (${value.batterySoc}%)`;
  document.getElementById("display_name").innerHTML = value.displayName;
});
