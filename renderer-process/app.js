const $ = require('jquery');
const { ipcRenderer } = require('electron');
const { BrowserWindow, app } = require('electron').remote;

// extends global classes functions 
String.prototype.replaceAll = function(search, replace) { return this.split(search).join(replace); }
Element.prototype.remove = function() { this.parentElement.removeChild(this); }
Array.prototype.addEventListener = function(event, callback) { Array.prototype.forEach.call(this, e => { e.addEventListener(event, callback); }); }

global.$ = $;
global.__appdir = app.getAppPath();
global.__appname = app.getName();

class App {
    // private
    constructor(){
        this.appTitle = 'rins-app';
        this.links = $('link[rel="import"]');
        this.win = null;
        this.IPCAsync();
    }
    render(){
        Array.prototype.forEach.call(this.links, (link) => {
            let template = link.import.querySelector('.task-template')
            let clone = document.importNode(template.content, true)
            if(link.href.match('hierarchy.html') || link.href.match('workspace.html'))
                document.querySelector('.flex-container').append(clone);
            else
                document.querySelector('body').append(clone);
        })
    }
    async IPCAsync(){
        ipcRenderer.on('log', (event, sender) => {
            console.log(sender);
        })
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let Application = new App();
    Application.render();

    let Tree = require(`${__dirname}\\app-parts\\hierarchy`);
    // let ToolBar = require(`${__dirname}\\app-parts\\toolbar`);
    // let TopBar = require(`${__dirname}\\app-parts\\toolbar`);
    // let Menu = require(`${__dirname}\\native-ui\\menu`);
    
    document.addEventListener("mousemove", function(e){
        Tree.addResizingStyles(Tree.isAvailableResizing(e.pageX));
        switch(e.buttons) {
            case 1: {
                Tree.resize(e.pageX);
            }
        }
    });
    document.addEventListener("mousedown", function(e){
        switch(e.buttons) {
            case 1: {
                Tree.sizable(Tree.isAvailableResizing(e.pageX));
            }
        }
             
    });
    document.addEventListener('mouseup', function(e){
        Tree.sizable(false);
    });
});