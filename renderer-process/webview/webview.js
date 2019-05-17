
// // content-loader.js ~ did-stop-loading
// let DOMController = require(`${__dirname}\\dom-controller`);



// // function SetContextTitle(container, tmp, current){
// //     if(tmp !== current){
// //         let childItem = document.createElement('h2');
// //         childItem.innerHTML = current;
// //         container.append(childItem);
// //         tmp = current;
// //     }
// //     return tmp
// // }
// // function CSSWindowConstructor(contextArray){
// //     let tmpFileName = "";
// //     let cssMonitor = document.createElement('div');
// //     cssMonitor.className = 'view view-active';
// //     Array.prototype.forEach.call(contextArray, (context) => {
// //         let cssFileName = context.parentStyleSheet.href.split('/').slice(-1).pop() + '<br/>';
// //         tmpFileName = SetContextTitle(cssMonitor, tmpFileName, cssFileName);
// //         let childItem = document.createElement('span');
// //         childItem.innerHTML += context.cssStringifyText;
// //         cssMonitor.append(childItem);
// //     });
// //     return cssMonitor;
// // }


// // function contextClear(){
// //     uiContext.remove();
// //     uiContext = null;
// //     uiContext = new UIContext();
// // }