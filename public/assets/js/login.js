//in login.js
$("#forgetPassSubmit").click(function () {
    $("#resetLinkMessage").html("&nbsp;");
    var userEmail = $("#forgetPassEmail").val().trim();
    if (userEmail.length > 0 && validateEmail(userEmail)) {
        $.ajax({
            url: '/public/userprofile/manageprofile/sendresetlink',
            type: 'POST',
            data: {
                userEmail: userEmail, actionFlag: 1
            },
            success: function (response)
            {
                if (response == '1') {
                    if (userEmail.length > 30) {
                        var newUserEmail = userEmail.slice(0, 27) + '...';
                        userEmail = '<span title="' + userEmail + '">' + newUserEmail + '</span>';
                    }
                    $("#resetLinkMessage").html("Password reset link has sent to " + userEmail + " Please check your email.");
                } else if (response == '2') {
                    displayMessage('resetLinkError', 'Please enter valid email.');
                    return false;
                } else if (response == '3') {
                    $("#resetLinkMessage").html(userEmail + " is not registered with Annex Cloud.");
                    return false;
                } else if (response == '4') {
                    $("#resetLinkMessage").html(userEmail + " is not active in Annex Cloud. Please contact your Customer Success Manager.");
                    return false;
                } else if (response == '5') {
                    $("#resetLinkMessage").html("Password is not set for "+userEmail + ".<br>Please contact your Customer Success Manager.");
                    return false;
                } else {
                    $("#resetLinkMessage").html("Something went wrong, Please try again later!!!");
                }
            }
        });
    } else {
        displayMessage('resetLinkError', 'Please enter valid email.');
        return false;
    }

});

function resetForm(formId) {
    if (formId != '') {
        document.getElementById(formId).reset();
    }
}
function displayMessage(divId, msg) {
    $('#' + divId).html(msg);
    //$('#' + divId).show();
    setTimeout(function () {
        $('#' + divId).html('');
    }, 3000);
}
function validateEmail(sEmail) {

    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    } else {
        return false;
    }
}
$("#submit").click(function () {
    var username = $("#txtemail").val().trim();
    var password = $("#txtpassword").val();
    if (username.length > 0 && password.length > 0) {
        var status = 0;
        var id = 0;
        $.ajax({
            url: '/public/userprofile/manageprofile/checkpassexpired',
            type: 'POST',
            async: false,
            data: {
                username: username, password: password, debug: 5
            },
            success: function (response)
            {
                var response = JSON.parse(response);
                status = response.status;
                id = response.id;
            }
        });
        if (status == '1' && id != '') {
            var curDate = $("#curDate").val();
            var userData = curDate + ':' + id;
            var resetLink = 'http://www.socialannexstaging.com/public/userprofile/manageprofile/index/eid/' + btoa(userData);
            $("#resetLink").attr('href', resetLink);
            $("#passExpired").click();
            return false;
        } else {
            return true;
        }

    } else {
        displayMessage('login-error-message', 'Please enter username and password.');
        return false;
    }
});

$(document).ready(function () {
    setTimeout(function () {
        $('#success_msg').fadeOut('slow');
    }, 3000);
    setTimeout(function () {
        $('#success_msg').empty();
    }, 3000);

});

$('#forgot-pass-form').on('hidden.bs.modal', function () {
    $("#resetLinkError").html('');
    resetForm('forgotPassForm');
});
//$(document).keyup(function(e) {
//    if (e.keyCode == 27) {
//      $('.modal-backdrop').hide();
//      $('.close').click();
//    } 
//});