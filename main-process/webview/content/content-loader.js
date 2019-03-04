
//listen to an open-file-dialog command and sending back selected information
const { ipcMain } = require('electron')
const { dialog } = require('electron')

ipcMain.on('open-file-dialog', (event) => {
  let asd;
  dialog.showOpenDialog({
    properties: ['openFile']
  },function (filePaths) {
    asd = filePaths;
    event.sender.send('selected-file', filePaths)
  })
})