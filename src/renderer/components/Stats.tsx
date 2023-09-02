const SolarStat = () => {
  return (
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-base font-normal text-gray-900">Solar Output</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-red-600">
          <span id="pv_current"></span>
          <span className="ml-2 text-sm font-medium text-gray-500">
            / <span id="pv_peak"></span> W
          </span>
        </div>
      </dd>
    </div>
  );
};

const VehicleStat = () => {
  return (
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-base font-normal text-gray-900">Vehicle Charging</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline font-semibold text-red-600">
          <div>
            <div className="text-xl" id="display_name"></div>
            <div className="text-xl" id="charging_state">
              Not Charging
            </div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-500">
            <span id="charging_details"></span>
          </span>
        </div>
      </dd>
    </div>
  );
};

const TodayStat = () => {
  return (
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-base font-normal text-gray-900">Charged Today</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-red-600">
          3 KWh
          <span className="ml-2 text-sm font-medium text-gray-500"></span>
        </div>
      </dd>
    </div>
  );
};

export const Stats = () => {
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Today</h3>
      <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
        <SolarStat />
        <VehicleStat />
        <TodayStat />
      </dl>
    </div>
  );
};
