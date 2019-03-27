const { ipcRenderer, session } = require('electron');
const scrape = require('website-scraper');
const fs = require('fs');
const path = require('path');
// console.log(webview.getWebContents());
// //https://ourcodeworld.com/articles/read/374/how-to-download-the-source-code-js-css-and-images-of-a-website-through-its-url-web-scraping-with-node-js


class ContentLoader {
    constructor(){
        this.webview = document.querySelector('webview');
        this.buttons = {
            backward: document.getElementById('backward'),
            forward: document.getElementById('backward') // forward 
        }
        this.__basedir = `${__dirname.replaceAll('\\', '/')}`;
        this.__appdir = `${__appdir.replaceAll('\\', '/')}`;

        $(this.webview).bind('did-start-loading', () => {   // DID-START-LOADING EVENT 
            this.render();
        });
    }
    async render(){
        // this.downloadWEBContent('http://smart-home.h1n.ru/', './renderer-process/webview/content');
        let wv = this.webview;
        await this.IPCAsync();
        this.addPreloaders();
        ipcRenderer.send('clear-tree-message');
        wv.addEventListener('did-stop-loading', () => { // did-stop-loading EVENT 
            this.removePreloaders();
            wv.executeJavaScript(`require('${this.__appdir}/renderer-process/webview/webview')`);
            wv.executeJavaScript(`require('${this.__appdir}/renderer-process/webview/dom-controller')`);
            wv.insertCSS(fs.readFileSync(path.join(this.__appdir, '/assets/css/native-ui/ui-context.css'), 'utf8'));
            wv.insertCSS(fs.readFileSync(path.join(this.__appdir, '/assets/css/native-ui/ui-selector.css'), 'utf8'));
            // wv.addEventListener('dom-ready', () => { // DOM-READY EVENT 
            ipcRenderer.send('set-page-title', wv.getTitle());
            this._canGoBack();
            wv.addEventListener('mouseover', function(){
                wv.contentWindow.focus();
            });  
            // });  
        });
        return false;
    }
    async IPCAsync() {
        ipcRenderer.on('selected-file', (event, sender) => {
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

        return false;
    }

    // FUNCTIONS 
    addPreloaders(){
        Array.prototype.forEach.call(document.getElementsByClassName('preloader'), (preloader) => {
            preloader.classList.remove('preloader_loaded');
            setTimeout(function(){
                preloader.classList.remove('none');
            }, 100);
        });
        return false;
    }
    removePreloaders(){
        let preloaders = document.getElementsByClassName('preloader');
        Array.prototype.forEach.call(preloaders, (preloader) => {
            preloader.classList.add('preloader_loaded');
            setTimeout(function(){
                preloader.classList.add('none');
            }, 300)
        })
        return false;
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
        return false;
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
        return false;
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
            maxDepth: 5
        };
        scrape(options).then((result) => {
            console.log('Website succesfully downloaded');  
        }).catch((error) => {
            console.log("An error occured", error);
        });
        return false;
    }
}

let loader = new ContentLoader();

// loader.wv.onpopstate = function (event) {
//     if (event.state) {
//         console.log(event);
//       // history changed because of pushState/replaceState
//     } else {
//       // history changed because of a page load
//     }
//   }
