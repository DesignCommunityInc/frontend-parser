const $ = require('jquery');
const { ipcRenderer, remote } = require('electron');
const { BrowserWindow, app } = remote;

// extends global classes functions 
String.prototype.replaceAll = function(search, replace) { return this.split(search).join(replace); }
Element.prototype.remove = function() { this.parentElement.removeChild(this); }
NodeList.prototype.addEventListener = function(event, callback) { Array.prototype.forEach.call(this, e => { e.addEventListener(event, callback); }); }


global.$ = $;
global.__appdir = app.getAppPath();
global.__appname = app.getName();
global.currentWindow = remote.getCurrentWindow();
global.webview = null; // setUp by documentLoad in workspace.html
global.addRendererListener = (event, callback) => {
    ipcRenderer.on(event, callback);
}
global.uiContext = document.registerElement('ui-context', {
    prototype: Object.create(HTMLElement.prototype)
});

class App {
    // private
    constructor(){
        this.appTitle = 'rins-app';
        this.links = $('link[rel="import"]');
        // this.win = null;
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
        });
    }
    async IPCAsync(){
        ipcRenderer.on('log', (event, sender) => {
            console.log(sender);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let Application = new App();
    Application.render();
    // Starting coding 
    // after application interface 
    // rendered --->
    
    
    let Tree = require(`${__dirname}\\app-parts\\hierarchy`);
    let TopBar = require(`${__dirname}\\app-parts\\topbar`);
    let Menu = require(`${__dirname}\\native-ui\\menu`);
    let ToolBar = require(`${__dirname}\\app-parts\\toolbar`);

    // Listeners starts here 
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
    // Topbar events personal
    document.querySelector('.burger').addEventListener('click', function(){
        Menu.container.classList.toggle('menu-opened');
    });
    document.querySelectorAll(".tb-button").addEventListener('click', function(){                
        ipcRenderer.send('window-topbar-action', this.id)
    });
    document.querySelectorAll("#devtools").addEventListener('click', function(){  
        ipcRenderer.send('devtools-webview-open')
    });
    document.addEventListener('keydown', function (e) {
        e.preventDefault();
        if (e.keyCode == 27) { 
            TopBar.scale.container.removeClass('active-scale-list'); // Close scale list on Escape button
            return;
        }
    });
    document.querySelectorAll('.scale input').addEventListener('focus', function(){
        TopBar.scale.container.addClass('active-scale-list');
    });
    document.querySelectorAll('.scale input').addEventListener('blur', function(){
        TopBar.scale.container.removeClass('active-scale-list');
    });
    // Toolbar events personal
    document.querySelectorAll('.tool').addEventListener('click', function(e) {
        if(e.buttons === 0)
            ToolBar.setSelectedTool(this);
    });
});