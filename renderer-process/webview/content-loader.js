const $ = require('jquery');

$("#contentLoader").load('http://smart-home.h1n.ru');

setTimeout(function(){
    $('head').append('<link rel="stylesheet" href="style/header.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="style/standartization.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="style/main.css" type="text/css" />');
}, 3000)

// session.defaultSession.cookies.get({ url: 'http://www.github.com' }, (error, cookies) => {
//     console.log(error, cookies)
// })

