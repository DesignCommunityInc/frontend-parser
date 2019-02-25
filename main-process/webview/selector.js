let { ipcMain } = require("electron")

ipcMain.on('getSelectionArea', (event, sender) => {
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
    event.sender.send('getSelectionArea-reply', { left: left, width: width, height: height, top: top })
})