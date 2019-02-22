/// При резком перемещении курсора на svg изменение ширины ломается (т.к. svg через документ)
const $ = require('jquery')
let { ipcRenderer } = require('electron')



let hierarchy = (function(){
    // private local variables
    const ClassNameSpace = {
        ListContainerClass: 'h-container',
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

    // TREE RENDERER FUNCTION 
    function treeRenderer(list){
        let container = document.createElement('ul');   // creating parent
        container.classList.add('branch');
        
            if(list.arrayOfChild === null) {                // if parent has child 
            let child = listItemCreator(ClassNameSpace, list.node); // get childlist of child 
            return child;
        }
        let parent = listItemCreator(ClassNameSpace, list.node);
        container.append(parent);
        let childContainer = document.createElement('ul');
        childContainer.classList.add(ClassNameSpace.ListElementClass);
        Array.prototype.forEach.call(list.arrayOfChild, (element) => {
            let child = treeRenderer(element);
            childContainer.append(child);
        });
        container.append(childContainer);
        return container;
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
            $(document).on("mousemove", function(event){
                let e = event || window.event;
                if(AllowToSize && e.buttons === 1) {
                    $this.width(e.pageX - Margin - 2);
                    // Remove all selections from the window
                    window.getSelection().removeAllRanges(); 
                    invalidate();
                    return;
                }
                else
                    $(document).trigger("mouseup");
                
                if(e.pageX > MinCursorPos && e.pageX <  MaxCursorPos && !AllowToSize)
                    $this.addClass("right-border-sizing");
                
                else if(!AllowToSize)
                    $this.removeClass("right-border-sizing");
            });
            // mouseDown event
            $(document).on("mousedown", function(event){
                let e = event || window.event;
                if(e.pageX > MinCursorPos && e.pageX <  MaxCursorPos && e.buttons === 1){              
                    $this.addClass("right-border-sizing");
                    AllowToSize = true;
                }
            });
            // mouseUp event
            $(document).mouseup(function(event){
                $this.removeClass("right-border-sizing")
                AllowToSize = false
            });
            // mouseClick event
            $(document).on('click', '.branch > .h-item-child-container', function(e){
                // dblclick
                e.stopPropagation();
                $(this).parent().toggleClass('branch-show');
            });
            $(document).on('mouseenter', '.h-item-child-container', function(event){
                let key = this.getAttribute('key');
                if(key === null) return;
                // WEBVIEW
                document.getElementsByTagName('webview')[0].send('element:mouseenter-message', key);
            });
            $(document).on('mouseleave', '.h-item-child-container', function(event){
                let key = this.getAttribute('key');
                if(key === null) return;
                // WEBVIEW
                document.getElementsByTagName('webview')[0].send('element:mouseleave-message', key);
            });
            ipcRenderer.on('ctrl+Y', (event, sender) => {
                let w = ($this.width() !== 0) ? 0 : WidthCash
                WidthCash = ($this.width() !== 0) ? ($this.width() > 150) ? $this.width() : 300 : WidthCash
                $this.width(w)
                invalidate()
            })
            ipcRenderer.on('onHierarchyCreated-reply', (event, sender) => {
                // let tree;
                sender.forEach(element => {
                    tree = treeRenderer(element);
                    $('.h-container').append(tree);
                });
                
            })
        }
    }
})();

hierarchy.init();

function listItemCreator(ClassNameSpace, node) {
    let textNodes = /\b(?:P|A|STRONG|SUB|SUP)\b/;
    let child = document.createElement('li');
    child.classList.add(ClassNameSpace.ListItemElementClass);
    Object.keys(node).forEach(key => {
        let span = document.createElement('span');
        if(node[key] !== null) {
            switch(key) {
                case 'a_style': 
                    span.classList.add(ClassNameSpace.ListItemElementTypeClass); 
                    span.style.borderRadius = node[key].borderRadius; 
                    span.style.background = node[key].background; 
                    span.style.color = node[key].color;

                    if(node[key].borderWidth !== '0px') {
                        node[key].borderColor = node[key].borderColor.replaceAll(/[rgb()]/, '').split(',')
                            .reduce((accumulator, currentValue) => { return accumulator + parseInt(currentValue).toString(16); }, "");
                        while(node[key].borderColor.length < 6) node[key].borderColor += '0';
                        span.style.boxShadow = "0 0 0 1px #" + node[key].borderColor; 
                    }
                    if(node['b_blockName'].match(textNodes)) span.innerHTML = 'text';
                    break;
                    case 'b_blockName': 
                    span.classList.add(ClassNameSpace.ListItemElementNameClass); 
                    span.innerHTML = node[key]; 
                    break;
                case 'c_id': 
                    span.classList.add(ClassNameSpace.ListItemElementIdClass);  
                    span.innerHTML = node[key]; 
                    break;
                case 'd_class': 
                    span.classList.add(ClassNameSpace.ListItemElementClassnameClass);  
                    span.innerHTML = node[key]; 
                    break;
                case 'e_href': 
                    span.classList.add(ClassNameSpace.ListItemElementHrefClass);  
                    span.innerHTML = node[key]; 
                    break;
            }
            child.append(span);
            child.setAttribute('key', node['key']);
        }
    });
    return child;
}