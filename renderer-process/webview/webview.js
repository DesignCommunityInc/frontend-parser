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
        let context = CSSContextConstructor(DOMController.getCSSRules(node));
        showContextMenu({pageX: e.pageX, pageY: e.pageY}, context)
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
function CSSContextConstructor(contextArray){
    let tmpFileName = "";
    let cssMonitor = document.createElement('div');
    cssMonitor.classList.add('cssView');
        Array.prototype.forEach.call(contextArray, (context) => {
            let cssFileName = context.parentStyleSheet.href.split('/').slice(-1).pop() + '<br/>';
            if(tmpFileName !== cssFileName){
                let childItem = document.createElement('p');
                childItem.innerHTML = cssFileName;
                cssMonitor.append(childItem);
                tmpFileName = cssFileName;
            }
            let childItem = document.createElement('span');
            childItem.innerHTML += context.cssStringifyText;
            cssMonitor.append(childItem);
        });
    return cssMonitor;
}
function showContextMenu(e, context) {
    // let tmpNode = null;
    showContext();
    function showContext(){
        // if(typeof(tmpNode) !== null){
            contextClear();
        // }
        setUIContextPosition(e);
        uiContext.append(context);
        document.body.append(uiContext);
        // tmpNode = node; // for clicking on current object twice>
    }
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