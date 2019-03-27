import {
    Tray,
    nativeImage
} from 'electron';
import * as path from 'path';
import { toggleWindowHelper } from './helpers';

const iconPath = path.join(__static, 'lyrify16.png');

const createTray = (mainWindow) => {
    let nimage = nativeImage.createFromPath(iconPath);
    const tray = new Tray(nimage);
    const toggleWindow = () => {
        toggleWindowHelper(mainWindow, tray)
    };
    tray.setToolTip(process.env.ELECTRON_WEBPACK_APP_APP_NAME);
    tray.on('right-click', toggleWindow);
    tray.on('double-click', toggleWindow);
    tray.on('click', function (event) {
        toggleWindow();

        // Show devtools when command clicked
        if (global.isDev) {
            mainWindow.openDevTools({ mode: 'detach' });
        }
    });

    return tray;
}

export default createTray;

