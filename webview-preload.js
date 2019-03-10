// const $ = require('jquery')
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
        ipcRenderer.sendSync(channel, sender)
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
// ipcRenderer.on('require', (event, sender) => {
//     window.$ = require(`${sender}`);
//     event.sender.send('log', `${sender}`);
// })
// process.once('document-start', () => {
//     console.log('this is the document start event');
//     global.$ = require('jquery');
// })

// let UserDocument = {
//     addRequirements(module){
//         require(`${sender}`);
//         // global.$ = $;
//         console.log(`require(${sender})`);
//     }
// }
// ipcRenderer.on('require', (event, sender) => { 
//     global.$ = require('jquery');   
// });


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