//  FUNCTIONS

    function screenWrapperShow(state){
        if(state == true){
            $('.screen-wrapper').addClass("sc-wr-active");
        }else{
            $('.screen-wrapper').removeClass("sc-wr-active");
        }
    }

    function scrollingTo(position){
        $('body, html').animate({
            scrollTop: position
        },200);
    }

$(document).ready(function () {

//  VARIABLES

    var menuCategories = {
        1: '.main-sec',
        2: '.recomendation-sec',
        3: '.popular-sec'
    }
    var menuEvent = false;

    var lastScrollTop = 0;
    $(window).scroll(function(event){
    var st = $(this).scrollTop();
    if (st > lastScrollTop){
        $('.user-stub-hide').addClass("user-stub"); $('.user-stub-hide').removeClass("user-stub-hide");
        $('.user-wrapper').addClass("user-wrapper-hide"); $('.user-wrapper').removeClass("user-wrapper");
    } else if(st == 0) {
        $('.user-stub').addClass("user-stub-hide"); $('.user-stub').removeClass("user-stub");
        $('.user-wrapper-hide').addClass("user-wrapper"); $('.user-wrapper-hide').removeClass("user-wrapper-hide");
    }

    if(st < $('.recomendation-sec').offset().top){
        $('.menu-element').removeClass("menu-active-element");
        $('.m-el-main').addClass("menu-active-element");
    }else if(st >= $('.popular-sec').offset().top){
        $('.menu-element').removeClass("menu-active-element");
        $('.m-el-popular').addClass("menu-active-element");
    }else if(st >= $('.recomendation-sec').offset().top){
        $('.menu-element').removeClass("menu-active-element");
        $('.m-el-recomend').addClass("menu-active-element");
    }
    lastScrollTop = st;
    });

   $('.center-side').hover(function () {
        $('.user-stub').addClass("user-stub-hide"); $('.user-stub').removeClass("user-stub");
        $('.user-wrapper-hide').addClass("user-wrapper"); $('.user-wrapper-hide').removeClass("user-wrapper-hide");
       }
   );

    $('.screen-wrapper').hover(function(){
        if(menuEvent){
            $('.menu-wrapper').removeClass('menu-active');
            screenWrapperShow(false);
            menuEvent = false;
        }
    });
    
   $('.to-left-menu').click(function(){
    $('.menu-wrapper').addClass('menu-active');
    screenWrapperShow(true);
   });

   $('.screen-wrapper').click(function(){
    $('.menu-wrapper').removeClass('menu-active');
    screenWrapperShow(false);
   });
   
    $('.menu-element').click(function(){
        menuEvent = true;
        var elementPosition =  $(this).attr("position-id");
        var offset = $(menuCategories[elementPosition]).offset().top;
        scrollingTo(offset); 
    });
    
});