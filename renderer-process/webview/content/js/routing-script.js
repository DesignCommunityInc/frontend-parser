$(document).ready(function () {
    var activeNavElement = location.pathname.split('/')[3];

    if(activeNavElement == null){
        history.replaceState({}, '', location.href + '/' + 'main');    
    }else if(activeNavElement == ''){
        history.replceState({pageTitle: "Dsound - Petit Biscuit"}, location.href +'/',"main");
    }

});