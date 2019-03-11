const fs = require('fs')
const path = require('path');
const { ipcMain, BrowserWindow, dialog } = require('electron');

let userName = process.env['USERPROFILE'].split(path.sep)[2];
// var loginId = path.join("domainName",userName);
// console.log(loginId);

// let webview
ipcMain.on('devtools-webview-open', function(event){
    event.sender.send('devtools-webview-open-reply')
})
ipcMain.on('clear-tree-message', function(event){
    event.sender.send('clear-tree-reply')
})
ipcMain.on('open-file-dialog', (event, sender) => {
    dialog.showOpenDialog({
        properties: [`${sender}`],
        defaultPath: `C:\\Users\\${userName}\\Desktop`
    }, function (path) {
        event.sender.send('selected-file', path)
    })
})