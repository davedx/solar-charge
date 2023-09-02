import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  saveSettings: (payload: any) => {
    ipcRenderer.send("save-settings", payload);
  },

  handlePv: (callback: any) => ipcRenderer.on("pv", callback),
  handleVehicle: (callback: any) => ipcRenderer.on("vehicle", callback),
});
