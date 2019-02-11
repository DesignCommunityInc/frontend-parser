let { ipcRenderer } = require("electron");
const $ = require('jquery')
// import { ipcRenderer } from "electron";

// let tempDivision = {}

// tempDivision.element = document.createElement('div')
// tempDivision.element.classList.add('tmpDiv')
// tempDivision.mouseStartPos = { x: null, y: null }

// $(tempDivision.element).load('../../sections/native-ui/tempDivision.html')

// $(window).on('mousedown', function(e){
//     $('body').append(tempDivision.element)
//     tempDivision.mouseStartPos = {
//         x: e.pageX,
//         y: e.pageY
//     }
// })

// $(window).mouseup(function(e){
//     $('.tmpDiv').remove()
// })
$(window).keydown(function (event) {
    let e = event || window.event
    e.preventDefault()
    if (e.shiftKey) ipcRenderer.send('shiftKeyDown')
})