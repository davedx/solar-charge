import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title: string) => {
    console.log("sending", title);
    ipcRenderer.send("set-title", title);
  },
});
