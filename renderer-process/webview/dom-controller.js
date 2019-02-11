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
            // ipcRenderer.send('onHierarchyCreated', treeConstructor(document.documentElement, true));
            console.log(treeConstructor(document.documentElement, true));
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

// function recurseDomChildren(start, output)
// {
//     let nodes;
//     let dom = []
//     if(start.childNodes)
//     {
//         nodes = start.childNodes;
//         nodes.array.forEach((node, i) => {
//             dom.push({
//                 node: node,
//                 childNodes: loopNodeChildren(dom, output)
//             });
//         });
//     }
//     return dom;
// }
function treeConstructor(parentNode) {
    let nodes = null;
    let dom = null;
    if(parentNode.childNodes) {
        dom = [];
        nodes = parentNode.childNodes;
        nodes.forEach((node, i) => {
            // if(node.nodeType === 1) {
                dom[i] = {
                    node: node,
                    child: treeConstructor(node)
                };
                // dom[i].push(node);
                // dom[i].push(treeConstructor(node));
                })
            // }
    };
    return dom;
}
// function loopNodeChildren(dom, output)
// {
//     let node;
//     // let localDom = [];
//     for(let i = 0; i < dom.length; i++)
//     {
//         node = dom[i];
//         // if(output)
//         // {
//         //     localDom.push(outputNode(node));
//         // }
//         if(node.childNodes)
//         {
//             dom[i] = {
//                 node: 
//                 childNodes: recurseDomChildren(node, output); 
//             }
//         }
//     }
//     return localDom;
// }

// function outputNode(node)
// {
//     let whitespace = /^\s+$/g;
//     if(node.nodeType === 1)
//     {
//         let className = node.getAttribute('class') || undefined;
//         let id = node.getAttribute('id') || undefined;
//         let href = node.getAttribute('href') || undefined;
//         let parent = node.parentNode
//         let attributes = {
//             className: className,
//             id: id,
//             href: href
//         };
//         ipcRenderer.send('addDomElement', attributes);
//     }
//     else if(node.nodeType === 3)
//     {
//         //clear whitespace text nodes
//         node.data = node.data.replace(whitespace, "");
//         // node.classList = getAttribute('class')
//         // if(node.data)
//         // {
//         //     console.log('text: ' + node.data); 
//         // }
//     }  
//     // return node;
// }