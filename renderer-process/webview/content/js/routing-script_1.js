var menuCategories = {
    'login': {
        1: '.n-el-login',
        2: '.f-g-log',
        3: 'login',
        4: 'forms-group-login'
    },
    'registration':{
        1: '.n-el-registration',
        2: '.f-g-reg',
        3: 'registration',
        4: 'forms-group-registration'
    }
}

function changeEvent(elementPosition){
    $('.wrapper').removeClass('wrapper-login');
    $('.wrapper').removeClass('wrapper-registration');

    $('.wrapper').addClass('wrapper wrapper-' + menuCategories[elementPosition][3]);
    $('.btn-nav-element').removeClass("active-element");
    $(menuCategories[elementPosition][1]).addClass("active-element");
    // $('.form-group').css({display: 'none'});
    $(menuCategories[elementPosition][2]).css({display: 'block'});
    setTimeout(function(){
        $('.forms-group').removeClass('forms-group-registration');
        $('.forms-group').removeClass('forms-group-login');

        $('.forms-group').addClass(menuCategories[elementPosition][4]);
        $('.form-group').removeClass('form-group-active');
        $(menuCategories[elementPosition][2]).addClass('form-group-active');
    },100)
    // $(menuCategories[elementPosition][2]).css({display: 'block'});
}

$(document).ready(function () {  
    
    var path = location.pathname;
    switch (path){
    case "/login": changeEvent("login"); break;
    case "/registration": changeEvent("registration"); break;
    }

    $('.btn-nav-element').click(function(){
        var elementPosition =  $(this).attr("position-id");
        history.replaceState({'active-nav-element': menuCategories[elementPosition][3],  pageTitle: ""}, location.href + '/',  menuCategories[elementPosition][3]);
        changeEvent(elementPosition);
    });
});