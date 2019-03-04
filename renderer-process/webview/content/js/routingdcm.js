
var whereIam = location.pathname.split('/')[1];
if(whereIam == '') whereIam = 'main';
console.log(whereIam);

$(function () {
    $('.dcm-to-link').click(function(){
        // alert($('.dcm-to-link').attr('href'));
        // $('.dcm-to-link').attr('href');
        // history.
        history.pushState({'active-nav-element': menuCategories[elementPosition][3],  pageTitle: ""}, location.href + '/',  $('.dcm-to-link').attr('href'));
        return false;
    })
});
