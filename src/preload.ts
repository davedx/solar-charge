import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  saveSettings: (payload: any) => {
    ipcRenderer.send("save-settings", payload);
  },
  loadSettings: () => {
    ipcRenderer.send("load-settings");
  },
  findInverters: () => {
    ipcRenderer.send("find-inverters");
  },
  handlePv: (callback: any) => ipcRenderer.on("pv", callback),
  handleVehicle: (callback: any) => ipcRenderer.on("vehicle", callback),
  handleApp: (callback: any) => ipcRenderer.on("app", callback),
});
