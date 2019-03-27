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
            values: [ 0.67, 0.8, 0.9, 1.0, 1.25, 1.5, 2.0 ],
            current: 1.0,
            buttons: {
                zoomIn: +10, 
                zoomOut: -10
            }
        }
        this.IPCAsync();
        this.render();
    }
    render(){
        // Потом вынести нужно кнопки панели
        Array.prototype.forEach.call(this.scale.values, (i, v) => {
            this.scale.container.append("<li id='sv" + v + "'>" + i * 100 + "%</li>")
        });
    }
    async IPCAsync(){
        let that = this;
        addRendererListener('mouse-pos-changed-reply', function(event, pos){
            that.cursorPosition.x.innerHTML = pos.x;
            that.cursorPosition.y.innerHTML = pos.y;
        });
        addRendererListener('set-page-title-reply', function(event, title){
            that.projectName.innerHTML = `${title}`;
        });
    }
}
module.exports = new TopBar();