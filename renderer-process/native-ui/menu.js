// const $ = require

$(document).ready(function(){
    let menu = new Menu();


});
addRendererListener('selected-file', (event, sender) => {
    console.log(sender[0]);
    $('.webview')[0].loadURL(`${sender[0]}`);
    // $('.webview')[0].reload();
});
class Menu {
    constructor(){
        this.nameSpace = {
            menu: 'menu',
            field: 'field',
            context: 'ui-context-menu'
        }
        this.container = document.getElementById(this.nameSpace.menu);
        this.fields = [];
        this.init();
    }

    init(){
        let field = {
            title: './assets/svg/file.svg',
            children: [{
                title: 'Open',
                event: 'open-file-dialog'
            }]
        };
        this.fields.push(field);
        this.render();
    }
    render(){
        let FieldList = document.registerElement('ui-context', {
            prototype: Object.create(HTMLElement.prototype)
        });

        Array.prototype.forEach.call(this.fields, (field) => {
            let item = document.createElement('div');
            let title = document.createElement('img');
            let fieldList = new FieldList();

            item.classList.add(this.nameSpace.field);
            fieldList.classList.add(this.nameSpace.context);
            title.setAttribute('src', field.title);
            
            Array.prototype.forEach.call(field.children, (child) => {
                let childItem = document.createElement('span');
                childItem.innerHTML = child.title;
                childItem.addEventListener('click', function(){
                    sendMainAsync(child.event);
                });
                fieldList.append(childItem);
            })
            item.append(title);
            item.append(fieldList);
            this.container.append(item);
        });
        this.IPCAsync();
    }
    IPCAsync(){
        
    }

    // FUNCTIONS
}