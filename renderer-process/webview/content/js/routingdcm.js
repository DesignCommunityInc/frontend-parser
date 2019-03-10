var pages = {
    'artist': 'artist/'
};

function MainRender(page){
    switch(page){
        case 'artist': 
            $('head > title').text('Petit Biscuit');
            $('head > script').detach();
            $('head > link').detach();
            $('head').append('<link rel="stylesheet" type="text/css" href="/style/standart.css"/>');
            $('head').append('<link rel="stylesheet" type="text/css" href="/style/artist.css"/>');

            //html
            $('dcm-screen-app > *').detach();
            $('dcm-screen-app').append('<section class="all-songs">'
            +'<div class="head"><h1>Все треки</h1></div>'
            +'<div class="all-songs-wrapper">'
            +'<div class="label"><div class="inform"><div class="label-img" style="background-image: url(content/matches-label.jpg);"></div>'
            +'<div class="inf-wrapper"><p class="author">Ephixa & Stephan Walking</p><p class="song-name">Matches</p></div>'
            +'<div class="background"></div>'
            +'<div class="cotrols-information">'
                +'<div class="controls"><div class="like-button"><span></span><div class="background-layer"></div></div><div class="play-button"><span></span><div class="background-layer"></div></div><div class="like-button"><span></span><div class="background-layer"></div></div></div>'
                +'<div class="information"><p class="author">Ephixa & Stephan Walking</p><p class="song-name">Matches</p></div>'
            +'</div>'
            +'</div></div>'
            +'</section>');

            // scripts
            $('head').append('<script src="/scripts/artist/routing-script.js"></script>');
            // $('head').append('<script src="/scripts/routingdcm.js"></script>');
            $('head').append('<script src="/scripts/artist/main-script.js"></script>');
        break;
    }
    
}

var firstIN = location.pathname.split('/')[1];
if(firstIN == '') firstIN = 'main';
console.log(firstIN);

$(function () {
    $('.dcm-to-link').click(function(){   
        history.pushState({pageTitle: ""}, location.href + '/',  $('.dcm-to-link').attr('href'));
        var whereIam = location.pathname.split('/')[1];
        console.log(pages[whereIam]);
        MainRender(whereIam);
        return false;
    });
});

