function errorViewAnimation(element, state, error){
    element.parent().find('.error-help').text(error);
    if(state == "hide"){
        element.parent().find('.error-help').css({opacity: '0', 'margin-top': '-15px'});
        setTimeout(function(){
            element.parent().find('.error-help').css({display: 'none'});      
        },200);
    }else if(state == "view"){
        element.parent().find('.error-help').css({display: 'block'});
        setTimeout(function(){
            element.parent().find('.error-help').css({opacity: '1', 'margin-top': '-9px'});
        },100);
    }
}

$(function () {
    var regErrors = {};
    var logErrors = {};
    $('input').focusin(function(){
        $(this).removeClass('error-input');
        errorViewAnimation($(this).parent().find('.error-help'), "hide");
    });

    $('input').focusout(function(){
        delete regErrors[$(this).attr('id')];
        delete logErrors[$(this).attr('id')];
        if($(this).val() == ""){ // Ошибка - пустое поле
            $(this).addClass('error-input');
            errorViewAnimation($(this), "view", "поле не заполнено");
            regErrors[$(this).attr('id')] = "Поле не заполнено";
        }
        else if($(this).attr('id') == 'user-password-re' && $(this).val() != $('#user-password').val()){  // Ошибка - несовпадение паролей 
            $(this).addClass('error-input');
            errorViewAnimation($(this), "view", "пароли не совпадают");
            regErrors[$(this).attr('id')] = "Пароли не совпадают";    
        }
    });

    $('#registration-button').click(function(){
        var formData = {};
        $.each($('.registration-form input'), function (index) { 
            if($(this).val() == ''){ // Ошибка - пустое поле
                $(this).addClass('error-input');
                errorViewAnimation($(this), "view", "поле не заполнено");
                regErrors[$(this).attr('id')] = "Поле не заполнено";
            } else{
                formData[$(this).attr('id')] = $(this).val();
            }
        });
        
        if(Object.keys(regErrors).length == 0){
            formData['type'] = 'registration';
           $.ajax({
               method: "POST",
               url: "/queries/log-reg-query/user.php",
               data: formData,
               beforeSend: function () { 
                    $('.control-buttons-form-login').append('<div class="loading-wrapper"><div class="animation"><span class="circle c-1"></span><span class="circle c-2"></span><span class="circle c-3"></span></div><div class="loading-background-layer"></div></div>');
                    setTimeout(function(){
                        $('.control-buttons-form-login .loading-wrapper').css({opacity: '1'});
                    },100)
                },
               success: function (response) {
                    $('.control-buttons-form-login .loading-wrapper').detach();
                    if(response["query-status"] != 100){
                        $(response["error"]['error-field']).addClass('error-input');
                        errorViewAnimation($(response["error"]['error-field']), 'view', response["error"]['message']);
                    }else{
                        history.replaceState({pageTitle: ""}, location.href + '/',  'login');
                        $('.forms-group').removeClass('forms-group-registration');
                        $('.forms-group').addClass('forms-group-login');
                        $('.wrapper').removeClass('wrapper-registration');
                        $('.wrapper').addClass('wrapper-login');
                        $('.btn-nav-element').removeClass("active-element");
                        $('.n-el-login').addClass("active-element");
                        // $('form').css({display: 'none'});
                        // $('.login-form').css({display: 'block'});
                        console.log(response);
                    }
               },
               error: function(){
                    $('.control-buttons-form-login .loading-wrapper').detach();
               }
           });
        }
        
    });  

    $('#login-button').click(function(){
        var formData = {};
        $.each($('.login-form input'), function (index) { 
            if($(this).val() == ''){ // Ошибка - пустое поле
                $(this).addClass('error-input');
                logErrors[$(this).attr('id')] = "поле не заполнено";
                errorViewAnimation($(this), "view", logErrors[$(this).attr('id')]);
            } else{
                formData[$(this).attr('id')] = $(this).val();
            }
        });
                
        if(Object.keys(logErrors).length == 0){
            formData['type'] = 'login';
            $.ajax({
                method: "POST",
                url: "/queries/log-reg-query/user.php",
                data: formData,
                beforeSend: function () { 
                        $('.control-buttons-form-login').append('<div class="loading-wrapper"><div class="animation"><span class="circle c-1"></span><span class="circle c-2"></span><span class="circle c-3"></span></div><div class="loading-background-layer"></div></div>');
                        setTimeout(function(){
                            $('.control-buttons-form-login .loading-wrapper').css({opacity: '1'});
                        },100)
                    },
                success: function (response) {
                    console.log(response);
                        $('.control-buttons-form-login .loading-wrapper').detach();
                        if(response["query-status"] != 100){
                            $(response["error"]['error-field']).addClass('error-input');
                            errorViewAnimation($(response["error"]['error-field']), 'view', response["error"]['message']);
                        }else{
                            document.cookie = "refreshToken="+response['message']['refreshToken']+"; domain=/.smart-home.h1n.ru";
                            document.cookie = "accessToken="+response['message']['accessToken']+"; domain=/.smart-home.h1n.ru";
                            // $('form').css({display: 'none'});
                            // $('.login-form').css({display: 'block'});
                            // console.log(response);
                        }
                },
                error: function(){
                        $('.control-buttons-form-login .loading-wrapper').detach();
                }
                
            });
            
        }
    });
});