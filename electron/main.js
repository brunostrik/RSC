const { app, BrowserWindow, dialog, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const { generateUnifiedPdf } = require('./pdf/generateUnifiedPdf');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    // Note: on Windows, the true app icon is taken from the packaged .exe.
    // This sets the window/icon shown while running in dev.
    icon: path.join(__dirname, '../renderer/favicon.gif'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);
  win.removeMenu();
  win.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('dialog:pickFiles', async (_event, options) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    title: options?.title ?? 'Selecionar arquivos',
    filters: options?.filters
  });
  if (result.canceled) return [];
  return result.filePaths;
});

ipcMain.handle('dialog:savePdf', async (_event, defaultPath) => {
  const result = await dialog.showSaveDialog({
    title: 'Salvar PDF',
    defaultPath: defaultPath || 'RSC_IFPR.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (result.canceled) return null;
  return result.filePath;
});

ipcMain.handle('dialog:saveProject', async (_event, defaultPath) => {
  const result = await dialog.showSaveDialog({
    title: 'Salvar projeto',
    defaultPath: defaultPath || 'RSC_IFPR.rscproj',
    filters: [{ name: 'Projeto RSC', extensions: ['rscproj'] }]
  });
  if (result.canceled) return null;
  return result.filePath;
});

ipcMain.handle('dialog:openProject', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Abrir projeto',
    properties: ['openFile'],
    filters: [{ name: 'Projeto RSC', extensions: ['rscproj'] }]
  });
  if (result.canceled) return null;
  return result.filePaths?.[0] ?? null;
});

ipcMain.handle('file:readBuffer', async (_event, filePath) => {
  const buf = await fs.readFile(filePath);
  return buf;
});

ipcMain.handle('file:openPath', async (_event, filePath) => {
  if (!filePath) return { ok: false };
  const res = await shell.openPath(filePath);
  if (res) throw new Error(res);
  return { ok: true };
});

function sanitizeFileName(name) {
  return String(name || 'anexo')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .slice(0, 180);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

ipcMain.handle('project:write', async (_event, payload) => {
  const { projectPath, criteria, formState, attachmentsByKey } = payload || {};
  if (!projectPath) throw new Error('projectPath ausente');

  /** @type {Record<string, {name: string, dataBase64: string}[]>} */
  const embedded = {};

  for (const [k, files] of Object.entries(attachmentsByKey || {})) {
    if (!Array.isArray(files) || !files.length) continue;
    embedded[k] = [];
    for (const filePath of files) {
      const buf = await fs.readFile(filePath);
      const name = path.basename(filePath);
      embedded[k].push({ name, dataBase64: buf.toString('base64') });
    }
  }

  const project = {
    version: 1,
    savedAt: new Date().toISOString(),
    criteria,
    formState,
    attachmentsEmbedded: embedded
  };

  await fs.writeFile(projectPath, JSON.stringify(project), 'utf8');
  return { ok: true };
});

ipcMain.handle('project:read', async (_event, payload) => {
  const { projectPath } = payload || {};
  if (!projectPath) throw new Error('projectPath ausente');

  const raw = await fs.readFile(projectPath, 'utf8');
  const project = JSON.parse(raw);

  const id = crypto.createHash('sha1').update(projectPath + '|' + (project.savedAt || '')).digest('hex').slice(0, 12);
  const baseDir = path.join(app.getPath('userData'), 'rsc-projects', id, 'attachments');
  await ensureDir(baseDir);

  /** @type {Record<string, string[]>} */
  const attachmentsByKey = {};
  const embedded = project.attachmentsEmbedded || {};

  for (const [k, list] of Object.entries(embedded)) {
    if (!Array.isArray(list) || !list.length) continue;
    attachmentsByKey[k] = [];
    for (let i = 0; i < list.length; i++) {
      const entry = list[i];
      const safe = sanitizeFileName(entry?.name || `anexo_${i + 1}`);
      const outPath = path.join(baseDir, `${k.replace(/[^\w.-]/g, '_')}_${i + 1}_${safe}`);
      const buf = Buffer.from(String(entry?.dataBase64 || ''), 'base64');
      await fs.writeFile(outPath, buf);
      attachmentsByKey[k].push(outPath);
    }
  }

  return {
    version: project.version ?? 1,
    criteria: project.criteria,
    formState: project.formState || {},
    attachmentsByKey
  };
});

ipcMain.handle('pdf:generate', async (_event, payload) => {
  const {
    criteria,
    formState,
    attachmentsByKey,
    outputPath,
    openAfter
  } = payload;

  const pdfBytes = await generateUnifiedPdf({
    criteria,
    formState,
    attachmentsByKey,
    readFile: async (p) => fs.readFile(p)
  });

  await fs.writeFile(outputPath, pdfBytes);
  if (openAfter) {
    const res = await shell.openPath(outputPath);
    if (res) throw new Error(res);
  }
  return { ok: true };
});

