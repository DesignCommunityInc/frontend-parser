const $ = require('jquery');
const { ipcMain, BrowserWindow } = require('electron');
let win

let page = {}

function initialize(){
    
    page.title = null

    ipcMain.on('mouse-x-y-pos-changed', (event, pos) => {
        Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
            if (window.getTitle() == 'rins-app') 
                win = window
        })
        win.webContents.send('mouse-x-y-pos-changed-reply', pos)
    }) 
    ipcMain.on('set-page-title', (event, title) => {
        Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
            if (window.getTitle() == 'rins-app') 
                win = window
        })
        page.title = title
        win.webContents.send('set-page-title-reply', `${title}`)
    })
}


initialize()