import { useState } from "react";
import { Modal } from "./components/Modal";
import { findInverters } from "./findInverters";

type Props = {
  inverter: string;
  setInverter: (v: string) => void;
  inverterIp: string;
  setInverterIp: (v: string) => void;
  vehicle: string;
  setVehicle: (v: string) => void;
  homeMinWatts: string;
  setHomeMinWatts: (v: string) => void;
  ipHosts: any[];
};

const mapInverters = (results: any[]) => {
  return results.map((r) => {
    const ip = r.match?.split(":")[0];
    return {
      label: `Type: ${r.id.toUpperCase()}`,
      ip: ip,
    };
  });
};

export const Settings = ({
  inverter,
  setInverter,
  inverterIp,
  setInverterIp,
  vehicle,
  setVehicle,
  homeMinWatts,
  setHomeMinWatts,
  ipHosts,
}: Props) => {
  const [netModal, setNetModal] = useState(false);

  const sendFindInverters = () => {
    (window as any).electronAPI.findInverters();
  };

  const showNetworkHosts = () => {
    setNetModal(true);
  };

  return (
    <>
      <Modal
        open={netModal}
        setOpen={setNetModal}
        children={
          <div>
            {ipHosts.length === 0 ? (
              <div>Searching network for known inverters...</div>
            ) : (
              <>
                <p className="text-sm mb-3">
                  Click on the IP address to select an inverter
                </p>
                {mapInverters(findInverters(ipHosts)).map((result) => {
                  return (
                    <div className="flex justify-between">
                      <div className="p-1">{result.label}</div>
                      <button
                        onClick={() => {
                          setInverterIp(result.ip);
                          setNetModal(false);
                        }}
                        className="text-sm p-1 border-2 border-gray-300 bg-gray-200"
                      >
                        {result.ip}
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        }
      />
      <div className="isolate  px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Solar Charger
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Let's setup Solar Charger for your home.
          </p>
        </div>
        <form
          className="mx-auto mt-8 max-w-xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="inverter"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Solar inverter
                </label>
                <div className="mt-2.5">
                  <select
                    id="inverter"
                    onChange={(e) => setInverter(e.target.value)}
                    value={inverter}
                    className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="omnik">Omnik</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="inverter_ip"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  <span>IP address on my network </span>
                  <a
                    className="text-orange-700 ml-4"
                    target="_blank"
                    href="https://github.com/davedx/solar-charge/wiki/Finding-your-inverter-IP-address"
                  >
                    Help!
                  </a>
                </label>
                <div className="mt-2.5 relative">
                  <input
                    onChange={(e) => setInverterIp(e.target.value)}
                    value={inverterIp}
                    placeholder="192.168.1.25"
                    className="block absolute w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    onClick={() => {
                      sendFindInverters();
                      showNetworkHosts();
                    }}
                    className="absolute right-1 top-1 text-sm p-1 border-2 border-gray-300 bg-gray-200"
                  >
                    Find inverters
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="ev"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Electric Vehicle
              </label>
              <div className="mt-2.5">
                <select
                  id="ev"
                  onChange={(e) => setVehicle(e.target.value)}
                  value={vehicle}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="tesla">Tesla</option>
                  <option value="ford">Ford</option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="minwatts"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Minimum watts available for home
              </label>
              {/*
            <div className="mt-2.5">
              <input
                type="number"
                id="minwatts"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={homeMinWatts}
                onChange={(e) => setHomeMinWatts(e.target.value)}
              />
            </div>
            */}
              <p className="mt-2 text-sm text-gray-500">
                Your electric vehicle will only be charged when there is
                sufficient solar output, keeping available a buffer of{" "}
                {homeMinWatts} W for the usage of other appliances in your home.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="rounded-md bg-yellow-50 p-4 mb-5">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Please read carefully
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      The next step will be to login to your car's system.{" "}
                      <strong>
                        Solar Charger will not store your password
                      </strong>
                      , but will save a temporary token it can use to control
                      your car's charging.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                (window as any).electronAPI.saveSettings({
                  inverter,
                  inverterIp,
                  vehicle,
                  homeMinWatts,
                });
              }}
              className="block w-full rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save and go! ☀️
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
