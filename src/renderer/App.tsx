import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Settings } from "./Settings";
import { Dashboard } from "./Dashboard";
import { TopNav } from "./components/TopNav";
import { Background } from "./components/Background";

const App = () => {
  const [route, setRoute] = useState("dashboard");
  const [inverter, setInverter] = useState("omnik");
  const [inverterIp, setInverterIp] = useState("");
  const [vehicle, setVehicle] = useState("tesla_m3");
  const [homeMinWatts, setHomeMinWatts] = useState("250");
  const [ipHosts, setIpHosts] = useState([]);

  useEffect(() => {
    (window as any).electronAPI.handleApp((_event: any, value: any) => {
      if (value?.settings) {
        setInverter(value.settings.inverter);
        setInverterIp(value.settings.inverterIp);
        setVehicle(value.settings.vehicle);
        setHomeMinWatts(value.settings.homeMinWatts);
      }
      if (value?.ipHosts) {
        setIpHosts(value.ipHosts);
      }
      if (value?.setRoute === "dashboard") {
        setRoute("dashboard");
      } else if (value?.setRoute === "settings") {
        setRoute("settings");
      }
    });
    (window as any).electronAPI.loadSettings();
  }, []);

  return (
    <>
      <Background />
      <TopNav route={route} setRoute={setRoute} />
      {route === "settings" && (
        <Settings
          inverter={inverter}
          setInverter={setInverter}
          inverterIp={inverterIp}
          setInverterIp={setInverterIp}
          vehicle={vehicle}
          setVehicle={setVehicle}
          homeMinWatts={homeMinWatts}
          setHomeMinWatts={setHomeMinWatts}
          ipHosts={ipHosts}
        />
      )}
      {route === "dashboard" && <Dashboard />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
