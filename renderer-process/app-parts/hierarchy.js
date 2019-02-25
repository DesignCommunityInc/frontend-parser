/// При резком перемещении курсора на svg изменение ширины ломается (т.к. svg через документ)
const $ = require('jquery')
let { ipcRenderer } = require('electron')

$(document).ready(function(){
    
    let tree = new Tree();

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
    
})
class Element extends Node{
    constructor(){
        super();

    }

    mouseLeave(){

    }
    mouseOver(){

    }
}
class Tree {
    // private local variables
    constructor(){
        this.ClassNameSpace = {
            ListContainerClass: 'h-container',
            ListElementClass: 'h-item',
            ListItemElementClass: 'h-item-child-container',
            ListItemElementTypeClass: 'h-item-type',
            ListItemElementNameClass: 'h-item-blockname',
            ListItemElementIdClass: 'h-item-id',
            ListItemElementClassnameClass: 'h-item-classname',
            ListItemElementHrefClass: 'h-item-href'
        };
        this.container = null;
        this.maxCursorPos = null;
        this.minCursorPos = null;
        this.allowToSize = false,
        this.margin = null;
        this.widthCash = null;
        this.dom = [];
        this.tree = null;
    }
    init(){ 
        this.container = $(".hierarchy");
        this.widthCash = this.container.width();
        this.margin = parseInt($('html').css("--tools-width").trim(" px", '')); // hierarchy diapason width min
        this.render();
    }
    render(){
        this.invalidate();
        this.IPC();
    }
    IPC(){
        // mouseMove event
        ipcRenderer.on('onHierarchyCreated-reply', (event, sender) => {
            sender.forEach(element => {
                this.tree = treeRenderer(element);
                $('.h-container').append(this.tree);
            });
        });
        ipcRenderer.on('ctrl+Y', (event, sender) => {
            let w = (this.container.width() !== 0) ? 0 : this.widthCash;
            this.widthCash = ($this.width() !== 0) ? (this.container.width() > 150) ? this.container.width() : 300 : this.widthCash;
            this.container.width(w);
            this.invalidate();
        });
    }
    
    invalidate() {
        this.maxCursorPos = this.container.width() + 5 + this.margin; // hierarchy diapason width max _d -> diapason
        this.minCursorPos = this.container.width() - 5 + this.margin; // hierarchy diapason width min
        $(window).trigger('workspace-width-changed', { left: this.container.width() + this.margin });
    }
    // element_MouseLeave(key){
    //     let key = this.getAttribute('key');
    //     if(key === null) return;
    //     // WEBVIEW
    //     document.getElementsByTagName('webview')[0].send('element:mouseleave-message', key);
    // }
    // TREE RENDERER FUNCTION 
    treeRenderer(list){
        let container = document.createElement('ul');   // creating parent
        container.classList.add('branch');
        
            if(list.arrayOfChild === null) {                // if parent has child 
            let child = this.listItemCreator(list.node); // get childlist of child 
            return child;
        }
        let parent = this.listItemCreator(list.node);
        container.append(parent);
        let childContainer = document.createElement('ul');
        childContainer.classList.add(ClassNameSpace.ListElementClass);
        Array.prototype.forEach.call(list.arrayOfChild, (element) => {
            let child = this.treeRenderer(element);
            childContainer.append(child);
        });
        container.append(childContainer);
        return container;
    }
    listItemCreator(node) {
        let textNodes = /\b(?:P|A|STRONG|SUB|SUP)\b/;
        let child = document.createElement('li');
        child.classList.add(this.ClassNameSpace.ListItemElementClass);
        Object.keys(node).forEach(key => {
            let span = document.createElement('span');
            if(node[key] !== null) {
                switch(key) {
                    case 'a_style': 
                        span.classList.add(this.ClassNameSpace.ListItemElementTypeClass); 
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
                        span.classList.add(this.ClassNameSpace.ListItemElementNameClass); 
                        span.innerHTML = node[key]; 
                        break;
                    case 'c_id': 
                        span.classList.add(this.ClassNameSpace.ListItemElementIdClass);  
                        span.innerHTML = node[key]; 
                        break;
                    case 'd_class': 
                        span.classList.add(this.ClassNameSpace.ListItemElementClassnameClass);  
                        span.innerHTML = node[key]; 
                        break;
                    case 'e_href': 
                        span.classList.add(this.ClassNameSpace.ListItemElementHrefClass);  
                        span.innerHTML = node[key]; 
                        break;
                }
                child.append(span);
                child.setAttribute('key', node['key']);
            }
        });
        return child;
    }
};

