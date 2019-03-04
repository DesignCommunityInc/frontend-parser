// const $ = require("jquery");
const { ipcRenderer } = require('electron');
const { session } = require('electron')


let workspace = (function(){
    
    let webview;
    
    return {
        init: function(){
            webview = $('.webview')[0]
            this.render();
        },
        render: function(){
            // $(webview).bind('did-start-loading', () => {
            //     webview.executeJavaScript('document.write(<script>window.$ = require("jquery");</script>)')
            //     webview.executeJavaScript("global.$ = require('jquery');");
            // });
            ipcRenderer.on('log', (event, sender) => {
                console.log(`${sender}`);
            });
            $(webview).bind('dom-ready', () => {
                // Here is a webview events
                // webview.openDevTools();

                ipcRenderer.send('set-page-title', webview.getTitle());
                webview.executeJavaScript(`require('${__dirname.replaceAll('\\', '/')}/../webview/webview')`);
                webview.executeJavaScript(`require('${__dirname.replaceAll('\\', '/')}/../webview/dom-controller')`);
                webview.executeJavaScript(`require('${__dirname.replaceAll('\\', '/')}/../webview/selector')`);
                webview.executeJavaScript(`require('${__dirname.replaceAll('\\', '/')}/../webview/content-loader')`);
                // webview.executeJavaScript(`require('${__dirname.replaceAll('\\', '/')}/../webview/content-loader')`);
                webview.send('require', 'jquery');
                webview.executeJavaScript('let script = document.createElement("script"); script.src="js/header-main-script.js";document.getElementsByTagName("head")[0].append(script)');
                // webview.send('require', 'jquery');
                this.events();
            });
        },
        events: function(){
            console.log(webview.getWebContents());
            // let session =  $('.webview')[0].getWebContents().session;
            // session.cookies.get({ url : 'http://smart-home.h1n.ru/' }, function(error, cookies) {
            //     console.log(cookies);
            //     let cookieStr = ''
            //     for (var i = 0; i < cookies.length; i++) {
            //         let info = cookies[i];
            //         cookieStr += `${info.name}=${info.value};`;
            //         console.log(info.value, info.name);
            //     }
            //     console.log(cookieStr);
            // });
            $('.webview').mouseover(function(){
                $('.webview')[0].contentWindow.focus();
            });
            ipcRenderer.on('webview-loaded-reply', () => {
                let preloaders = document.getElementsByClassName('preloader');
                Array.prototype.forEach.call(preloaders, (preloader) => {
                    preloader.classList.add('preloader_loaded');
                    setTimeout(function(){
                        preloader.remove();
                    }, 300)
                })
            });
            ipcRenderer.on('workspace-scale', (event, sender) => {
                webview.setZoomFactor(sender);
            });
            ipcRenderer.on('devtools-webview-open-reply', () => {
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