const getWindowPosition = (mainWindow, tray) => {
    const windowBounds = mainWindow.getBounds();
    const trayBounds = tray.getBounds();

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);

    return { x: x, y: y };
}

const showWindow = (mainWindow, tray) => {
    const position = getWindowPosition(mainWindow, tray);
    mainWindow.setPosition(position.x, position.y, false);
    mainWindow.show();
    mainWindow.focus();
}

export const close = (mainWindow) => {
    mainWindow.webContents.send('close');
    mainWindow.hide();
}

const open = (mainWindow, tray) => {
    mainWindow.webContents.send('open');
    showWindow(mainWindow, tray);
}

export const toggleWindowHelper = (mainWindow, tray) => {
    if (mainWindow.isVisible()) {
        close(mainWindow);
    } else {
        open(mainWindow, tray);
    }
}