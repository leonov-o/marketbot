const {app, BrowserWindow} = require("electron");
const path = require("path");
const fs = require("fs");
const {autoUpdater} = require('electron-updater');
const {ipcMain} = require("electron")
require('@electron/remote/main').initialize();

const userDataPath = app.getPath('userData');

let win;
let updateTimer = null
function createWindow() {
    win = new BrowserWindow({
        width: 1130,
        minWidth: 717,
        height: 700,
        minHeight: 555,
        frame: false,
        webPreferences: {
            webSecurity: false,
            allowRunningInsecureContent: true,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    require("@electron/remote/main").enable(win.webContents);
    // win.loadURL("http://localhost:3000");//dev
    win.loadURL(path.join(__dirname, "index.html"));//prod
}



autoUpdater.on('checking-for-update', () => {
    win.webContents.send('checking-for-update');
});
autoUpdater.on('update-available', () => {
    win.webContents.send('update-available');
});
autoUpdater.on('update-not-available', () => {
    win.webContents.send('update-not-available');
});
autoUpdater.on('error', err => {
    win.webContents.send('error', `Error in auto-updater: ${err.toString()}`);

});
autoUpdater.on('download-progress', progressObj => {
    win.webContents.send('download-progress', progressObj.percent);
});
autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded');
});

ipcMain.on('lets-update', (event, args) => {
    fs.writeFileSync(path.join(userDataPath, "dataConfig.json"), JSON.stringify(args, null, 2));
    autoUpdater.quitAndInstall();
});

ipcMain.on('close', (event, args) => {
    fs.writeFileSync(path.join(userDataPath, "dataConfig.json"), JSON.stringify(args, null, 2));
    app.quit();
});

ipcMain.on('minimize-window', () => {
    let window = BrowserWindow.getFocusedWindow();
    window.minimize();
});
ipcMain.on('maximize-window', () => {
    let window = BrowserWindow.getFocusedWindow();
    window.isMaximized()
        ? window.unmaximize()
        : window.maximize();
});

app.on('ready', () => {
    createWindow();
    updateTimer = setTimeout(function tick() {
        autoUpdater.checkForUpdates()
        updateTimer = setTimeout(tick, 3600000);
    }, 6000);
});

app.on('before-quit', () => {

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
});
