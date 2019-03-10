// const $ = require('jquery');
const { remote, ipcRenderer, BrowserWindow } = require('electron');

let topbar = (function(){
    // private local variables
    let _win
    let webview
    let topBar = {}

    return {
        init: function(){
            _win = remote.getCurrentWindow()                    // Current window    
            webview = $('.webview')[0]                          // Webview (frameWindow)

            topBar = {
                position: {
                    x: $('.mouse-pos-x'),
                    y: $('.mouse-pos-y')
                },
                projectName: $('.project-name'),
                scale: {
                    this: $('.scale-list'),                      // Scale list class 
                    values: [ 0.67, 0.8, 0.9, 1.0, 1.25, 1.5, 2.0 ],  // Scale list values
                    buttons: {                                   // Scale list buttons
                        zoomIn: +10, 
                        zoomOut: -10
                    },
                }
            }
            topBar.scale.current = topBar.scale.values[3]        // Scale current value (1.0 default ~ 100%)

            this.render();
        },
        render: function(){
            // Потом вынести нужно кнопки панели
            $.each(topBar.scale.values, function(i, v){          // Adding zoom values to 
                topBar.scale.this.append("<li id='sv" + i + "'>" + v * 100 + "%</li>")
            }, console.log('--scale-setup'));                    // scale list (export values to html)

            this.event();
        },
        event: function(){
            $('.burger').on('click', function(){
                document.getElementById('menu').classList.toggle('menu-opened');
                // $('.shadow').fadeToggle(300);
            });
            $(".tb-button").on('click', function(event){                
                let name = this.id;
                // topBar.action(name);
                ipcRenderer.send('window-topbar-action', name)
            });
            $("#devtools").on('click', function(event){  
               ipcRenderer.send('devtools-webview-open')
            });
            $(window).keydown(function (event) {
                let e = event || window.event;
                e.preventDefault();
                if (e.keyCode == 27) {
                    // Close scale list on Escape button 
                    topBar.scale.this.removeClass('active-scale-list');
                    return false;
                }
            });
            $('.scale input').focus(function(){
                topBar.scale.this.addClass('active-scale-list');
            });
            $('.scale input').blur(function(){
                topBar.scale.this.removeClass('active-scale-list');
            });
            // CUSTOM

            ipcRenderer.on('mouse-pos-changed-reply', function(event, pos){
                topBar.position.x.text(pos.x)
                topBar.position.y.text(pos.y)
            })
          
            ipcRenderer.on('set-page-title-reply', function(event, title){
                document.getElementById('project-name').innerHTML = `${title}`;
                console.log(title);
            })
        }
    }
}());

topbar.init()