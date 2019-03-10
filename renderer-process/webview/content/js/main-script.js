var menuCategories = {
    'main': {
        1: '.n-el-main',
        2: '.artist-top',
        3: 'main'
    },
    'playlists':{
        1: '.n-el-playlists',
        2: '.artist-playlists',
        3: 'playlists'
    },
    'information':{
        1: '.n-el-information',
        2: '.artist-information',
        3: 'information'
    }
}

$(document).ready(function () {
    alert('main-script-upload');
    $('.btn-nav-element').click(function(){
        var elementPosition =  $(this).attr("position-id");
        history.replaceState({'active-nav-element': menuCategories[elementPosition][3],  pageTitle: "Dsound - Petit Biscuit"}, location.href + '/',  menuCategories[elementPosition][3]);
        $('.btn-nav-element').removeClass("active-element");
        $(menuCategories[elementPosition][1]).addClass("active-element");
    });
});