const $ = require("jquery")
const _$ = require('jquery-browserify')
require('jquery-mousewheel')(_$)
const { ipcRenderer } = require('electron')

$(document).ready(function(){

    let workspace = new WorkSpace();
    sendMainAsync('webview-loaded');
    // Mouse scroll scale function 
    _$(document).on('mousewheel', function(event){
       workspace.wheel(event.ctrlKey, event.deltaY, {x: event.pageX, y: event.pageY});
    });

    $('.backward-button').on('click', function(e) {
        sendMainAsync('goBack')
    });

    $(document).on('mousemove', function(event){
        sendMainAsync("mouse-pos-changed-message", { x: event.pageX, y: event.pageY })
    });

    document.getElementsByTagName('body')[0].addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        // showContextMenu();
        console.log('hello');
        return false;
    }, false);
});

class WorkSpace {
    // private variables
    constructor() {
        this.init();
    }
    init(saved_project){
        this.render()
    }
    render(){
        this.IPC()
    }
    IPC(){           
        addRendererListener('set-page-title-reply', (event, title) => {
            console.log(`${title}`)
        });
        // addRendererListener('getContextList', (event, sender) => {
        //     event.sender.send
        // });
    }

    // FUNCTIONS 
    wheel(ctrl, deltaY, position){
        if(!ctrl) return;
        if(deltaY > 0)
            sendMainAsync('scale-changed', true);
        else 
            sendMainAsync('scale-changed', false);
    
        sendMainAsync('mouse-pos-changed-message', position);
    }
}


function showContextMenu() {
    let doc = document.createElement('div').innerHTML='<object type="text/html" data="./sections/native-ui/context.html" ></object>';
    let template = doc.getElementsByTagName('object')[0].querySelector('.task-template')
    let clone = document.importNode(template.content, true)
    document.getElementsByTagName('body')[0].append(clone);
}

// function uploadStyles(filename){
//     let linkElement = document.createElement('link')
//     $(linkElement).attr('rel', 'stylesheet')
//     $(linkElement).attr('type', 'text/css');
//     $(linkElement).attr('href', '../../assets/css/' + filename);
// }