// const $ = require('jquery')
let { ipcRenderer } = require('electron')
// Object.defineProperty(Toolbar, 'constant1', {
//     value: 33,
//     writable : false,
//     enumerable : true,
//     configurable : false
// });

$(document).ready(function(){

    let toolbar = new Toolbar();

    $('.tool').on('click', function(e) {
        if(e.buttons === 0)
            toolbar.setSelectedTool(this);
    });

});
class Toolbar{
    // private
    constructor(){
        this.container = $('.tools')[0]
        // let arr = []
        this.tools = {
            dom: [],
            ids: []
        }
        this.init();
    }
    init(){
        // ipcRenderer.send('setToolsList', arr)
        this.tools.dom = ipcRenderer.sendSync('svgFilesRead')
        this.render()
    }
    render(){
        let tools = this.tools;
        tools.dom.forEach((tool, i) => {
            tools.dom[i] = this.createElementFromString(tool)
            tools.ids.push($(tools.dom[i]).attr('id'))
            this.container.append(tools.dom[i])
        })
        this.IPC()
    }
    IPC(){
        
    }
    // FUNCTIONS 
    
    setSelectedTool(element){
        ipcRenderer.send('setSelectedTool', this.tools.ids.indexOf($(element).attr('id')));
    }
    createElementFromString(str) {
        var div = document.createElement('div');
        div.innerHTML = str.trim();
        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }
}