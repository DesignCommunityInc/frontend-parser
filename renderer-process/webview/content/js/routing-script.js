$(document).ready(function () {
    var activeNavElement = location.pathname.split('/')[3];

    if(activeNavElement == null){
        history.pushState({}, '', location.href + '/' + 'main');    
    }else if(activeNavElement == ''){
        history.pushState({pageTitle: "Dsound - Petit Biscuit"}, location.href +'/',"main");
    }

    addEventListener("popstate",function(e){
        location.href="http://smart-home.h1n.ru";
    },false);

});