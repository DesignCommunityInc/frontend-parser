const $ = require('jquery');
const { ipcMain, BrowserWindow } = require('electron');
let scale = {}

function initialize(){
    // remove it from renderer !!!!!!!!!!!!   
    scale = {
        values: [ 0.67, 0.8, 0.9, 1.0, 1.25, 1.5, 2.0 ],        // Scale list values
        buttons: {                                              // Scale list buttons
            zoomIn: +10, 
            zoomOut: -10
        },
        current: 3                                              // Scale current value (1.0 default ~ 100%)
    } 

    ipcMain.on('scale-changed', function(event, arg){
        let win = BrowserWindow.getFocusedWindow().webContents

        if(typeof(arg.scaleIndex) !== 'undefined'){
            win.send('workspace-scale', scale.values[scaleIndex])
            return
        }
        if(arg){
            let next = (scale.values.length <= scale.current + 1) ? scale.current : scale.current + 1 
            scale.current = next
            win.send('workspace-scale', scale.values[next])
        }
        else{
            let previous = (scale.current - 1 <= 0) ? 0 : scale.current - 1 
            scale.current = previous
            win.send('workspace-scale', scale.values[previous])
        }
    })
}

initialize();