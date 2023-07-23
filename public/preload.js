const remote = require('@electron/remote');
const {ipcRenderer} = require("electron");
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer-extra')

const pluginStealth = require('puppeteer-extra-plugin-stealth')
puppeteer.use(pluginStealth())

const userDataPath = remote.app.getPath('userData');
let dataConfig = {
    accounts: []
};
if (userDataPath) {
    try {
        const rawData = fs.readFileSync(path.join(userDataPath, "dataConfig.json"));
        dataConfig = JSON.parse(rawData);
    } catch (e) {
        console.log("Configuration file not found");
    }
}
window.dataConfig = dataConfig;


window.puppeteer = puppeteer;
window.ipcRenderer = ipcRenderer;
window.remote = remote;
