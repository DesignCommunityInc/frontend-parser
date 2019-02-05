const $ = require('jquery');
const { ipcMain, BrowserWindow, remote } = require('electron');

function initialize(){
    // function getWindow(windowName) {
    //     Array.prototype.forEach.call()
    //     for (var i = 0; i < windowArray.length; i++) {
    //       if (windowArray[i].name == windowName) {
    //         return windowArray[i].window;
    //       }
    //     }
    //     return null;
    // }
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
}

initialize()