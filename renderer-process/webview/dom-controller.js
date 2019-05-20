// extends global classes functions 
String.prototype.replaceAll = function(search, replace) { return this.split(search).join(replace); }
Element.prototype.remove = function() { this.parentElement.removeChild(this); }
Element.prototype.clear = function() { this.innerHTML = ""; }
NodeList.prototype.clear = function() { Array.prototype.forEach.call(this, e => { e.innerHTML = "" }); }
NodeList.prototype.addEventListener = function(event, callback) { Array.prototype.forEach.call(this, e => { e.addEventListener(event, callback); }); }

let UIContext = document.registerElement('ui-context', {
    prototype: Object.create(HTMLElement.prototype)
});
let contextFields = [
    {
        label: 'Create',
        submenu: [
            { 
                role: 'Element node',
                click: function() {
                    let node = document.createElement('div');
                    node.addEventListener('mouseup', elementSelected);
                    node.addEventListener('contextmenu', contextRightClickNode);
                    // here it needs to send ipc message for adding div to hierarchy
                    sendMainAsync('element-created-message', { 
                        node: nodeHierarchyAttributes(node), 
                        parentKey: uiContext.selectedNode.getAttribute('key') 
                    });
                    uiContext.selectedNode.append(node);
                } },
            { role: 'Text node' },
            { role: 'Script' },
            { role: 'CSS rule' },
        ],
        hotkey: 'F1'
    },
    {
        label: 'Remove',
        submenu: [
            { role: 'Object' },
            { role: 'Children' },
            { role: 'According to the rule: {...}' },
        ],
        hotkey: 'F2'
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'Element type' },
            { role: 'Attributes' },
            { role: 'CSS rules' },
            { role: 'Local styles' },
        ],
        hotkey: 'F3'
    },
    {
        label: 'Cut',
        hotkey: 'Ctrl+X'
    },
    {
        label: 'Copy',
        hotkey: 'Ctrl+C'
    },
    {
        label: 'Paste',
        hotkey: 'Ctrl+V'
    }
];

let tempDivision = {
    element: null,
    mouseStartPos: { x: null, y: null }
};
let elementsList = [];
let toolsEvents = {
    'cursor': (arg) => setSelectionArea(arg)
};
let selectedTool = sendMainSync('getSelectedTool');
let selectedElement = document.body.children[0];
let uiContext = new UIContext();
    uiContext.selectedNode = -1;

render();

function render() {
    sendMainAsync('onHierarchyCreated', treeConstructor(document.documentElement, true));  // Create tree of DOM nodes 
    document.documentElement.setAttribute('key', keyGenerator(8));
    tempDivision.element = document.createElement('div');                                  // Create block for selection tool 
    tempDivision.element.classList.add('tmpDiv');                                          // and add class 
    Array.prototype.forEach.call(elementsList, (element, i) => {
        elementsList[i].css = getCSSRules(element.node);
    });
    // context ui
    addListeners();
    UIContextRenderer();
    IPCAsync();                                                                            // After rendering call events()
} 
function UIContextRenderer() {
    Array.prototype.forEach.call(contextFields, fld => {
        let title = document.createElement('h3');
        let hotkey = document.createElement('p');
        title.innerHTML = fld.label;
        if(fld.hotkey !== undefined) {
            hotkey.innerHTML = fld.hotkey;
            title.append(hotkey);
        }
        uiContext.append(title);
        
        if(fld.submenu !== undefined) {
            Array.prototype.forEach.call(fld.submenu, sub => {
                let field = document.createElement('span');
                field.innerHTML = sub.role;
                field.addEventListener('click', sub.click);
                uiContext.append(field);
            });
        }
    });
    document.body.append(uiContext);
}
function IPCAsync(){
    addRendererListener('getSelectionArea-reply', (event, sender) => {                          // IPC: Get selected area parametres: (x0, y0); (x1, y1)
        Object.keys(sender).forEach(key => {
            tempDivision.element.style[key] = sender[key] + 'px';
        });
    });
    addRendererListener('element:mouseenter-message', (event, sender) => {
        let element = document.querySelector(`[key="${sender}"]`);
        // this.tempSelector = element.style.border;
        element.classList.add('hover-outline');
    });
    addRendererListener('element:mouseleave-message', (event, sender) => {
        let element = document.querySelector(`[key="${sender}"]`);
        element.classList.remove('hover-outline');
    });
    // addRendererListener('getComputedStyles-message', (event, sender) => {
    //     event.sender.send('getComputedStyles-reply', window.getComputedStyle(document.documentElement).getPropertyValue(`${sender}`));
    // });
    addRendererListener('set-css-rule', (event, sender) => {
        setCSSRule(sender);
    });
}  
function addListeners(){
    let nodes = document.querySelectorAll('*');
    nodes.addEventListener('click', function(e){
        e.stopPropagation();
        hideContextMenu();
    });
    nodes.addEventListener('contextmenu', contextRightClickNode);
    window.addEventListener('blur', function(){ hideContextMenu(); });
    document.addEventListener("wheel", function(e){
        if(!e.ctrlKey) return false;
        if(e.deltaY < 0) sendMainAsync('scale', true);
        else sendMainAsync('scale', false);
        sendMainAsync('mouse-pos-changed-message', { x: e.pageX, y: e.pageY });
    });
    document.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        setSelectionMouseStartPos(e.pageX, e.pageY);
        eventToggler(e);
    });
    document.addEventListener('mousemove', function(e) {
        if(e.buttons === 1) { 
            window.getSelection().removeAllRanges(); 
        }
        // e.stopPropagation();
        e.stopImmediatePropagation();
        eventToggler(e);
    });
    document.addEventListener('mouseup', (e) => {
        elementSelected(e);
        sendMainSync('resetSelectedTool');
        resetTempStyles();
    });
    document.addEventListener('keydown', function (e) {
        // e.preventDefault();
        if (e.keyCode == 27) { 
            selectNode(selectedElement, false);
            return;
        }
    });
}
// events 
function contextRightClickNode(e) {
    e.stopPropagation();
    uiContext.selectedNode = this;
    setUIContextPosition(e.pageX, e.pageY);
    uiContext.classList.add('ui-shown');
}
function elementSelected(e) {
    if(e.buttons !== 0) return;
    e.stopPropagation();
    sendMainAsync('element-selected-message', e.target.getAttribute('key'));
    sendMainAsync('sendElementStyle-message', getCSSRules(e.target));
}
// FUNCTIONS -------------------------------------------------------------
function setUIContextPosition(x, y){
    uiContext.style.left = `${x - window.scrollX}px`;
    uiContext.style.top = `${y - window.scrollY}px`;
}
function hideContextMenu() {
    uiContext.classList.remove('ui-shown');
}
function eventToggler(e){
    let node = e.target;
    sendMainAsync("mouse-pos-changed-message", { x: e.pageX, y: e.pageY });
    if(e.buttons !== 1) return;
    selectedTool = sendMainSync('getSelectedTool');
    switch(selectedTool){
        case -1:{ // Select element by mouse clicking
            selectNode(selectedElement, false);
            selectNode(node, true);
        } break;
        case "cursor": { // Select a range using cursor tool
            tempDivision.element.classList.remove('tmpDiv-disable');
            toolsEvents.cursor(e);
        } break;
    }
}
function setSelectionMouseStartPos(x, y) {
    tempDivision.mouseStartPos = { x: x, y: y };
    document.body.append(tempDivision.element); 
}
function setSelectionArea(e) {
    window.getSelection().removeAllRanges();
    sendMainAsync('getSelectionArea', { 
        lignment: e.shiftKey, 
        pageX: e.pageX, 
        pageY: e.pageY, 
        startX: tempDivision.mouseStartPos.x, 
        startY: tempDivision.mouseStartPos.y, 
        offsetX: $(tempDivision.element).offset().left, 
        offsetY: $(tempDivision.element).offset().top
        /*, scrollTop: document.documentElement.scrollTop*/ 
    });
}
function resetTempStyles() {
    tempDivision.element.classList.add('tmpDiv-disable');
    if(document.querySelector('.tmpDiv-disable') !== null)
        tempDivision.element.remove();
}
// addNode() { 
//     let node = this.tempDivision.element; // тута удалить el
//     let el = document.createElement('div');
//     let matches = ['width', 'height', 'left', 'top', 'border', 'borderRadius'];
//     // el.style.position = 'fixed';
//     Object.keys(node.style).forEach((key, i) => {
//         if(matches.indexOf(key) !== -1)
//         el.style[key] = getComputedStyle(node)[key];
//     });
//     this.resetTempStyles();
//     document.body.append(el);
// }
function selectNode(node, toggler){
    if(toggler){
        selectedElement = node;
        node.classList.add('hover-outline');
        return true;
    }
    node.classList.remove('hover-outline');
}
function keyGenerator(length) {
    let ret = "";
    while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
}
// setCSSRule({
//     fileName: 'standart.css',
//     selector: '*',
//     property: 'margin',
//     value: '50px'
// });
function setCSSRule(sender) {
    let file = sender.fileName;

    Array.prototype.forEach.call(document.styleSheets, sheet => {
        Array.prototype.forEach.call(sheet.cssRules, rule => {
            if(`${rule.selectorText}` === sender.selector) {
                // console.log(`${rule.selectorText}::${selector}`);
                rule.style[sender.property] = sender.value;
                console.log(rule.style[sender.property]);
                return;
            }
        });
        return;
    });
}

function getCSSRules(node) {
    let styleSheets = document.styleSheets;
    let CSSRules = [];
    Array.prototype.forEach.call(styleSheets, sheet => {
        Array.prototype.forEach.call(sheet.cssRules, rule => {
            let queryNodes = document.querySelectorAll(`${rule.selectorText}`);
            if (Array.from(queryNodes).indexOf(node) !== -1){
                let rewritedRule = {
                    cssStringifyText: CSSStringify(rule.cssText),
                    cssText: rule.cssText,
                    parentRule: rule.parentRule,
                    selectorText: rule.selectorText,
                    style: rule.style,
                    parentStyleSheet: {
                        href: rule.parentStyleSheet.href,
                        // media: rule.parentStyleSheet.media,
                        // ownerNode: rule.parentStyleSheet.ownerNode
                    },
                    computed: {
                        styles: window.getComputedStyle(node),
                        prototype: window.getComputedStyle(node).__proto__
                    }
                };
                CSSRules.push(rewritedRule);
            }
        });
    });
    // console.log(CSSRules);
    return CSSRules;
}
function CSSStringify(string){
    return string.replace(/{/, '{&emsp;').split(/;/).reduce((accumulator, currentValue) => { return `${accumulator};<br/>&emsp;${currentValue}`}).replace('&emsp; }', '}');
}
function treeConstructor(parentNode) {
    let nodes = null;
    let dom = null;
    if(parentNode.childNodes) {
        dom = [];
        nodes = parentNode.childNodes;
        nodes.forEach((node, i) => {
            if(node.nodeType === Node.ELEMENT_NODE) {
                elementsList.push({node: node});
                dom[i] = {};
                dom[i].arrayOfChild = treeConstructor(node);
                if (dom[i].arrayOfChild.length === 0) dom[i].arrayOfChild = null;
                dom[i].node = nodeHierarchyAttributes(node);
            }
        })
    };
    return dom;
}
function nodeHierarchyAttributes(node) {
    node.setAttribute('key', keyGenerator(8));
    return {
        key: node.getAttribute('key'),
        a_style: { 
            borderWidth: window.getComputedStyle(node).borderWidth, 
            borderColor: window.getComputedStyle(node).borderColor, 
            borderRadius: window.getComputedStyle(node).borderRadius, 
            background: window.getComputedStyle(node).backgroundColor
        } || null,
        b_blockName: node.tagName || null,
        c_id: node.id || null,
        d_class: node.classList[0] || null,
        e_href: node.getAttribute('href') || node.getAttribute('src') || null
    };
}