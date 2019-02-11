const $ = require('jquery');
const { ipcRenderer } = require('electron');
const { BrowserWindow } = require('electron').remote;

let app = (function(){
    // private
    const appTitle = 'rins-app';
    const links = $('link[rel="import"]');
    let win = null;
    return{
        init: function(){
            // SetUp main BrowserWindow
            this.render()
        },
        render: function(){
            Array.prototype.forEach.call(links, (link) => {
                let template = link.import.querySelector('.task-template')
                let clone = document.importNode(template.content, true)
                if(link.href.match('hierarchy.html') || link.href.match('webview.html'))
                $('.flex-container').append(clone);
                else
                $('body').append(clone);
            })
            this.events()
        },
        events: function(){
            // ipcRenderer.on('log', (event, sender) => {
            //     console.log(sender);
            // })
        }
    }
}())

app.init()