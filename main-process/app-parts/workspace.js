const $ = require('jquery');
const { ipcMain, BrowserWindow } = require('electron');
// let webview

function initialize(){
    
    ipcMain.on('devtools-webview-open', function(event){
        event.sender.send('devtools-webview-open-reply')
    })

    // ipcMain.on('get-webview-link-main', (event, link) => {
    //     return event.sender.send('get-webview-from-renderer')
    // })
}

initialize()