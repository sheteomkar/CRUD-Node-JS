function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

jQuery.validator.addMethod('passmatch', function (value, element, param) {
    if (value == document.getElementById("newPassword").value) {
        return true;
    } else {
        return false;
    }

}, "");
jQuery.validator.addMethod("pwcheck", function (value) {
    return /[a-z]/.test(value) // has a lowercase letter
            && /\d/.test(value) // has a digit
            && /[A-Z]/.test(value) // has a Uppercase letters
            && /[!@#$%'"'"'"^&*()_+\-=\[\]{};:\\|,.<>\/?]/.test(value)
});
//jQuery.validator.addMethod("differentpwd", function (value, element) {
//    return true;
//});
jQuery.validator.addMethod("differentpwd", function (value, element) {
    var oldpwd = $("#currentPassword").val();
    var newpwd = $("#newPassword").val();
    var perc = 100;
    if ($("#currentPassword").length) {
        var perc = Math.round(similarity(oldpwd, newpwd) * 10000) / 100;
        if (perc > 50) {
            $("#different").addClass("ac-red fa-times-circle");
            $("#different").removeClass("ac-green fa-check-circle");
            return false;
        } else {
            $("#different").removeClass("ac-red fa-times-circle");
            $("#different").addClass("ac-green fa-check-circle");
            return true;
        }
    } else {
        return true;
    }


});
jQuery.validator.addMethod("nospace", function (value, element) {
    if (document.getElementById('newPassword').value.indexOf(" ") != -1) {
        return false;
    } else {
        return true;
    }
});
$(document).ready(function () {

    $('#updatepassword').validate({
        rules: {
            currentPassword: {
                required: true
            },
            newPassword: {
                required: true,
                pwcheck: true,
                nospace: true,
                differentpwd: true,
                minlength: 10,
                maxlength: 40
            },
            confirmPassword: {
                required: true,
                equalTo: "#newPassword"
            }

        },
        messages: {
            currentPassword: {
                required: "Please enter current password."
            },
            newPassword: {
                required: "Please enter new password.",
                pwcheck: "Please match the password criteria.",
                nospace: "Please match the password criteria.",
                differentpwd: "Please match the password criteria.",
                minlength: 'Please match the password criteria.',
                maxlength: 'Please match the password criteria.'
            },
            confirmPassword: {
                required: "Please enter confirm password.",
                equalTo: 'Entered password does not match.'
            }
        }
    });

    if ($("#currentPassword").length) {
        document.getElementById("currentPassword").addEventListener("focusout", function () {
            var userEmail = $("#userEmail").val();
            var currentPassword = $("#currentPassword").val();
            var data = {
                userEmail: userEmail, currentPassword: currentPassword
            };
            if (currentPassword != '') {
                $.ajax({
                    url: '/public/userprofile/manageprofile/getcurrentpass',
                    type: 'POST',
                    data: data,
                    success: function (response)
                    {
                        console.log(response);
                        if (response != '') {
                            if (response != '1') {
                                $("#currentPassword-error").show();
                                $("#currentPassword-error").html('Current password does not match.');
                                $("#currentPassword").val('');
                                return false;
                            } else {
                                $("#currentPassword-error").html('');
                            }
                        }
                    }
                });
            }

        })
    }
    document.getElementById("updatepwd").addEventListener("click", function () {

        if ($('#updatepassword').valid()) {
            var userEmail = $("#userEmail").val();
            var newPassword = $("#newPassword").val();
            var uid = $("#uid").val().trim();
            var eid = $("#eid").val().trim();
            if (uid != '') {
                var data = {
                    userEmail: userEmail, newPassword: newPassword, mode: 'changepass'
                };
            } else if (eid != '') {
                var currentPassword = $("#currentPassword").val();
                var data = {
                    userEmail: userEmail, newPassword: newPassword, currentPassword: currentPassword
                };
            } else {
                var userId = $("#userId").val();
                var siteId = $("#siteId").val();
                var accessToken = $("#accessToken").val();
                var data = {
                    userEmail: userEmail, newPassword: newPassword, userId: userId, siteId: siteId, accessToken: accessToken
                };
            }

            $.ajax({
                url: '/public/userprofile/manageprofile/updatepassword',
                type: 'POST',
                data: data,
                success: function (response)
                {
                    var response = JSON.parse(response);
                    var message = '';
                    var divId = '';
                    if (response != '') {
                        if (response.currentPassStatus == '3' && response.status != '') {
                            divId = 'currentPassword-error';
                            message = 'Current password does not match.';
                        } else if (response.status == '1' && response.currentPassStatus == '0') {
                            divId = 'forget-success';
                            message = 'Password updated successfully! Please re-login to continue.';

                        } else if (response.status == '2' && response.currentPassStatus == '0') {
                            divId = 'forget-error';
                            message = 'Not allowed to use last two passwords!!!';
                            $("#lastpwd").addClass("ac-error-alert");
                            setTimeout(function () {
                                $("#lastpwd").removeClass("ac-error-alert");
                            }, 3000);
                        } else {
                            divId = 'forget-error';
                            message = 'Something went wrong please try again!!';
                        }
                        displayMessage(divId, message);
                        if (divId == 'forget-success') {
                            setTimeout(function () {
                                window.location = 'http://www.socialannexstaging.com/public/login/index';
                            }, 2000);
                        }

                    }
                }
            });
        }


    });


    /*New password*/
    var newpwdInput = document.getElementById("newPassword");
    newpwdInput.onkeyup = function () {
        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
        if (newpwdInput.value.match(lowerCaseLetters)) {
            $("#lower").removeClass("ac-red fa-times-circle");
            $("#lower").addClass("ac-green fa-check-circle");
        } else {
            $("#lower").addClass("ac-red fa-times-circle");
            $("#lower").removeClass("ac-green fa-check-circle");
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if (newpwdInput.value.match(upperCaseLetters)) {
            $("#capital").removeClass("ac-red fa-times-circle");
            $("#capital").addClass("ac-green fa-check-circle");
        } else {
            $("#capital").addClass("ac-red fa-times-circle");
            $("#capital").removeClass("ac-green fa-check-circle");
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if (newpwdInput.value.match(numbers)) {
            $("#digit").removeClass("ac-red fa-times-circle");
            $("#digit").addClass("ac-green fa-check-circle");
        } else {
            $("#digit").addClass("ac-red fa-times-circle");
            $("#digit").removeClass("ac-green fa-check-circle");
        }

        // Validate length 
        if (newpwdInput.value.length >= 10) {
            $("#length").removeClass("ac-red fa-times-circle");
            $("#length").addClass("ac-green fa-check-circle");
        } else {
            $("#length").addClass("ac-red fa-times-circle");
            $("#length").removeClass("ac-green fa-check-circle");
        }

        // Validate max length 
        if (newpwdInput.value.length < 41 && newpwdInput.value.length != 0) {
            $("#maxlength").removeClass("ac-red fa-times-circle");
            $("#maxlength").addClass("ac-green fa-check-circle");
        } else {
            $("#maxlength").addClass("ac-red fa-times-circle");
            $("#maxlength").removeClass("ac-green fa-check-circle");
        }

        // Validate special chars
        var specialChar = /[!@#$%'"^&*()_+\-=\[\]{};:\\|,.<>\/?]/;
        if (newpwdInput.value.match(specialChar)) {
            $("#special").removeClass("ac-red fa-times-circle");
            $("#special").addClass("ac-green fa-check-circle");
        } else {
            $("#special").addClass("ac-red fa-times-circle");
            $("#special").removeClass("ac-green fa-check-circle");
        }

        // Validate space 
        if (newpwdInput.value.indexOf(" ") != -1 || newpwdInput.value.length == 0) {
            $("#nospace").addClass("ac-red fa-times-circle");
            $("#nospace").removeClass("ac-green fa-check-circle");
        } else {
            $("#nospace").removeClass("ac-red fa-times-circle");
            $("#nospace").addClass("ac-green fa-check-circle");
        }

        //Check sufficiently different criteria
        var oldpwd = $("#currentPassword").val();
        var newpwd = $("#newPassword").val();
        var perc = 100;
        if ($("#currentPassword").length) {
            var perc = Math.round(similarity(oldpwd, newpwd) * 10000) / 100;
            console.log("macthing", perc);
            if (perc > 50) {
                $("#different").addClass("ac-red fa-times-circle");
                $("#different").removeClass("ac-green fa-check-circle");
            } else {
                $("#different").removeClass("ac-red fa-times-circle");
                $("#different").addClass("ac-green fa-check-circle");
            }
        }

    }

});

function displayMessage(divId, msg) {
    $('#' + divId).html(msg);
    $('#' + divId).show();
    setTimeout(function () {
        $('#' + divId).fadeOut();
    }, 3000);
}
function cancelForm() {
    $("#newPassword-error").hide();
    $("#confirmPassword-error").hide();
    document.getElementById('updatepassword').reset();
}
