const { ipcMain, BrowserWindow } = require('electron')

ipcMain.on('sendElementStyle-message', (event, sender) => {
    Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
        if (window.getTitle() == 'rins-app') 
            window.webContents.send('sendElementStyle-reply', sender)
    });
})

ipcMain.on('getComputedStyles', (event, sender) => {
    let window = BrowserWindow.getFocusedWindow().webContents
     window.webContents.send('getComputedStyles-webview', sender)
})

