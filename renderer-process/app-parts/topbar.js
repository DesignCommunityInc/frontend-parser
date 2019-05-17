// const { ipcRenderer } = require('electron');

class TopBar {
    // private local variables
    constructor(){
        this.cursorPosition = {
                x: document.querySelector('.mouse-pos-x'),
                y: document.querySelector('.mouse-pos-y')
        };
        this.projectName = document.querySelector('.project-name');
        this.scale = {
            container: document.querySelector('.scale-list'),
            values: [ 0.25, 0.50, 0.67, 0.8, 0.9, 1.0, 1.25, 1.5, 2.0, 3.0 ],
            default: 1.0,
            current: 3
        }
        this.IPCAsync();
        this.render();
    }
    render(){
        let that = this;
        // Потом вынести нужно кнопки панели
        Array.prototype.forEach.call(this.scale.values, (i, v) => {
            let li = document.createElement('li');
            li.setAttribute('id', `sv${v}`);
            li.innerHTML = `${i * 100}%`;
            this.scale.container.append(li)
        });
        document.querySelectorAll('.scale input').addEventListener('focus', function(){
            that.scale.container.classList.add('active-scale-list');
        });
        document.querySelectorAll('.scale input').addEventListener('blur', function(){
            that.scale.container.classList.remove('active-scale-list');
        });
    }
    async IPCAsync(){
        addRendererListener('mouse-pos-changed-reply', (event, pos) =>{
            this.cursorPosition.x.innerHTML = pos.x;
            this.cursorPosition.y.innerHTML = pos.y;
        });
        addRendererListener('mouse-pos-changed-reply', (event, pos) => {
            this.cursorPosition.x.innerHTML = pos.x;
            this.cursorPosition.y.innerHTML = pos.y;
        });
        addRendererListener('set-page-title-reply', (event, title) => {
            this.projectName.innerHTML = `${title}`;
        });
        addRendererListener('scale-request-message', (event, direction) => {
            this.scaleWindow(direction);
        });
    }
    // FUNCTIONS

    scaleWindow(direction){
        // if(typeof(arg.scaleIndex) !== 'undefined'){
        //     win.send('workspace-scale', scale.values[scaleIndex])
        //     return
        // }
        let scale = this.scale;
        if(direction){
            let next = (scale.values.length <= scale.current + 1) ? scale.current : scale.current + 1;
            scale.current = next;
            sendMainAsync('scale-request-reply', scale.values[next]);
        }
        else{
            let previous = (scale.current - 1 <= 0) ? 0 : scale.current - 1;
            scale.current = previous;
            sendMainAsync('scale-request-reply', scale.values[previous]);
        }
        document.querySelector('#scale').value = `${scale.values[scale.current] * 100}%`;
    }
}
module.exports = new TopBar();