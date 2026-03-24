const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  pickFiles: (options) => ipcRenderer.invoke('dialog:pickFiles', options),
  savePdf: (defaultPath) => ipcRenderer.invoke('dialog:savePdf', defaultPath),
  generatePdf: (payload) => ipcRenderer.invoke('pdf:generate', payload),
  readBuffer: (filePath) => ipcRenderer.invoke('file:readBuffer', filePath),
  openPath: (filePath) => ipcRenderer.invoke('file:openPath', filePath),
  saveProject: (defaultPath) => ipcRenderer.invoke('dialog:saveProject', defaultPath),
  openProject: () => ipcRenderer.invoke('dialog:openProject'),
  writeProject: (payload) => ipcRenderer.invoke('project:write', payload),
  readProject: (payload) => ipcRenderer.invoke('project:read', payload)
});

