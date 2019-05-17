
const electron = require('electron')
const url = require('url')
const path = require('path')
const glob = require('glob')
const os = require('os');
// let {ipcMain} = require('electron')
const {app, BrowserWindow, Menu } = electron;

let win
// Listen for the app to be ready 
app.on('ready', function(){
    // Create new window
    loadDemos()
    // startView = new BrowserWindow({
    //     width: 800,
    //     height: 550,
    //     resizable: false,
    //     frame: false,
    //     show: false,
    // })
    // // (os == 'win32' ? 'file://' : '')
    // startView.openDevTools();
    // // Load window
    // startView.loadURL(path.join(__dirname, 'index.html'));
    // startView.on('ready-to-show', () => {
    //     startView.show();
    // })
    // ---
    let mainWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 720,
        minHeight: 480,
        frame: false,
        show: false,
        backgroundColor: '#e5e5e5',
        title: 'rins-app',
        webPreferences: {
            // nodeIntegration: false,
            // nodeIntegrationInWorker: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.openDevTools();
    // Load window
    mainWindow.loadURL(path.join(__dirname, 'sections/windows/main.html'));
    mainWindow.on('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();
    })
    // ---
})

// Require each JS file in the main-process dir
function loadDemos () {
    const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    files.forEach((file) => { require(file) })
}
