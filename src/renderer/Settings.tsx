export const Settings = () => {
  return (
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
          <div>
            <label
              htmlFor="inverter"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Solar inverter
            </label>
            <div className="mt-2.5">
              <select
                id="inverter"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="omnik">Omnik</option>
              </select>
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
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="tesla_m3">Tesla Model 3</option>
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
            <div className="mt-2.5">
              <input
                type="number"
                id="minwatts"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value="250"
                onChange={null}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your electric vehicle will only be charged when there is
              sufficient solar output, keeping available a buffer of{" "}
              <span id="mw">250</span> W for the usage of other appliances in
              your home.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <div className="rounded-md bg-yellow-50 p-4 mb-5">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Please read carefully
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    The next step will be to login to your car's system.{" "}
                    <strong>Solar Charger will not store your password</strong>,
                    but will save a temporary token it can use to control your
                    car's charging.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={null}
            className="block w-full rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save and go! ☀️
          </button>
        </div>
      </form>
      <button id="auth">Authenticate</button>
    </div>
  );
};
