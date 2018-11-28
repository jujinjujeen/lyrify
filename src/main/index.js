'use strict'

import { 
  app, 
  BrowserWindow, 
  Tray, 
  ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

const isDevelopment = process.env.NODE_ENV !== 'production';
const assetsDirectory = path.join(__dirname, '..', '..', 'assets');

app.setLoginItemSettings({
  openAtLogin: true
});

//preventing garbage collecting
let mainWindow, tray;

if (!isDevelopment) {
  app.dock.hide();
}

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return {x: x, y: y};
}

const createTray = () => {
  const tray = new Tray(path.join(assetsDirectory, 'lyrify16.png'));
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', function (event) {
    toggleWindow();

    // Show devtools when command clicked
    if (isDevelopment) {
      mainWindow.openDevTools({mode: 'detach'});
    }
  })

  return tray;
}

const close = () => {
  mainWindow.hide();
  mainWindow.webContents.send('close');
}

const open = () => {
  mainWindow.webContents.send('open');
  showWindow();
}

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    close();
  } else {
    open();
  }
}

const showWindow = () => {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.focus();
}

const createMainWindow = () => {
  const window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    title: 'Lyrify',
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
  }

  window.on('closed', () => {
    mainWindow = null;
  })

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    })
  })

  ipcMain.on('quit', () => {
    mainWindow = null;
    app.quit();
    
  })

  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      close();
    }
  })

  return window;
}





// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
  tray = createTray();
})
