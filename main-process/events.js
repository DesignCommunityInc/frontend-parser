
const $ = require('jquery')
let { BrowserWindow, ipcMain } = require('electron')

ipcMain.on('ctrl+B', () => {
    let window = BrowserWindow.getFocusedWindow().webContents
    window.send('ctrl+B')
})
ipcMain.on('ctrl+Z', () => {
    let window = BrowserWindow.getFocusedWindow().webContents
    window.send('ctrl+Z')
})
ipcMain.on('goBack', () => {
    let window = BrowserWindow.getFocusedWindow().webContents
    window.send('goBack')
})