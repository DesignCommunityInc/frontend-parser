const { ipcRenderer } = require('electron')
const $ = require("jquery")
const _$ = require('jquery-browserify')
require('jquery-mousewheel')(_$)

// content-loader.js ~ did-stop-loading

let DOMController = require(`${__dirname}\\dom-controller`);

let UIContext = document.registerElement('ui-context', {
    prototype: Object.create(HTMLElement.prototype)
});
let uiContext = new UIContext();


let pageNodes = document.body.getElementsByTagName('*');
Array.prototype.forEach.call(pageNodes, (node) => {
    node.addEventListener('contextmenu', function(event) {
        let e = event || window.event;
        e.stopPropagation();
        let views = [
            PropertiesWindowConstructor(DOMController.getCSSRules(node)),
            CSSWindowConstructor(DOMController.getCSSRules(node))
        ];
        showContextMenu({pageX: e.pageX, pageY: e.pageY}, views);
    });
});
document.addEventListener('mousedown', function(event){
    let e = event || window.event;
    if(e.buttons === 1){
        DOMController.setSelectionMouseStartPos(e);
        return false;
    }     
});       
document.addEventListener('mousemove', (event) =>  {
    let e = event || window.event;
    sendMainAsync("mouse-pos-changed-message", { x: e.pageX, y: e.pageY })
    if(e.buttons === 1) 
    DOMController.setSelectionArea(e);
});
document.addEventListener('mouseup', (event) => {
    let e = event || window.event;
    sendMainSync('resetSelectedTool');
    DOMController.resetTempStyles();
});
// SCROLL  
_$(document).on('mousewheel', function(event){
    wheel(event.ctrlKey, event.deltaY, {x: event.pageX, y: event.pageY});
});
function wheel(ctrl, deltaY, position){
    if(!ctrl) return false;
    if(deltaY > 0) sendMainAsync('scale-changed', true);
        else sendMainAsync('scale-changed', false);
    sendMainAsync('mouse-pos-changed-message', position);
}

function SetContextTitle(container, tmp, current){
    if(tmp !== current){
        let childItem = document.createElement('h2');
        childItem.innerHTML = current;
        container.append(childItem);
        tmp = current;
    }
    return tmp
}
function CSSWindowConstructor(contextArray){
    let tmpFileName = "";
    let cssMonitor = document.createElement('div');
    cssMonitor.className = 'view view-active';
    Array.prototype.forEach.call(contextArray, (context) => {
        let cssFileName = context.parentStyleSheet.href.split('/').slice(-1).pop() + '<br/>';
        tmpFileName = SetContextTitle(cssMonitor, tmpFileName, cssFileName);
        let childItem = document.createElement('span');
        childItem.innerHTML += context.cssStringifyText;
        cssMonitor.append(childItem);
    });
    return cssMonitor;
}
function PropertiesWindowConstructor(contextArray){
    let matches = /\b(?:margin|padding|backgroundPosition)\b/;
    let doNotShow = /(^[0-9]+$)|\b[(?:cssText|parentStyleSheet|)]\b/;
    let cssMonitor = document.createElement('div');
    let classListContainer = document.createElement('div');

    classListContainer.className = 'list classList';
    cssMonitor.className = 'view';
    Array.prototype.forEach.call(contextArray, (context, i) => {
        let spanWrapper = document.createElement('div');
            spanWrapper.className = (i === 0) ? 'span-wrapper span-wrapper-active' : 'span-wrapper';

        let cssClassName = context.selectorText;
        
        // set ClassList
        let classTab = document.createElement('h3');
        // classTab.addEventListener('click', function(){
        //     let views = document.querySelectorAll('ui-context .span-wrapper');
        //     let classTabs = document.querySelectorAll('ui-context h3');
        //     let i = 0;
        //     Array.prototype.forEach.call(classTabs, (tab, j) => {
        //         i = (classTab === tab) ? j : 0;
        //     });
        //     Array.prototype.forEach.call(views, (view, j) => {
        //         if(i === j) { view.className = 'span-wrapper span-wrapper-active'; return; }
        //         if(i < j) view.className = 'span-wrapper span-wrapper-scaled';
        //         else view.className = 'span-wrapper span-wrapper-scaled-invert'
        //     });
        // });
        classTab.innerHTML = cssClassName;
        classListContainer.append(classTab);

        // set Content
        let values = Object.assign({}, context.style);
        let keys = Object.keys(context.style).slice(0);
        Array.prototype.forEach.call(keys.filter((key) => { return values[key] !== ""; }), (cssProperty, i) => {
            if(cssProperty.match(doNotShow)) return;
            let childItem = document.createElement('span');
            childItem.innerHTML = `${cssProperty}: ${values[cssProperty]}`;
            delete keys[i];
            delete values[cssProperty];
            // if(cssProperty.match(matches)){
            //     childItem.classList.add('matchContainer');
            //     Array.prototype.forEach.call(context.style.filter((value)=>{return value.match(matches);}), matchProperty => {
            //         let child = document.createElement('span');
            //         child.innerHTML = matchProperty;
            //         childItem.append(child);
            //     });
            // }
            cssMonitor.append(childItem);
        });
        Array.prototype.forEach.call(keys, cssProperty => {
            if(cssProperty.match(doNotShow)) return;
            let childItem = document.createElement('span');
            childItem.innerHTML = cssProperty;
            cssMonitor.append(childItem);
        });
        classListContainer.querySelector('h3').classList.add('active');
        cssMonitor.prepend(classListContainer);
    });
    return cssMonitor;
}
function showContextMenu(e, views) {
    contextClear();
    setUIContextPosition(e);
    setUIContextToolsList();
    Array.prototype.forEach.call(views, view => {
        uiContext.append(view);
    });
    document.body.append(uiContext);
}
function setUIContextToolsList(){
    let list = document.createElement('div');
    list.className = 'list toolsList';
    for(let i = 0; i < 5; i++){
        let tool = document.createElement('h3');
        switch(i){
            case 0: case 1: case 2: case 3: case 4: {
                tool.innerHTML = i;
                tool.addEventListener('click', function(){
                    let views = document.querySelectorAll('ui-context .view');
                    Array.prototype.forEach.call(views, (view, j) => {
                        if(i === j) { view.className = 'view view-active'; return; }
                        if(i < j) view.className = 'view view-scaled';
                        else view.className = 'view view-scaled-invert'
                    });
                });
            } break;
        }
        list.append(tool);
    }
    uiContext.append(list);
}
function setUIContextPosition(e){
    uiContext.style.left = `${e.pageX}px`;
    uiContext.style.top = `${e.pageY}px`;
}
function contextClear(){
    $(uiContext).remove();
    uiContext = null;
    uiContext = new UIContext();
}
// function uploadStyles(filename){
//     let linkElement = document.createElement('link')
//     $(linkElement).attr('rel', 'stylesheet')
//     $(linkElement).attr('type', 'text/css');
//     $(linkElement).attr('href', '../../assets/css/' + filename);
// }



// class WorkSpace {
//     // private variables
//     constructor() {
//         this.init();
//     }
//     init(saved_project){
//         this.render()
//     }
//     render(){
//         this.IPC()
//     }

//     // FUNCTIONS 
// }