import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // setTitle: (title: string) => {
  //   ipcRenderer.send("set-title", title);
  // },
  handlePv: (callback: any) => ipcRenderer.on("pv", callback),
  handleVehicle: (callback: any) => ipcRenderer.on("vehicle", callback),
});
