


// const $ = require('jquery')
// const { ipcMain } = require('electron')
const { ipcRenderer } = require('electron')

let _process = process

process.once('loaded', function(){
    global.sendMainAsync = function(channel, sender){
        ipcRenderer.send(channel, sender)
    }
    global.sendMainSync = function(channel, sender){
        ipcRenderer.sendSync(channel, sender)
    }
    /** sender as a function */
    global.addRendererListener = function(channel, sender) {
        ipcRenderer.on(channel, sender)
    }
})
