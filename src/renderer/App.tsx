import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Settings } from "./Settings";
import { Dashboard } from "./Dashboard";
import { TopNav } from "./components/TopNav";
import { Background } from "./components/Background";

const App = () => {
  const [route, setRoute] = useState("dashboard");
  let page;
  switch (route) {
    case "settings":
      page = <Settings />;
      break;
    case "dashboard":
      page = <Dashboard />;
      break;
    default:
      page = <div>404</div>;
      break;
  }
  return (
    <>
      <Background />
      <TopNav route={route} setRoute={setRoute} />
      {page}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
