const $ = require("jquery")
let { ipcRenderer } = require("electron")

// $(document).ready(function(){

    // keyDown event
    $(window).keydown(function (event) {
        let e = event || window.event;
        // e.preventDefault()
        
        if (e.ctrlKey) {
            switch(e.which){
                case 8: {
                    ipcRenderer.send('goBack')
                } break
                case 66: {
                    ipcRenderer.send('ctrl+B')
                } break
                case 90: {
                    ipcRenderer.send('ctrl+Z')
                } break
            }
        }
    })
// })

// ipcRenderer.on('log', (event, sender) => {
//     console.log(sender)
// })