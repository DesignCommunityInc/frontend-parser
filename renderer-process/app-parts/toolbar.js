let { ipcRenderer } = require('electron')
// Object.defineProperty(Toolbar, 'constant1', {
//     value: 33,
//     writable : false,
//     enumerable : true,
//     configurable : false
// });

class ToolBar{
    // private
    constructor(){
        this.container = document.querySelector('.tools');
        // let arr = []
        this.tools = [];
        // ipcRenderer.send('setToolsList', arr)
        this.tools.dom = ipcRenderer.sendSync('svgFilesRead');
        this.render();
    }
    render(){
        this.tools.dom.forEach((tool, i) => {
            tool = this.createElementFromString(tool)
            this.container.append(tool)
            tool.addEventListener('click', function(e){
                if(e.buttons === 0){ 
                    ipcRenderer.send('setSelectedTool', this.id);
                }
            });
        })
    }
    // FUNCTIONS 
    createElementFromString(str) {
        var div = document.createElement('div');
        div.innerHTML = str.trim();
        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }
}

module.exports = new ToolBar();