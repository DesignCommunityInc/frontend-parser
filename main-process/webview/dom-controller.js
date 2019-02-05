const $ = require('jquery');
const { ipcMain, BrowserWindow } = require('electron');
let win

let page = {}

function initialize(){
    // Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
    //     if (window.getTitle() == 'rins-app') 
    //         win = window
    // })
    ipcMain.on('drawRectangle', (event, pos) => {
        
        
        win.webContents.send('', pos)
    }) 

    // $(window).on('mousemove', function(e){
    //     if(e.buttons == 1) {
    //         if(rectangleTool_selected)
    //         window.getSelection().removeAllRanges()
    //         let param = domSelector(e)
    //         $('.tmpDiv').css({ 
    //             'width' : param.width,
    //             'left' : param.left,
    //             'height' : param.height,
    //             'top' : param.top
    //         })
    //         console.log(param)
    //     }
    // })
    
}

initialize()