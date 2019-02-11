const $ = require("jquery")
const { ipcRenderer } = require('electron')

let workspace = (function(){
    // private variables
    let objects = []

    return {
        init: function(saved_project){
            this.render()
        },
        render: function(){
            this.events()
        },
        events: function(){   
            $(window).on('click', function(e){
                if(e.buttons === 2){
                    showContextMenu();
                }
            }); 
            document.getElementsByTagName('body')[0].addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                // showContextMenu();
                console.log('hello');
                return false;
            }, false);
            $('.backward-button').on('click', function(e) {
                ipcRenderer.send('goBack')
            });
            $(window).on('mousemove', function(event){
                ipcRenderer.send("mouse-x-y-pos-changed", { x: event.pageX, y: event.pageY })
            });
            ipcRenderer.on('set-page-title-reply', (event, title) => {
                console.log(`${title}`)
            });
            // ipcRenderer.on('getContextList', (event, sender) => {
            //     event.sender.send
            // });
        }
    }
}())

workspace.init();

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