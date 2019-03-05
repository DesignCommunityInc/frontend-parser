var pages = {
    'artist': 'artist/'
};
function MainRender(){
    $('dcm-screen-app > *').detach();
    $('dcm-screen-app').html('<section></section>');
}

var firstIN = location.pathname.split('/')[1];
if(firstIN == '') firstIN = 'main';
console.log(firstIN);

$(function () {
    $('.dcm-to-link').click(function(){   
        history.pushState({pageTitle: ""}, location.href + '/',  $('.dcm-to-link').attr('href'));
        var whereIam = location.pathname.split('/')[1];
        console.log(pages[whereIam]);
        MainRender();
        return false;
    });
});

