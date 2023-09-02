import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { authenticate } from "./main/teslaAuth";
import log from "electron-log";
import { getSolarOutput } from "./main/inverter";
import { updateChargeStatus } from "./main/vehicle";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("set-title", (event, title) => {
    log.info("title", title);
    authenticate(mainWindow);

    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
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

  const updatePv = async () => {
    const pv = await getSolarOutput();
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
  setInterval(updatePv, 60_000);
  updatePv();
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
