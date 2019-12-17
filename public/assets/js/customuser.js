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


function s22HideShowErrorDiv(id, message, second, callback) {
    var second = second || 2000;
    if (message != '' && typeof message != 'undefined')
        document.getElementById(id).innerHTML = message;
    document.getElementById(id).style.display = "block";
    setTimeout(function () {
        if (typeof callback == 'function') {
            callback();
        }
        $('#' + id).fadeOut('fast');
        document.getElementById(id).innerHTML = "";

    }, second);
}

function s22XmlHttpRequest(url, type, data, successcallback, errorcallback) {
    var type = type || 'GET';
    var data = data || '';
    var saveData = $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: "text",
        success: function (resultData) {
            if (typeof successcallback == 'function') {
                successcallback(resultData);
            }
        }
    });
    saveData.error(function () {
        if (typeof errorcallback == 'function') {
            errorcallback();
        }
    });
}

jQuery.validator.addMethod('passmatch', function (value, element, param) {
    if (value == document.getElementById("newpassword").value) {
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
jQuery.validator.addMethod("differentpwd", function (value, element) {
    var oldpwd = $("#currentpassword").val();
    var newpwd = $("#newpassword").val();
    var perc = 100;
    if (oldpwd != '') {
        var perc = Math.round(similarity(oldpwd, newpwd) * 10000) / 100;
    }
    if (perc > 50) {
        console.log("if", perc);
        $("#different").addClass("ac-red fa-times-circle");
        $("#different").removeClass("ac-green fa-check-circle");
        return false;
    } else {
        console.log("else", perc);
        $("#different").removeClass("ac-red fa-times-circle");
        $("#different").addClass("ac-green fa-check-circle");
        return true;
    }
});

jQuery.validator.addMethod("nospace", function (value, element) {
    if (document.getElementById('newpassword').value.indexOf(" ") != -1) {
        return false;
    } else {
        return true;
    }
});

$(document).ready(function () {

    $('#updatepassword').validate({
        rules: {
            currentpassword: {
                required: true,
                remote: {
                    url: '/public/userprofile/profilesetting/checkoldpassword',
                    method: 'post'
                }
            },
            newpassword: {
                required: true,
                pwcheck: true,
                nospace: true,
                differentpwd: true,
                minlength: 10,
                maxlength: 40
            },
            confirmpassword: {
                required: true,
                equalTo: "#newpassword"
            }

        },
        messages: {
            currentpassword: {
                required: "Please enter your current password.",
                remote: 'Entered password is incorrect.'
            },
            newpassword: {
                required: "Please enter new password.",
                pwcheck: "Please match the password criteria.",
                nospace: "Please match the password criteria.",
                differentpwd: "Please match the password criteria.",
                minlength: 'Please match the password criteria.',
                maxlength: 'Please match the password criteria.'
            },
            confirmpassword: {
                required: "Please enter confirm password.",
                equalTo: 'Entered password does not match.'
            }
        }
    });


    document.getElementById("updatepwd").addEventListener("click", function () {
        if ($('#updatepassword').valid()) {

            var oldpwd = $("#currentpassword").val();
            var newpwd = $("#newpassword").val();
            console.log("Success");
            var postdata = {'oldpwd': oldpwd, 'newpwd': newpwd};
            s22XmlHttpRequest('/public/userprofile/profilesetting/updatepassword', 'POST', postdata, function (responseArray) {
                console.log(responseArray);
                var responsedata = JSON.parse(responseArray);
                if (responsedata != '') {
                    if (responsedata['status'] == 1) {
                        s22HideShowErrorDiv("success_alert", "Password changed successfully!!<br>You will automatically logout within 2 seconds.", 2000, function () {
                            window.location = 'http://www.socialannexstaging.com/public/login/logoutnew/flag/1';
                        });
                    } else if (responsedata['status'] == 2) {
                        s22HideShowErrorDiv("error_alert", "Old and new passwords are not match!!", 3000);
                    } else if (responsedata['status'] == 3) {
                        s22HideShowErrorDiv("error_alert", "Not allowed to use last two password!!!", 3000);
                        $("#lasttwopwd").addClass("ac-red fa-times-circle");
                    } else if (responsedata['status'] == 0) {
                        s22HideShowErrorDiv("error_alert", "Something went wrong please try again!!", 3000);
                    }

                }
            });

        }
    });


    /*New password*/
    var newpwdInput = document.getElementById("newpassword");
    newpwdInput.onkeyup = function () {
        $("#lasttwopwd").removeClass("ac-red fa-times-circle");
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
        var oldpwd = $("#currentpassword").val();
        var newpwd = $("#newpassword").val();
        var perc = 100;
        if (oldpwd != '') {
            var perc = Math.round(similarity(oldpwd, newpwd) * 10000) / 100;
        }
        console.log("macthing", perc)
        if (perc > 50) {
            $("#different").addClass("ac-red fa-times-circle");
            $("#different").removeClass("ac-green fa-check-circle");
        } else {
            $("#different").removeClass("ac-red fa-times-circle");
            $("#different").addClass("ac-green fa-check-circle");
        }

    }

});


