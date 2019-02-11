const $ = require('jquery')
let { ipcRenderer } = require('electron')

let toolbar = (function(){
    // private
    const container = $('.tools')[0]
    // let arr = []
    let tools = {
        dom: [],
        ids: []
    }
    return{
        init: function(){
            // ipcRenderer.send('setToolsList', arr)
            tools.dom = ipcRenderer.sendSync('svgFilesRead')
            this.render()
        },
        render: function(){
            tools.dom.forEach((tool, i) => {
                tools.dom[i] = createElementFromString(tool)
                tools.ids.push($(tools.dom[i]).attr('id'))
                container.append(tools.dom[i])
            })
            this.events()
        },
        events: function(){
            $('.tool').on('click', function(e) {
                if(e.buttons === 0){
                    ipcRenderer.send('setSelectedTool', tools.ids.indexOf($(this).attr('id')))
                }
            })
        }
    }
}())

toolbar.init()

function createElementFromString(str) {
    var div = document.createElement('div')
    div.innerHTML = str.trim()
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild
}