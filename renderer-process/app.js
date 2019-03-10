const $ = require('jquery');
const { ipcRenderer } = require('electron');
const { BrowserWindow, app } = require('electron').remote;

// extends global classes functions 
String.prototype.replaceAll = function(search, replace) { return this.split(search).join(replace); }
Element.prototype.remove = function() { this.parentElement.removeChild(this); }

global.$ = $;
global.__appdir = app.getAppPath();
global.__appname = app.getName();

let App = (function(){
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
                if(link.href.match('hierarchy.html') || link.href.match('workspace.html'))
                    $('.flex-container').append(clone);
                else
                    $('body').append(clone);
            })
            this.events()
        },
        events: function(){
            ipcRenderer.on('log', (event, sender) => {
                console.log(sender);
            })
        }
    }
}())

App.init()