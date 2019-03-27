// const $ = require

class Menu {
    constructor(){
        this.container = document.querySelector('.menu')
        this.nameSpace = {
            menu: 'menu',
            field: 'field',
            context: 'ui-context-menu'
        }
        this.container = document.getElementById(this.nameSpace.menu);
        this.fields = [{
            title: './assets/svg/file.svg',
            children: [{
                title: 'create',
                event: 'open-file-dialog',
                sender: 'openDirectory'
            },{
              title: 'open',
              event: 'open-file-dialog',
              sender: 'openFile'
            }]
        }];
        this.render();
    }
    render(){
        Array.prototype.forEach.call(this.fields, (field) => {
            let fieldList = new uiContext();
            let item = document.createElement('div');
            let title = document.createElement('img');

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
    }
}

module.exports = new Menu();