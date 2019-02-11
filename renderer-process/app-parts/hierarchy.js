/// При резком перемещении курсора на svg изменение ширины ломается (т.к. svg через документ)
const $ = require('jquery')
let { ipcRenderer } = require('electron')

let hierarchy = (function(){
    // private local variables
    const ClassNameSpace = {
        ListElementClass: 'h-item',
        ListItemElementClass: 'h-item-child-container',
        ListItemElementTypeClass: 'h-item-type',
        ListItemElementNameClass: 'h-item-blockname',
        ListItemElementIdClass: 'h-item-id',
        ListItemElementClassnameClass: 'h-item-classname',
        ListItemElementHrefClass: 'h-item-href'
    };
    let $this,
        MaxCursorPos,
        MinCursorPos,
        AllowToSize = false,
        Margin,
        WidthCash;
        let dom = [];
        let tree = null;
    // private functions 
    function invalidate() {
        MaxCursorPos = $this.width() + 5 + Margin; // hierarchy diapason width max _d -> diapason
        MinCursorPos = $this.width() - 5 + Margin; // hierarchy diapason width min

        $(window).trigger('workspace-width-changed', { left: $this.width() + Margin })
    }
    return {
        init: function(){ 
            $this = $(".hierarchy");
            WidthCash = $this.width();
            Margin = parseInt($('html').css("--tools-width").trim(" px", '')); // hierarchy diapason width min
            this.render();
        },
        render: function(){
            invalidate();
            this.event();
        },
        event: function(){
            // mouseMove event
            $(window).on("mousemove", function(event){
                let e = event || window.event;
                if(AllowToSize && e.buttons === 1) {
                    $this.width(e.pageX - Margin - 2);
                    // Remove all selections from the window
                    window.getSelection().removeAllRanges(); 
                    invalidate();
                    return;
                }
                else
                    $(window).trigger("mouseup");
                
                if(e.pageX > MinCursorPos && e.pageX <  MaxCursorPos && !AllowToSize)
                    $this.addClass("right-border-sizing");
                
                else if(!AllowToSize)
                    $this.removeClass("right-border-sizing");
            });
            // mouseDown event
            $(window).on("mousedown", function(event){
                let e = event || window.event;
                if(e.pageX > MinCursorPos && e.pageX <  MaxCursorPos && e.buttons === 1){              
                    $this.addClass("right-border-sizing");
                    AllowToSize = true;
                }
            });
            // mouseUp event
            $(window).mouseup(function(event){
                $this.removeClass("right-border-sizing")
                AllowToSize = false
            });
            ipcRenderer.on('ctrl+Y', (event, sender) => {
                let w = ($this.width() !== 0) ? 0 : WidthCash
                WidthCash = ($this.width() !== 0) ? ($this.width() > 150) ? $this.width() : 300 : WidthCash
                $this.width(w)
                invalidate()
            })
            ipcRenderer.on('onHierarchyCreated-reply', (event, sender) => {
                console.log(sender);
                let tree = treeRenderer(sender);
                $('.h-container').append(tree);
            })
        }
    }
})();

hierarchy.init();

function treeRenderer(dom){
    let container = null;
    dom.forEach(element => {
        if(node.nodeType === 1) {
            if(node.childNodes.length > 0){
                node.childNodes.forEach(childNode => {
                    container = document.createElement('ul');
                    container.append(treeRenderer(childNode))   
                });
            }
            else{
                container = document.createElement('li');
                container.append(element.node);
            }
        }
    });
    return container;
    // return container;
}