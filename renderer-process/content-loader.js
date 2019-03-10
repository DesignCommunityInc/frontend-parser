// const $ = require("jquery");
const { ipcRenderer, session } = require('electron');
const scrape = require('website-scraper');
const fs = require('fs');

// $(document).ready(function(){
// });

// console.log(webview.getWebContents());
// //https://ourcodeworld.com/articles/read/374/how-to-download-the-source-code-js-css-and-images-of-a-website-through-its-url-web-scraping-with-node-js

document.addEventListener('DOMContentLoaded', function(){
    let loader = new ContentLoader();
});

class ContentLoader {
    constructor(){
        this.webview = $('.webview')[0];
        this.buttons ={
            backward: document.getElementById('backward')
        }
        this.__basedir = `${__dirname.replaceAll('\\', '/')}`;
        this.__path = `${__appdir.replaceAll('\\', '/')}`;

        this.IPCAsync();
        $(this.webview).bind('did-start-loading', () => {
            Array.prototype.forEach.call(document.getElementsByClassName('preloader'), (preloader) => {
                preloader.classList.remove('preloader_loaded');
                setTimeout(function(){
                    preloader.classList.remove('none');
                }, 100);
            });
            this.render();
        });
    }
    render(){
        let wv = this.webview;
        wv.executeJavaScript(`require('${this.__path}/renderer-process/webview/webview')`);
        wv.executeJavaScript(`require('${this.__path}/renderer-process/webview/dom-controller')`);
        wv.executeJavaScript(`require('${this.__path}/renderer-process/webview/selector')`);
        wv.addEventListener('dom-ready', () => {
            this.removePreloaders();
            this._canGoBack();
            ipcRenderer.send('set-page-title', wv.getTitle()); 
            wv.insertCSS('.tmpDiv{position: absolute;border: 1px solid #1E90FF;border-radius: 2px;background: rgba(30, 144, 255, .2);z-index:1000000;}');
            wv.insertCSS('.hover-outline{outline: 2px dotted rgba(30, 144, 255, 0.6);transition:0.4s ease-in-out outline-color;}');
            $(wv).mouseover(function(){
                wv.contentWindow.focus();
            });   
        });
    }
    async IPCAsync() {
        ipcRenderer.on('selected-file', (event, sender) => {
            console.log(sender[0]);
            this.webview.loadURL(`${sender[0]}`);
        });
        ipcRenderer.on('workspace-scale', (event, sender) => {
            this.webview.setZoomFactor(sender);
        });
        ipcRenderer.on('devtools-webview-open-reply', () => {
            if (!this.webview.isDevToolsOpened()){
                this.webview.openDevTools();
            }
        });
        ipcRenderer.on('ctrl+Z', () => {
            this.webview.undo();
        });
        ipcRenderer.on('goBack', () => {
            this.webview.goBack();
        });
    }

    // FUNCTIONS 
    removePreloaders(){
        let preloaders = document.getElementsByClassName('preloader');
        Array.prototype.forEach.call(preloaders, (preloader) => {
            preloader.classList.add('preloader_loaded');
            setTimeout(function(){
                preloader.classList.add('none');
            }, 300)
        })
    }
    _canGoBack(){
        let wv = this.webview;
        this.buttons.backward.addEventListener('click', function(){
            if(wv.canGoBack())
                wv.goBack();
        });
        if(this.webview.canGoBack())
            this.buttons.backward.classList.add('backward-active');
        else 
            this.buttons.backward.classList.remove('backward-active');
    }
    showCookies(){
        let session = this.webview.getWebContents().session;
        session.cookies.get({ url : 'http://smart-home.h1n.ru/' }, function(error, cookies) {
            console.log(cookies);
            let cookieStr = ''
            for (var i = 0; i < cookies.length; i++) {
                let info = cookies[i];
                cookieStr += `${info.name}=${info.value};`;
                console.log(info.value, info.name);
            }
            console.log(cookieStr);
        });
    }       
    downloadWEBContent(url, path){
        let websiteUrl = `${url}`;
        let options = {
            urls: [websiteUrl],
            directory: `${path}`, // ${__basedir}\\content
            // Enable recursive download
            recursive: true,
            // Follow only the links from the first page (index)
            // then the links from other pages won't be followed
            urlFilter: function (_url) {
                return _url.indexOf(websiteUrl) === 0;
            },
            maxDepth: 3
        };
        scrape(options).then((result) => {
            console.log('Website succesfully downloaded');  
        }).catch((error) => {
            console.log("An error occured", error);
        })
    }
}