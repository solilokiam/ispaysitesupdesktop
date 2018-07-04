import { app, BrowserWindow, Tray } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import path from 'path';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray
;
const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round((trayBounds.x + (trayBounds.width / 2)) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x, y };
};

const showWindow = () => {
  const { x, y } = getWindowPosition();
  mainWindow.setPosition(x, y, false);
  mainWindow.show();
  mainWindow.focus();
};

const toogleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 390,
    height: 500,
    frame: false,
    show: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });
};

const createTray = () => {
  tray = new Tray(path.join(__dirname, 'assets', 'icon.png'));
  tray.on('click', () => {
    toogleWindow();
  });
  tray.setToolTip('Is My Site Up?');
};

app.dock.hide();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  createTray();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
  if (tray === null) {
    createTray();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
