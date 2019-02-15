const $ = require('jquery')
let { ipcRenderer } = require('electron')

let domController = (function(){
    // private 
    let tempDivision = {
        element: null,
        mouseStartPos: {
            x: null,
            y: null
        }
    }
    let dom = []
    return {
        init: function(){
            tempDivision.element = document.createElement('div')
            tempDivision.element.classList.add('tmpDiv')
            this.render()
        },
        render: function(){
            // console.log(treeConstructor(document.documentElement, true));
            ipcRenderer.send('onHierarchyCreated', treeConstructor(document.documentElement, true));
            // console.log(treeConstructor(document.documentElement, true));
            $(tempDivision.element).load('../../sections/native-ui/tempDivision.html')
            this.event()
        },
        event: function(){
            ipcRenderer.on('getSelectionArea-reply', (event, sender) => {
                $(tempDivision.element).css({ 
                    'width' : sender.width, 'left' : sender.left,
                    'height' : sender.height, 'top' : sender.top
                })
            })
            $(window).on('mousedown', function(e){
                tempDivision.mouseStartPos = { x: e.pageX, y: e.pageY }
            })
            $(window).bind('mousemove', function(e) {
                let selectedTool = ipcRenderer.sendSync('getSelectedTool')
                if(e.buttons === 1 && selectedTool !== -1){
                    $('body').append(tempDivision.element)
                    window.getSelection().removeAllRanges()
                    ipcRenderer.send('getSelectionArea', {
                        alignment: e.shiftKey,
                        pageX: e.pageX, pageY: e.pageY,
                        startX: tempDivision.mouseStartPos.x,
                        startY: tempDivision.mouseStartPos.y,
                        offsetX: $(tempDivision.element).offset().left,
                        offsetY: $(tempDivision.element).offset().top
                    })
                    if(selectedTool === 2) {
                        $(tempDivision.element).css({'border-radius': '50%'})
                    }
                }
            })
            $(window).mouseup(function(e){
                $(window).trigger('DOMDraw', tempDivision.element)
                $(tempDivision.element).css({ 'width': 0, 'height': 0, 'border-radius': '2px' })
                $(tempDivision.element).remove()
            })
            $(window).on('DOMDraw', (event, sender) => {
                let el = document.createElement('div')
                $(el).css({
                    position: 'fixed',
                    width: $(sender).css('width'),
                    height: $(sender).css('height'),
                    left: $(sender).css('left'),
                    top: $(sender).css('top'),
                    border: $(sender).css('border'),
                    'border-radius': $(sender).css('border-radius')
                })
                $('body').append(el)
            })
        }
    }
    
}())

domController.init()

function treeConstructor(parentNode) {
    let nodes = null;
    let dom = null;
    if(parentNode.childNodes) {
        dom = [];
        nodes = parentNode.childNodes;
        nodes.forEach((node, i) => {
            if(node.nodeType === 1) {
                dom[i] = {};
                dom[i].arrayOfChild = treeConstructor(node);
                if (dom[i].arrayOfChild.length === 0) dom[i].arrayOfChild = null;
                dom[i].node = {};
                dom[i].node.blockName = node.tagName || null;
                dom[i].node.border = { width: node.style.borderWidth, color: node.style.borderColor } || null;
                dom[i].node.background = node.style.background || null;
                dom[i].node.id = node.id || null;
                dom[i].node.href = node.getAttribute('href') || null;
                dom[i].node.class = node.classList[0] || null;
            }
        })
    };
    return dom;
}
