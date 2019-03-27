'use strict'
import {
  app,
  ipcMain,
  dialog
} from 'electron';
import isDev from 'electron-is-dev';
import createMainWindow from './createMainWindow';
import createTray from './createTray';
import contextMenu from 'electron-context-menu';

global.isDev = isDev;
contextMenu();

let mainWindow;
let tray;
//https://github.com/davicorreiajr/spotify-now-playing/blob/master/src/index.js

app.on('ready', () => {
  try {
    mainWindow = createMainWindow();
    tray = createTray(mainWindow);
  } catch (e) {
    console.log(e);

    dialog.showMessageBox(
      mainWindow,
      {
        type: 'error',
        buttons: ['OK'],
        title: 'Error',
        message: JSON.stringify(e)
      },
      () => {
        mainWindow = null;
        tray = null;
        app.quit();
      }
    );

  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
});

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

ipcMain.on('quit', () => {
  mainWindow = null;
  app.quit();
});

app.setLoginItemSettings({
  openAtLogin: true
});

app.dock.hide();
