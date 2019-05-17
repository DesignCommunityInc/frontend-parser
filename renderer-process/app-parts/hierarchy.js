/// При резком перемещении курсора на svg изменение ширины ломается (т.к. svg через документ)
// const $ = require('jquery')
let { ipcRenderer } = require('electron')

class Tree {
    // private local variables
    constructor(){
        this.classNameSpace = {
            sectionClass: 'hierarchy',
            containerClass: 'h-container',
            elementClass: 'h-item',
            branchClass: 'branch',
            branchShow: 'branch-show',
            branchActive: 'branch-active',
            itemElementClass: 'h-item-child-container',
            itemElementTypeClass: 'h-item-type',
            itemElementNameClass: 'h-item-blockname',
            itemElementIdClass: 'h-item-id',
            itemElementClassnameClass: 'h-item-classname',
            itemElementHrefClass: 'h-item-href'
        };
        this.container = null;
        this.temporaryActive = document.body;
        this.maxCursorPos = null;
        this.minCursorPos = null;
        this.allowToSize = false;
        this.margin = null;
        this.widthCash = 0;
        console.log(this.widthCash);
        this.dom = [];
        // this.tree = null;

        this.init();
    }
    init(){ 
        this.container = document.querySelector(".hierarchy");
        this.widthCash = this.container.style.width;
        this.margin = parseInt($('html').css("--tools-width").trim("px", '')); // hierarchy diapason width min
        this.render();
    }
    async render(){
        this.invalidate();
        await this.IPCAsync();
        this.DOMEvents();
    }
    async IPCAsync(){
        ipcRenderer.on('onHierarchyCreated-reply', (event, sender) => {
            sender.filter(element => element.node.b_blockName.match(/\b(?:BODY|HEAD)\b/)).forEach(element => {
                let tree = this.treeRenderer(element);
                if(element.node.b_blockName === 'BODY'){
                    tree.classList.add('branch-show', 'branch-active');
                    this.temporaryActive = tree;
                }
                this.container.querySelector(`.${this.classNameSpace.containerClass}`).append(tree);
            });
        });
        ipcRenderer.on('element-selected-reply', (event, sender) => {
           this.branchElementSelected(sender);
        });
        ipcRenderer.on('clear-tree-reply', (event, sender) => {
            this.clearTree();
        });
        ipcRenderer.on('ctrl+Y', (event, sender) => {
            let currentWidth = parseInt(this.container.style.width);
            let w = (currentWidth !== 0) ? 0 : this.widthCash;
            this.widthCash = (currentWidth !== 0) ? ((currentWidth > 150) ? currentWidth : 300) : this.widthCash;
            this.container.style.width = `${w}px`;
            this.invalidate();
        });
    }
    DOMEvents(){
        let that = this;
        document.addEventListener("mousemove", function(e){
            that.addResizingStyles(that.isAvailableResizing(e.pageX));
            switch(e.buttons) {
                case 1: {
                    that.resize(e.pageX);
                }
            }
        });
        document.addEventListener("mousedown", function(e){
            switch(e.buttons) {
                case 1: {
                    that.sizable(that.isAvailableResizing(e.pageX));
                }
            }   
        });
        document.addEventListener('mouseup', function(e){
            that.sizable(false);
        });
    }
    // FUNCTIONS
    invalidate() {
        this.maxCursorPos = this.container.offsetWidth + 5 + this.margin; // hierarchy diapason width max _d -> diapason
        this.minCursorPos = this.container.offsetWidth - 5 + this.margin; // hierarchy diapason width min
        // $(window).trigger('workspace-width-changed', { left: this.container.offsetWidth + this.margin });
        return false;
    }
    isAvailableResizing(x){
        return x > this.minCursorPos && x <  this.maxCursorPos && !this.allowToSize;
    }
    addResizingStyles(access){
        if(access){
            this.container.classList.add("right-border-sizing");
        }
        else if(!this.allowToSize)
            this.container.classList.remove("right-border-sizing");

        return false;
    }
    sizable(truth){
        if(truth){
            this.allowToSize = true;
            this.container.classList.add('right-border-sizing');
            return;
        }
        this.allowToSize = false;
        this.container.classList.remove('right-border-sizing');
    }
    resize(x){
        if(this.allowToSize) {
            let newWidth = x - this.margin - 2;
            newWidth = (newWidth < 0) ? 0 : newWidth;
            this.container.style.width = `${newWidth}px`;
            // Remove all selections from the window
            window.getSelection().removeAllRanges(); 
            this.invalidate();
            return false;
        }      
        else
            $(document).trigger("mouseup");
    }
    clearTree(){
        let container = document.getElementsByClassName(`${this.classNameSpace.containerClass}`)[0];
        container.clear();
        // while (container.firstChild) {
        //     container.removeChild(container.firstChild);
        // }
    }
    // TREE RENDERER FUNCTION 
    branchElementSelected(key) {
        let element = document.querySelector(`[key="${key}"]`);
        let activeElements = document.querySelectorAll(`.${this.classNameSpace.branchShow}`);
        element.classList.add('h-item-child-selected');
        let foo = (parentElement) => {
            if (parentElement === null) return;
            parentElement.classList.add(`${this.classNameSpace.branchShow}`)
            foo(parentElement.parentElement.closest(`.${this.classNameSpace.branchClass}`))    
            // parentElement.classList.add(`${this.classNameSpace.branchActive}`)
        }

        Array.prototype.forEach.call(activeElements, e => {
            e.classList.remove(`${this.classNameSpace.branchShow}`);
        });
        foo(element.closest(`.${this.classNameSpace.branchClass}`))
        setTimeout(() => {
            element.classList.remove('h-item-child-selected');
        }, 500)
    }
    treeRenderer(list){
        let container = document.createElement('ul');   // creating parent
        container.classList.add('branch');
        let _this = this;
        container.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.add('branch-active');
            if(_this.temporaryActive !== this) {
                _this.temporaryActive.classList.remove('branch-active');
                _this.temporaryActive = this;
            }
        });
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
        container.querySelectorAll(`.${this.classNameSpace.itemElementClass}`).addEventListener('dblclick', function(e){ 
            e.stopPropagation(); 
            this.parentNode.classList.toggle('branch-show');
        });
        childContainer.querySelectorAll(`.${this.classNameSpace.itemElementClass}`).addEventListener('mouseenter', function(){
            if(this.getAttribute('key') !== null) webview.send('element:mouseenter-message', this.getAttribute('key'));
        });
        childContainer.querySelectorAll(`.${this.classNameSpace.itemElementClass}`).addEventListener('mouseleave', function(){
            if(this.getAttribute('key') !== null) webview.send('element:mouseleave-message', this.getAttribute('key'));            
        });
        container.append(childContainer);
        return container;
    }
    addNode(node, parentKey) {
        let parentElement = document.querySelector(`[key="${parentKey}"]`).closest('.branch');
        let listToPushNode = parentElement.querySelector('.h-item');
        listToPushNode.append(listItemCreator(node));
        branchElementSelected(node.key);
    }
    listItemCreator(node) {
        let textNodes = /\b(?:P|A|STRONG|SUB|SUP|H1|H2|H3|H4|H5|H6)\b/;
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
                            node[key].borderColor = node[key].borderColor.replaceAll(/[rgb()]/, '').split(',').reduce((accumulator, currentValue) => { return accumulator + parseInt(currentValue).toString(16); }, "");
                            while(node[key].borderColor.length < 6) node[key].borderColor += '0';
                            span.style.boxShadow = "0 0 0 1px #" + node[key].borderColor; 
                        }
                        if(node['b_blockName'].match(textNodes)) span.innerHTML = 'text'; 
                        break;
                    case 'b_blockName': span.className = this.classNameSpace.itemElementNameClass;
                        span.innerHTML = node[key];break;
                    case 'c_id': span.className = this.classNameSpace.itemElementIdClass;
                        span.innerHTML = node[key]; break;
                    case 'd_class': span.className = this.classNameSpace.itemElementClassnameClass;
                        span.innerHTML = node[key]; break;
                    case 'e_href': span.className = this.classNameSpace.itemElementHrefClass;
                        span.innerHTML = node[key]; break;
                }
                child.append(span);
                child.setAttribute('key', node['key']);
            }
        });
        return child;
    }
};

module.exports = new Tree();