// const $ = require('jquery')
const { ipcMain } = require('electron')
const { ipcRenderer } = require('electron')

let _process = process

process.once('loaded', function(){
    console.log(123);
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



// Set a variable in the page before it loads

// // The loaded page will not be able to access this, it is only available
// // in this context
// window.bar = 'bar'

// document.addEventListener('DOMContentLoaded', () => {
//   // Will log out 'undefined' since window.foo is only available in the main
//   // context
//   console.log(window.foo)

//   // Will log out 'bar' since window.bar is available in this context
//   console.log(window.bar)
// })