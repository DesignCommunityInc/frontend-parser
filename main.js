
const electron = require('electron')
const url = require('url')
const path = require('path')
const glob = require('glob')

// let {ipcMain} = require('electron')
const {app, BrowserWindow} = electron;

let win

// Listen for the app to be ready 
app.on('ready', function(){
    // Create new window
    loadDemos()
    win = new BrowserWindow({
        width: 1100,
        height: 800,
        minWidth: 720,
        minHeight: 480,
        frame: false,
        show: false,
        backgroundColor: '#e5e5e5',
        title: 'rins-app'
    });
    win.openDevTools();
    // Load window
    win.loadURL(path.join(__dirname, 'index.html'));
    win.on('ready-to-show', () => {
        win.maximize();
        win.show();
    });
});


// Require each JS file in the main-process dir
function loadDemos () {
    const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    files.forEach((file) => { require(file) })
}
