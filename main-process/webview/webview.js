const $ = require('jquery');
const { ipcMain, BrowserWindow } = require('electron');
let page = {};
let win;

function initialize(){
    page.title = null;
    ipcMain.on('mouse-pos-changed-message', (event, pos) => {
        Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
            if (window.getTitle() == 'rins-app') 
                win = window
        });
        win.webContents.send('mouse-pos-changed-reply', pos);
    }); 
    ipcMain.on('set-page-title', (event, title) => {
        Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
            if (window.getTitle() == 'rins-app') 
                win = window;
        });
        page.title = title;
        win.webContents.send('set-page-title-reply', `${title}`);
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
}


initialize()