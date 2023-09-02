import { Stats } from "./components/Stats";

export const Dashboard = () => {
  return (
    <div className="isolate px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Solar Charger
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">Dashboard</p>
      </div>
      <Stats />
    </div>
  );
};
