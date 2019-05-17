const { ipcRenderer } = require('electron')

let _process = process
// global.$ = require('jquery');
process.on('document-start', () => {
    console.log('this is the document start event');
    var script = document.createElement('script');
    script.textContent = "global.$ = require('jquery');";
    document.documentElement.appendChild(script);
    // window.location.href = 'http://smart-home.h1n.ru/';
    global.sendMainAsync = function(channel, sender){
        ipcRenderer.send(channel, sender)
    }
    global.sendMainSync = function(channel, sender){
        return ipcRenderer.sendSync(channel, sender)
    }
    /** sender as a function */
    global.addRendererListener = function(channel, sender) {
        ipcRenderer.on(channel, sender)
    }
    // ipcRenderer.addEventListener('set-global-value', (event, sender) => {
    //     global[`${sender}__main`] = sender;
    // })
});


process.once('loaded', () => {
      
})