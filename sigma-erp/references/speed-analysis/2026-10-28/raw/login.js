var CurrentPage = function () {

    var handleLogin = function () {

        var $loginForm = $('.login-form');

        $loginForm.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input,
            
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            },

            invalidHandler: function (event, validator) {
                $loginForm.find('.alert-danger').show();
            },

            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                //error.insertAfter(element.parent.closest('.input-icon'));
                error.insertAfter(element.parent().find("span"));

            },
            
            submitHandler: function (form) {
                $loginForm.find('.alert-danger').hide();
            }
        });

        $loginForm.find('input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').valid()) {
                    $('.login-form').submit();
                }
                return false;
            }
        });

        $loginForm.submit(function (e) {
            e.preventDefault();

            if (!$('.login-form').valid()) {
                return;
            }

            abp.ui.setBusy(
                null,
                abp.ajax({
                    contentType: app.consts.contentTypes.formUrlencoded,
                    url: $loginForm.attr('action'),
                    data: $loginForm.serialize()
                })
            );
        });

        $('a.social-login-icon').click(function() {
            var $a = $(this);
            var $form = $a.closest('form');
            $form.find('input[name=provider]').val($a.attr('data-provider'));
            $form.submit();
        });

        $loginForm.find('input[name=returnUrlHash]').val(location.hash);

        $('#email_input').focus();

        var fullUrl = window.location.host;
        //window.location.host is subdomain.domain.com
        var urlParts = fullUrl.split('.');
        var subDomainName = urlParts[0];
        if (subDomainName.toLowerCase() == 'althiqa') {
            $("#li_adfs").show();
        }
        else {
            $("#li_adfs").hide();
        }
    }

    return {
        init: function () {
            var fullUrl = window.location.host;
            //window.location.host is subdomain.domain.com


            $("#CompanyCode").hide();
            
            $("#isNewMethod").prop('checked', true);
            $("#isNewMethod").val(true);
            $("#oldscreenbtn").click(function () {


                if ($("#isNewMethod").prop('checked') == false) {
                    $("#isNewMethod").prop('checked', true);
                    $("#isNewMethod").val(true);
                    
                    
                    $("#CompanyCode").hide();
                    $('#email_input').clone().attr('type', 'email').insertAfter('#email_input').prev().remove();
                }
                else {
                    $("#isNewMethod").prop('checked', false);
                    $("#isNewMethod").val(false);
                    $("#email_text").text("Email or Username");

                    $("#info_text").hide();
                    $("#help_text").show();
                    $("#CompanyCode").show();
                    $('#email_input').clone().attr('type', 'text').insertAfter('#email_input').prev().remove();
                    $('#email_input').blur();
                    $('#TenanyName').focus();

                }



            });


            var urlParts = fullUrl.split('.');
           
            var subDomainName = urlParts[1];
            if (subDomainName != null) {
                if (subDomainName.toLowerCase() == 'carlet') {
                    $("#carletLogins").show();
                    $("#speedLogins").hide();
                    $("#carletLoginscopy").show();
                    $("#speedLoginscopy").hide();

                }
                else {
                    $("#carletLogins").hide();
                    $("#speedLogins").show();
                    $("#carletLoginscopy").hide();
                    $("#speedLoginscopy").show();
                }
            }
            else {
                $("#carletLogins").hide();
                $("#speedLogins").show();
                $("#carletLoginscopy").hide();
                $("#speedLoginscopy").show();
            }
            handleLogin();
        }
    };

}();