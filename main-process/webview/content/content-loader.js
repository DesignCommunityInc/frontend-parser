
//listen to an open-file-dialog command and sending back selected information
const { ipcMain } = require('electron')
const { dialog } = require('electron')

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, {
    title: 'choose file for editing',
    filters: [
      { name: 'HTML', extensions: ['html'] }
    ]
  }, function (filePaths) {
    if (files) event.sender.send('selected-file', files)
  })
})