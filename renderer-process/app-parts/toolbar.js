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
        this.tools = {
            dom: [],
            ids: []
        };
        // ipcRenderer.send('setToolsList', arr)
        this.tools.dom = ipcRenderer.sendSync('svgFilesRead');
        this.render()
    }
    render(){
        let tools = this.tools;
        tools.dom.forEach((tool, i) => {
            tools.dom[i] = this.createElementFromString(tool)
            tools.ids.push(tools.dom[i].getAttribute('id'))
            this.container.append(tools.dom[i])
        })
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

module.exports = new ToolBar();