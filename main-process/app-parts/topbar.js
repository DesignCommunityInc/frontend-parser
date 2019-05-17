const $ = require('jquery');
const { ipcMain, BrowserWindow, remote } = require('electron');

    ipcMain.on('scale-request-reply', (event, sender) => {
        Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
            if (window.getTitle() == 'rins-app') 
                window.webContents.send('workspace-scale', sender)
        })
    })
    ipcMain.on('scale', (event, sender) => {
        Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
            if (window.getTitle() == 'rins-app') 
                window.webContents.send('scale-request-message', sender)
        })
    })
    // ipcMain.on('scale-changed', function(event, arg){
    //     let win = BrowserWindow.getFocusedWindow().webContents

    //     if(typeof(arg.scaleIndex) !== 'undefined'){
    //         win.send('workspace-scale', scale.values[scaleIndex])
    //         return
    //     }
    //     if(arg){
    //         let next = (scale.values.length <= scale.current + 1) ? scale.current : scale.current + 1 
    //         scale.current = next
    //         win.send('workspace-scale', scale.values[next])
    //     }
    //     else{
    //         let previous = (scale.current - 1 <= 0) ? 0 : scale.current - 1 
    //         scale.current = previous
    //         win.send('workspace-scale', scale.values[previous])
    //     }
    // })

    ipcMain.on('window-topbar-action', function(event, action){ // topBar action
        let win = BrowserWindow.getFocusedWindow();
        switch(action){
            case 'close': {
                win.close()
            } break;
            case 'min'  : {
                win.minimize()
            } break;
            case 'max'  : {
                if(win.isMaximized()) 
                win.unmaximize()
                else    
                win.maximize()
            } break;
        }
    })
