/// При резком перемещении курсора на svg изменение ширины ломается (т.к. svg через документ)
// const $ = require('jquery')
let { ipcRenderer } = require('electron')

$(document).ready(function(){
    
    let tree = new Tree();

    $(document).on("mousemove", function(event){
        let e = event || window.event;
        tree.addResizingStyles(
            tree.isAvailableResizing(e.pageX)
        );
        if(e.buttons !== 1) return;      
        tree.resize(e.pageX);
    });
    // mouseDown event
    $(document).on("mousedown", function(event){
        let e = event || window.event;
        if(e.buttons !== 1 || !tree.isAvailableResizing(e.pageX)) return;
        tree.allowToSize = true;
        tree.container[0].classList.add('right-border-sizing');     
    });
    // mouseUp event
    $(document).mouseup(function(event){
        let e = event || window.event;
        // if(!tree.isAvailableResizing(e.pageX)) return;
        tree.allowToSize = false;
        tree.container[0].classList.remove('right-border-sizing'); 
    });
    // mouseClick event
    $(document).on('click', '.branch > .h-item-child-container', function(event){
        let e = event || window.event;
        e.stopPropagation();
        $(this).parent().toggleClass('branch-show');
    });
    $(document).on('mouseenter', '.h-item-child-container', function(){
        let key = this.getAttribute('key');
        if(key === null) return;
        // WEBVIEW
        document.getElementsByTagName('webview')[0].send('element:mouseenter-message', key);
    });
    $(document).on('mouseleave', '.h-item-child-container', function(){
        let key = this.getAttribute('key');
        if(key === null) return;
        // WEBVIEW
        document.getElementsByTagName('webview')[0].send('element:mouseleave-message', key);
    });
    // let branch = null;
    // $(document).on('mouseenter', '.branch', function(event){
    //     if(branch !== this && branch !== null) branch.classList.remove('branch-hover');
    //     let e = event || window.event;
    //     e.stopPropagation();
    //     this.classList.add('branch-hover');
    //     branch = this;
    // });  
    // $(document).on('mouseleave', '.branch', function(){
    //     this.classList.remove('branch-hover');
    //     branch = this;
    // });  
});

class Tree {
    // private local variables
    constructor(){
        this.classNameSpace = {
            containerClass: 'h-container',
            elementClass: 'h-item',
            itemElementClass: 'h-item-child-container',
            itemElementTypeClass: 'h-item-type',
            itemElementNameClass: 'h-item-blockname',
            itemElementIdClass: 'h-item-id',
            itemElementClassnameClass: 'h-item-classname',
            itemElementHrefClass: 'h-item-href'
        };
        this.container = null;
        this.maxCursorPos = null;
        this.minCursorPos = null;
        this.allowToSize = false,
        this.margin = null;
        this.widthCash = null;
        this.dom = [];
        this.tree = null;

        this.init();
    }
    init(){ 
        this.container = $(".hierarchy");
        this.widthCash = this.container.width();
        this.margin = parseInt($('html').css("--tools-width").trim(" px", '')); // hierarchy diapason width min
        this.render();
    }
    async render(){
        this.invalidate();
        this.IPCSync();
        await this.IPCAsync();
    }
    async IPCAsync(){
        ipcRenderer.on('onHierarchyCreated-reply', (event, sender) => {
            sender.forEach(element => {
                this.tree = this.treeRenderer(element);
                this.container.find(`.${this.classNameSpace.containerClass}`).append(this.tree);
            });
        });
        ipcRenderer.on('ctrl+Y', (event, sender) => {
            let w = (this.container.width() !== 0) ? 0 : this.widthCash;
            this.widthCash = ($this.width() !== 0) ? (this.container.width() > 150) ? this.container.width() : 300 : this.widthCash;
            this.container.width(w);
            this.invalidate();
        });
    }
    IPCSync(){

    }

    // FUNCTIONS

    invalidate() {
        this.maxCursorPos = this.container.width() + 5 + this.margin; // hierarchy diapason width max _d -> diapason
        this.minCursorPos = this.container.width() - 5 + this.margin; // hierarchy diapason width min
        $(window).trigger('workspace-width-changed', { left: this.container.width() + this.margin });
        return false;
    }
    isAvailableResizing(x){
        return x > this.minCursorPos && x <  this.maxCursorPos && !this.allowToSize;
    }
    addResizingStyles(available){
        if(available)
            this.container.addClass("right-border-sizing");
        else if(!this.allowToSize)
            this.container.removeClass("right-border-sizing");

        return false;
    }
    resize(x){
        if(this.allowToSize) {
            this.container.width(x - this.margin - 2);
            // Remove all selections from the window
            window.getSelection().removeAllRanges(); 
            this.invalidate();
            return false;
        }      
        else
            $(document).trigger("mouseup");
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
        childContainer.classList.add(this.classNameSpace.elementClass);
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
        child.classList.add(this.classNameSpace.itemElementClass);
        Object.keys(node).forEach(key => {
            let span = document.createElement('span');
            if(node[key] !== null) {
                switch(key) {
                    case 'a_style': 
                        span.classList.add(this.classNameSpace.itemElementTypeClass); 
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
                        span.classList.add(this.classNameSpace.itemElementNameClass); 
                        span.innerHTML = node[key]; 
                        break;
                    case 'c_id': 
                        span.classList.add(this.classNameSpace.itemElementIdClass);  
                        span.innerHTML = node[key]; 
                        break;
                    case 'd_class': 
                        span.classList.add(this.classNameSpace.itemElementClassnameClass);  
                        span.innerHTML = node[key]; 
                        break;
                    case 'e_href': 
                        span.classList.add(this.classNameSpace.itemElementHrefClass);  
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

