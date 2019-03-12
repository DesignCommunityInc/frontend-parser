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
            //  scripts
            $('head').append('<script src="/scripts/artist/routing-script.js"></script>');
            // $('head').append('<script src="/scripts/routingdcm.js"></script>');
            // $('head').append('<script src="/scripts/artist/main-script.js"></script>');

            //html
            $('dcm-screen-app > *').detach();
            $('dcm-screen-app').append('<div class="user-about-wrapper">'
            +'<div class="user-main-information">'
                +'<div style="background-image:url(/content/artists/petit-bisquit.jpg);" class="user-image"></div>'
            +'</div>'
            +'<div style="background-image: url(/content/artists/artist-wallpaper/petit-bisquit-wallpaper.jpg);" class="user-wallpaper">'
                +'<div class="background-layer"></div>'
            +'</div>'
            +'</div>'
            );
            $('dcm-screen-app').append('<section class="all-songs">'
                +'<div class="head"><h1>Все треки</h1></div>'
            +'</section>');

           
        break;
    }
    
}

var firstIN = location.pathname.split('/')[1];
if(firstIN == '') firstIN = 'main';
console.log(firstIN);

$(function () {
    $('.dcm-link').click(function(){   
        history.pushState({pageTitle: ""}, location.href + '/',  $(this).attr('href'));
        var whereIam = location.pathname.split('/')[1];
        console.log(pages[whereIam]);
        MainRender(whereIam);
        return false;
    });
});


