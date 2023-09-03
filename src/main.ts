import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { authenticate } from "./main/teslaAuth";
import log from "electron-log";
import { getSolarOutput } from "./main/inverter";
import { updateChargeStatus } from "./main/vehicle";
import { readSettings, readTokens, writeSettings } from "./main/storage";
import { SettingsPayload } from "./main/types";

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
    await writeSettings(payload);

    let goToDashboard = true;
    if (payload.vehicle === "tesla_m3") {
      const tokens = await readTokens();
      if (!tokens || !tokens.access_token) {
        log.info("vehicle is tesla and no tokens found. authenticating");
        goToDashboard = false;
        authenticate(mainWindow, (res: boolean) => {
          log.info("success:", res);
          mainWindow.webContents.send("app", { setRoute: "dashboard" });
        });
      }
    }
    if (goToDashboard) {
      mainWindow.webContents.send("app", { setRoute: "dashboard" });
    }
  });

  ipcMain.on("load-settings", async (_event, payload) => {
    log.info("load-settings");
    const settings = await readSettings();
    mainWindow.webContents.send("app", { settings });
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const update = async () => {
    const settings = await readSettings();
    if (!settings) {
      return;
    }

    const pv = await getSolarOutput(settings);
    log.info("pv:", pv);
    mainWindow.webContents.send("pv", pv);

    try {
      const vehicleStatus = await updateChargeStatus(pv.current);
      log.info("vehicleStatus:", vehicleStatus);
      mainWindow.webContents.send("vehicle", vehicleStatus);
    } catch (e) {
      log.error(e);
    }
  };
  setInterval(update, 60_000);
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
