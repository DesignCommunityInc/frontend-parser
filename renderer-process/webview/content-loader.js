const $ = require('jquery');
const fs = require('fs');
const scrape = require('website-scraper');

String.prototype.replaceAll = function(search, replace){
    return this.split(search).join(replace);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

//Adding an event listener to an html button which will send open-file-dialog to the main process
const ipc = require('electron').ipcRenderer
const selectDirBtn = document.getElementById('select-file')

selectDirBtn.addEventListener('click', function (event) {
     sendMainAsync('open-file-dialog');
});

//Getting back the information after selecting the file
addRendererListener('selected-file', function (event, sender) {
    console.log(sender);
});

//https://ourcodeworld.com/articles/read/374/how-to-download-the-source-code-js-css-and-images-of-a-website-through-its-url-web-scraping-with-node-js

let wrapper = $('#content-loader');
let __basedir = (`${__dirname}`).replaceAll('\\', '/');

// cssLoader(`${__basedir}/content/css`);
// function cssLoader(cssFolder){
//     let head = document.querySelector('head');
//     fs.readdirSync(cssFolder).forEach(file => {
//         let link = document.createElement('link');
//         link.setAttribute('href', `${__basedir}/${file}`);
//         head.append(link);
//     })
// }


// dialog.showOpenDialog({
//     properties: ['openFile']
//   }, function (files) {
//     if (files) event.sender.send('selected-file', files)
//   })


// function createSingleCss(){
//     fs.writeFile(`${__basedir}`, "Hey there!", function(err) {
//         if(err) {
//             return console.log(err);
//         }

//         console.log("The file was saved!");
//     }); 
// }
// $('body').load(`${__basedir}/index.html`, function(data){

// });






// let websiteUrl = 'http://smart-home.h1n.ru/';

// let options = {
//     urls: [websiteUrl],
//     directory: `${__basedir}\\content`,
//      // Enable recursive download
//      recursive: true,
//      // Follow only the links from the first page (index)
//      // then the links from other pages won't be followed
//      urlFilter: function (url) {
//         return url.indexOf(websiteUrl) === 0;
//     },
//     maxDepth: 3
// };

// scrape(options).then((result) => {
//     console.log('Website succesfully downloaded');  
// }).catch((error) => {
//     console.log("An error occured", error);
// })

// $("#contentLoader")

// setTimeout(function(){
//     $('head').append('<link rel="stylesheet" href="style/header.css" type="text/css" />');
//     $('head').append('<link rel="stylesheet" href="style/standartization.css" type="text/css" />');
//     $('head').append('<link rel="stylesheet" href="style/main.css" type="text/css" />');
// }, 3000)

// session.defaultSession.cookies.get({ url: 'http://www.github.com' }, (error, cookies) => {
//     console.log(error, cookies)
// })

