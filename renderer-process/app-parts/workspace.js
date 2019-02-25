const $ = require("jquery");
const { ipcRenderer } = require('electron');


let workspace = (function(){
    
    let webview;
    
    return {
        init: function(){
            webview = $('.webview')[0]
            this.render();
        },
        render: function(){
            $(webview).bind('dom-ready', () => {
                // Here is a webview events

                // webview.openDevTools();
                ipcRenderer.send('set-page-title', webview.getTitle());
                this.events();
            });
        },
        events: function(){
                          
            $('.webview').mouseover(function(){
                $('.webview')[0].contentWindow.focus();
            });
            ipcRenderer.on('workspace-scale', function(event, sender){
                webview.setZoomFactor(sender);
            });
            ipcRenderer.on('devtools-webview-open-reply', function(){
                if (!webview.isDevToolsOpened()){
                    webview.openDevTools();
                }
                else if(!webview.isDevToolsFocused())
                        webview.focus();
            });
            ipcRenderer.on('get-webview-from-reply', () => {
                return webview;
            });
            ipcRenderer.on('ctrl+Z', () => {
                webview.undo();
            });
            ipcRenderer.on('goBack', () => {
                webview.goBack() ;
            });
        }
    }
}());

workspace.init();