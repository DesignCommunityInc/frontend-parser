const $ = require('jquery');
const { ipcMain, BrowserWindow } = require('electron');
let page = {};
let win = null;


// ipcMain.once('setBrowserWindowMain', (event, sender) => { 
//     win = sender; 
//     // event.sender.send('log', sender);
// })

// ipcMain.on('drawRectangle', (event, pos) => {
//     win.webContents.send('', pos);
// }) 
ipcMain.once('onHierarchyCreated', (event, sender) => {
    let win
    Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
        if (window.getTitle() == 'rins-app') 
            win = window;
    });
    win.webContents.send('onHierarchyCreated-reply', sender); 
})

ipcMain.on('getSelectionArea', (event, sender) => {
    let scrollTop = sender.scrollTop;
    let alignment = sender.alignment
    let mouseStartPos = { x: sender.startX, y: sender.startY }
    let left = 0, width = 0, height = 0, top = 0
    let offsetX = sender.offsetX,
        offsetY = sender.offsetY

    if(sender.pageX - mouseStartPos.x >= 0){
        left = mouseStartPos.x
        width = sender.pageX - mouseStartPos.x
    }
    else {
        width = mouseStartPos.x - sender.pageX
        if (sender.pageX >= 0) left = sender.pageX
        else width += sender.pageX // LEFT = 0 
    }
    if(sender.pageY - mouseStartPos.y >= 0) {
        height = sender.pageY - mouseStartPos.y
        top = mouseStartPos.y
    }
    else {
        height = mouseStartPos.y - sender.pageY
        if (sender.pageY >= 0) top = sender.pageY
        else height += sender.pageY // TOP = 0 
    }
    if(alignment){
        width = (height < width) ? height : width
        height = (width < height) ? width : height
        left += (sender.pageX - mouseStartPos.x < 0) ? mouseStartPos.x - (left + width) : 0
        top += (sender.pageY - mouseStartPos.y < 0) ? mouseStartPos.y - (top + height) : 0
    }
    top -= scrollTop;
    event.sender.send('getSelectionArea-reply', { left: left, width: width, height: height, top: top })
})

// ipcMain.once('onHierarchyCreated', (event, sender) => {
//     let win
//     Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
//         if (window.getTitle() == 'rins-app') 
//             win = window;
//     });
//     win.webContents.send('onHierarchyCreated-reply', sender); 
// })

// ipcMain.on('element:hover-message', (event, sender) => {
//     Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (window) => {
//         if (window.getTitle() === 'rins-app') { 
//             win = window || {};
//         }
//     })
//     win.webContents.send('element:hover-message-reply', `${sender}`)
// })