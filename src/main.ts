import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import log from "electron-log";
import { getSolarOutput } from "./main/inverter";
import { updateChargeStatus } from "./main/vehicle";
import { readSettings, readTokens, writeSettings } from "./main/storage";
import { SettingsPayload } from "./main/types";
import { scanLocalNetwork } from "./main/netScan";
import { createAuth, createVehicle } from "./main/apis";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 900,
    icon: "../icons/icon.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("save-settings", async (_event, payload: SettingsPayload) => {
    log.info("save-settings", payload);
    writeSettings(payload);

    let goToDashboard = true;
    const tokens = await readTokens(payload.vehicle);
    if (!tokens || !tokens.access_token) {
      log.info(`no token found for ${payload.vehicle}, authenticating`);
      goToDashboard = false;

      const authorizer = createAuth(payload.vehicle);
      if (!authorizer) {
        throw new Error(`unsupported vehicle: ${payload.vehicle}`);
      }
      authorizer.authorize(mainWindow, (res: boolean) => {
        log.info("success:", res);
        mainWindow.webContents.send("app", { setRoute: "dashboard" });
      });
    }
    if (goToDashboard) {
      mainWindow.webContents.send("app", { setRoute: "dashboard" });
    }
  });

  ipcMain.on("load-settings", async (_event, payload) => {
    log.info("load-settings");
    const settings = readSettings();
    mainWindow.webContents.send("app", { settings });
  });

  ipcMain.on("find-inverters", async (_event, payload) => {
    scanLocalNetwork().then((ipHosts) => {
      //log.info("ipHosts:", ipHosts);
      mainWindow.webContents.send("app", { ipHosts });
    });
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  const update = async () => {
    const settings = readSettings();
    if (!settings) {
      return;
    }

    const pv = { peak: 3000, current: 2290 }; //await getSolarOutput(settings);
    log.info("pv:", pv);
    mainWindow.webContents.send("pv", pv);

    log.info("settings:", settings);
    try {
      const vehicle = await createVehicle(settings.vehicle);
      if (vehicle) {
        log.info("trying to update vehicle status:");
        const vehicleStatus = await updateChargeStatus(vehicle, pv.current);
        log.info("vehicleStatus:", vehicleStatus);
        mainWindow.webContents.send("vehicle", vehicleStatus);
      }
    } catch (e) {
      log.error(e);
    }
  };
  setInterval(update, 300_000); // 60_000);
  update();
};

app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
