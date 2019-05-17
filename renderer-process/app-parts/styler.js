
class Styler {
    constructor(){
        this.container = document.querySelector('.styler');
        this.regexp = {
            hasChildren: /\b(?:margin|padding|backgroundPosition)\b/,
            hasColors: /\b(?:color|backgroundColor|background)\b/,
            doNotShow: /(^[0-9]+$)|\b(?:cssText|parentStyleSheet)\b/
        };
        this.views = {
            main: document.querySelector('.styler > .views #main'),
            classes: document.querySelector('.styler > .views #classes'),
            properties: document.querySelector('.styler > .views #properties')
        };
        this.namespace = {
            field: 'complex',
            cssProperty: 'css-prop',
            cssValue: 'css-val'
        };
        this.computedStyles = {};
        this.IPCAsync();
        this.render();
    }
    render(){
        this.renderTabs();
    }
    async IPCAsync(){
        // let _this = this;
        addRendererListener('sendElementStyle-reply', (event, sender) => {
            this.renderViews(sender);
        });
        addRendererListener('getComputedStyles-reply', (event, sender) => {

        });
    }
    // Functions
    renderTabs() {
        let that = this;
        let tabs = document.querySelectorAll('.styler .toggler span');
        Array.prototype.forEach.call(tabs, (tab, i) => {
            tab.addEventListener('click', function(){
                Array.prototype.forEach.call(Object.keys(that.views), (key, j) => {
                    if(i === j) { that.views[key].className = 'view active'; return; }
                    if(i < j) that.views[key].className = 'view invert-scale';
                    else that.views[key].className = 'view'
                });
            });
        });
    }
    renderViews(sender) {
        Array.prototype.forEach.call(Object.keys(this.views), key => {
            this.views[key].clear();
        });
        let main = (rule) => {
            let values = Object.assign({}, rule.style);
            let keys = Object.keys(rule.style).slice(0);
            Array.prototype.forEach.call(keys.filter((key) => { return values[key] !== ""; }), (cssProperty, i) => {
                if(cssProperty.match(this.regexp.doNotShow)) return;
                let wrapper = document.createElement('div');
                let property = document.createElement('span');
                let value = document.createElement('span');
                wrapper.className = `${this.namespace.field}`;
                property.className = `${this.namespace.cssProperty}`;
                value.className = `${this.namespace.cssValue}`;
                // if(cssProperty.match(this.regexp.hasColors)) { 
                //     property.style.background = (values[cssProperty].match(/var/)) 
                //     ? webview.send('getComputedStyles', values[cssProperty].replaceAll(/var{1}|[()]/, ''))  // WEBVIEW
                //     : cssProperty;
                // }
                property.innerHTML = cssProperty;
                value.innerHTML = values[cssProperty];
                delete keys[i];
                delete values[cssProperty];
                wrapper.append(property);
                wrapper.append(value);
                this.views.main.append(wrapper);
            });
        }
        let classes = (rule) => {
            let wrapper = document.createElement('div');
            wrapper.className = `${this.namespace.field}`;
            wrapper.innerHTML = rule.cssStringifyText;
            this.views.classes.append(wrapper);
        }
        Array.prototype.forEach.call(sender, rule => {
            // Main view
            main(rule);
            // Class view
            classes(rule);
        });
    }
}


module.exports = new Styler();