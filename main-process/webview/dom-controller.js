const $ = require('jquery');
const { ipcMain, BrowserWindow } = require('electron');
let page = {};
let win = null;


// ipcMain.once('setBrowserWindowMain', (event, sender) => { 
//     win = sender; 
//     // event.sender.send('log', sender);
// })

// ipcMain.on('drawRectangle', (event, pos) => {
//     win.webContents.send('', pos);
// }) 
ipcMain.once('onHierarchyCreated', (event, sender) => {
    let win
    Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
        if (window.getTitle() == 'rins-app') 
            win = window;
    });
    win.webContents.send('onHierarchyCreated-reply', sender); 
})

// ipcMain.once('onHierarchyCreated', (event, sender) => {
//     let win
//     Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
//         if (window.getTitle() == 'rins-app') 
//             win = window;
//     });
//     win.webContents.send('onHierarchyCreated-reply', sender); 
// })

// ipcMain.on('element:hover-message', (event, sender) => {
//     Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
//         if (window.getTitle() === 'rins-app') { 
//             win = window || {};
//         }
//     })
//     win.webContents.send('element:hover-message-reply', `${sender}`)
// })