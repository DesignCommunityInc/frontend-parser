// when console log this, it shows tempdivision

class DOMController {
    constructor(){
        this.tempDivision = {
            element: null,
            mouseStartPos: { x: null, y: null }
        };
        this.render();
    }

    async render(){
        sendMainAsync('onHierarchyCreated', this.treeConstructor(document.documentElement, true));  // Create tree of DOM nodes 
        this.tempDivision.element = document.createElement('div');                                  // Create block for selection tool 
        this.tempDivision.element.classList.add('tmpDiv');                                          // and add class 
        await this.IPCAsync();                                                                      // After rendering call events()
    } 

    async IPCAsync(){
        addRendererListener('getSelectionArea-reply', (event, sender) => {                          // IPC: Get selected area parametres: (x0, y0); (x1, y1)
            Object.keys(sender).forEach(key => {
                this.tempDivision.element.style[key] = sender[key] + 'px';
            });
        });
        addRendererListener('element:mouseenter-message', (event, sender) => {
            let element = document.querySelector('[key="'+`${sender}`+'"]');
            this.tempSelector = element.style.border;
            element.classList.add('hover-outline');
        });
        addRendererListener('element:mouseleave-message', (event, sender) => {
            let element = document.querySelector('[key="'+`${sender}`+'"]');
            element.classList.remove('hover-outline');
        });
    }
    
    // FUNCTIONS -------------------------------------------------------------
    
    setSelectionMouseStartPos(e) {
        document.body.append(this.tempDivision.element); 
        this.tempDivision.mouseStartPos = { x: e.pageX, y: e.pageY };
    }
    setSelectionArea(e) {
        let selectedTool = sendMainSync('getSelectedTool');
        if(selectedTool === 0){
            window.getSelection().removeAllRanges();
            sendMainAsync('getSelectionArea', { alignment: e.shiftKey, pageX: e.pageX, pageY: e.pageY, startX: this.tempDivision.mouseStartPos.x, startY: this.tempDivision.mouseStartPos.y, offsetX: $(this.tempDivision.element).offset().left, offsetY: $(this.tempDivision.element).offset().top/*, scrollTop: document.documentElement.scrollTop*/ });
            if(selectedTool === 2) $(this.tempDivision.element).css({'border-radius': '50%'});
        }
    }
    resetTempStyles() {
        this.tempDivision.element.style.width = "0px";
        this.tempDivision.element.style.height = "0px";
        this.tempDivision.element.style.top = "0px";
        this.tempDivision.element.style.bottom = "0px";
        $(this.tempDivision.element).remove();
    }
    addNode() { 
        let node = this.tempDivision.element; // тута удалить el
        let el = document.createElement('div');
        let matches = ['width', 'height', 'left', 'top', 'border', 'borderRadius'];
        // el.style.position = 'fixed';
        Object.keys(node.style).forEach((key, i) => {
            if(matches.indexOf(key) !== -1)
            el.style[key] = getComputedStyle(node)[key];
        });
        this.resetTempStyles();
        document.body.append(el);
    }
    keyGenerator(length) {
        let ret = "";
        while (ret.length < length) {
          ret += Math.random().toString(16).substring(2);
        }
        return ret.substring(0,length);
    }
    getStyle(className) {
        let css = document.styleSheets;
        let cssRules = [];
        Array.prototype.forEach.call(css, style => {
            let classes = style.cssRules;
            Array.prototype.forEach.call(classes, (_class) => {
                if (_class.selectorText === className) {
                    (_class.cssText) ? cssRules.push(_class.cssText) : '';
                }
            });
        });
        console.log(cssRules);
        return cssRules;
    }
    treeConstructor(parentNode) {
        let nodes = null;
        let dom = null;
        if(parentNode.childNodes) {
            dom = [];
            nodes = parentNode.childNodes;
            nodes.forEach((node, i) => {
                if(node.nodeType === Node.ELEMENT_NODE) {
                    dom[i] = {};
                    dom[i].arrayOfChild = this.treeConstructor(node);
                    if (dom[i].arrayOfChild.length === 0) dom[i].arrayOfChild = null;
                    node.setAttribute('key', this.keyGenerator(8));
                    dom[i].node = {};
                    dom[i].node.key = node.getAttribute('key');
                    dom[i].node.a_style = { borderWidth: window.getComputedStyle(node).borderWidth, borderColor: window.getComputedStyle(node).borderColor, borderRadius: window.getComputedStyle(node).borderRadius, background: window.getComputedStyle(node).backgroundColor} || null;
                    dom[i].node.b_blockName = node.tagName || null;
                    dom[i].node.c_id = node.id || null;
                    dom[i].node.d_class = node.classList[0] || null;
                    dom[i].node.e_href = node.getAttribute('href') || node.getAttribute('src') || null;
                }
            })
        };
        return dom;
    }
}

module.exports = new DOMController();