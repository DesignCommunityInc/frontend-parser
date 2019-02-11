const { ipcRenderer } = require('electron')
const $ = require('jquery-browserify')
require('jquery-mousewheel')($)



let ctrl = false
// Mouse scroll scale function 
$(document).on('mousewheel', function(event){
    if(!ctrl) return
    if(event.deltaY > 0)
        ipcRenderer.send('scale-changed', true)
    else 
        ipcRenderer.send('scale-changed', false)
})

$(document).keydown(function (event) {
    event.preventDefault();
    if (event.ctrlKey) {
       ctrl = true
    }
});

$(document).keyup(function() {
    ctrl = false
});