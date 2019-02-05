const $ = require('jquery')
const fs = require('fs')
let { ipcMain } = require('electron') 

let selectedTool = {
    index: -1,
    id: 'undefined'
}
let tools = []

ipcMain.on('setSelectedTool', (event, index)    => { selectedTool = index })
ipcMain.on('setToolsList', (event, array)       => { tools = array })
ipcMain.on('getSelectedTool', (event)           => { event.returnValue =  selectedTool })

ipcMain.on('svgFilesRead', (event, args) => {
    let svgFolder = './assets/svg/'
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

