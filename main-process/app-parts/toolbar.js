const $ = require('jquery')
const fs = require('fs')
let { ipcMain } = require('electron') 

let selectedTool = {
    index: -1,
    id: 'undefined'
}
let tools = []

ipcMain.on('setSelectedTool', (event, index)    => { selectedTool.index = index; event.returnValue = false })
ipcMain.on('resetSelectedTool', (event, index)    => { selectedTool.index = -1; event.returnValue = false })
ipcMain.on('setToolsList', (event, array)       => { tools = array; event.returnValue = false })
ipcMain.on('getSelectedTool', (event)           => { event.returnValue =  selectedTool.index })

ipcMain.on('svgFilesRead', (event, args) => {
    let svgFolder = './assets/svg/tools/'
    var arr = []
    fs.readdir(svgFolder, (err, files) => {
            files.forEach(file => {
            let svgString = fs.readFileSync(svgFolder + file, 'utf8')
            svgString = '<svg' + svgString.split('<svg').pop().split('</svg>')[0] + '</svg>'
            arr.push(svgString)
        })
        event.returnValue = arr
    })
})

