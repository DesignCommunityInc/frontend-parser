const { ipcMain, BrowserWindow } = require('electron')
const remote = require('electron').remote
let application = {
    appName: 'rins-app',
    pageTitle: null
};



function getApplicationWindow() {
    let windows = BrowserWindow.getAllWindows();
    console.log(windows.length);
    for(let i = 0, length = windows.length; i < length; i++) {
        if (windows[i].getTitle() === `${application.appName}`) 
            return windows[i]
    }
    return null
}

// let mainWindow = remote.getCurrentWindow()

ipcMain.on('mouse-pos-changed-message', (event, sender) => {
    Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
        if (window.getTitle() == 'rins-app') 
            window.webContents.send('mouse-pos-changed-reply', sender); 
    });
}); 
ipcMain.on('webview-loaded', () => {
    Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
        if (window.getTitle() == 'rins-app') 
            window.webContents.send('webview-loaded-reply'); 
    });
});
ipcMain.on('set-page-title', (event, sender) => {
    application.pageTitle = sender;
    Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
        if (window.getTitle() == 'rins-app') 
            window.webContents.send('set-page-title-reply', sender); 
    });
});
ipcMain.on('element-selected-message', (event, sender) => {
    Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
        if (window.getTitle() == 'rins-app') 
            window.webContents.send('element-selected-reply', sender); 
    });
});
ipcMain.on('getContextList', (event) => {
    let arr = []
    for(let i = 0; i < 3; i++) {
        arr.push({
            text: 'text',
            id: i
        });
    }
    event.returnedValue = arr;
});

