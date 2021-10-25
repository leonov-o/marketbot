
require('@electron/remote/main').initialize();
const {
    app,
    BrowserWindow, dialog
} = require('electron');
const {autoUpdater} = require('electron-updater');
const log = require('electron-log');



function createMainWindow() {
    main_win = new BrowserWindow({
        width: 960,
        height: 618,
        frame: false,
        resizable: false,
        icon: "css/img/icon.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,

        }
    });
    require("@electron/remote/main").enable(main_win.webContents);
    main_win.loadFile('menu.html');

    autoUpdater.checkForUpdates();
}

//require('@electron/remote/main').enable(webContents);

app.whenReady().then(() => createMainWindow());
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})
//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
const sendStatusToWindow = (text) => {
  log.info(text);
  if (main_win) {
    main_win.webContents.send('message', text);
  }
};

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', info => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', info => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', err => {
  sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on('download-progress', progressObj => {
  sendStatusToWindow(
    `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
  );
});
autoUpdater.on('update-downloaded', info => {
  sendStatusToWindow('Update downloaded; will install now');
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Перезапустить', 'Позже'],
    title: 'Обновление приложения',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'Скачана новая версия. Перезапустите приложение, чтобы применить обновления. '
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
});

console.log(app.getPath("userData"));
