/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var userlog, usrID, orgID;
//Checks whether user is logged in.
function checkLogin() {

    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        alert(request.responseText);
        if (request.responseText !== "Session not started") {
            userlog = true;
            if (window.location.pathname.split('/').pop() === "home.html") {
                user_name = JSON.parse(request.responseText);
                document.getElementById("nav2").style.display = "block";
                document.getElementById("nav3").style.display = "block";
                document.getElementById("nav4").style.display = "block";
                document.getElementById("nav5").style.display = "block";
                document.getElementById("nav7").style.display = "block";
                document.getElementById("nav8").style.display = "block";
                document.getElementById("nav6").childNodes[0].innerHTML = "Sign Out";
                document.getElementById("nav8").childNodes[0].innerHTML = "welcome " + user_name["username"];
                if (user_name.hasOwnProperty("orgname")) {
                    document.getElementById("nav9").style.display = "block";
                    document.getElementById("nav9").childNodes[0].innerHTML = user_name["orgname"];
                }



            } else if (window.location.pathname.split('/').pop() !== "myorg.html") {
                window.location = "home.html";
            }
            localStorage['log'] = "true";
        } else {
            userlog = false;
            localStorage['log'] = "false";
        }
    };
    //Set up and send request
    request.open("GET", "PHP_User/check_session.php");
    request.send();
}

function logout() {
    var request = new XMLHttpRequest();
    if (userlog === true) {
        //Create event handler that specifies what should happen when server responds
        request.onload = function () {
            if (request.responseText === "ok") {
                location.reload();
            }
        };
        //Set up and send request
        request.open("GET", "PHP_User/logout.php");
        request.send();
    } else {
        window.location = "login.html";
    }
}

function validate_leters(field) {
    var string = document.getElementById(field).value;
    string = string.replace(/[^a-zA-Z]/g, "");
    document.getElementById(field).value = string;
}
function validate_numbers(field) {
    var string = document.getElementById(field).value;
    string = string.replace(/[^0-9]/g, "");
    document.getElementById(field).value = string;
}
function validate_chars(field) {
    var string = document.getElementById(field).value;
    string = string.replace(/[^a-zA-Z0-9@._-]/g, "");
    document.getElementById(field).value = string;
}
function empty_input(item, index, arr) {
    document.getElementById(arr[index]).value = "";
}
function empty_text(item, index, arr) {
    document.getElementById(arr[index]).innerHTML = "";
}

function visibility(panel) {
    for (var i = 0; i < panel.length; i++) {
        if (i === 0) {
            document.getElementById(panel[i]).style.display = 'block';
        } else {
            document.getElementById(panel[i]).style.display = 'none';
        }
    }
}

function visibility2(panel) {
    for (var i = 0; i < panel.length; i++) {
        if (i === 0) {
            if (document.getElementById(panel[i]).style.display === 'block') {
                document.getElementById(panel[i]).style.display = 'none';

            } else {
                document.getElementById(panel[i]).style.display = 'block';
            }
        } else {
            document.getElementById(panel[i]).style.display = 'none';
        }
    }
}

function disabel_input(item, index, arr) {
    document.getElementById(arr[index]).disabled = true;
}
function enabel_input(item, index, arr) {
    document.getElementById(arr[index]).disabled = false;
}
function reset_input(item, index, arr) {
    document.getElementById(arr[index]).style.border = "1px solid grey";
}

function validation_form(fields, response) {

    var validation = false;
    var inputs = "";
    document.getElementById(response).innerHTML = "";
    for (var i = 0; i < fields.length; i++) {
        if (document.getElementById(fields[i]).value === "") {
            validation = false;
            inputs += fields[i] + "<br>";
            document.getElementById(fields[i]).style.border = "2px solid red";
            document.getElementById(response).innerHTML = "complete empty fields";
        } else if (inputs === "") {
            validation = true;
            document.getElementById(fields[i]).style.border = "1px solid grey";
        } else {
            document.getElementById(fields[i]).style.border = "1px solid grey";
        }

    }
    return validation;

}
function button_val(fields, button) {
    var validation = false;
    for (var i = 0; i < fields.length; i++) {
        //alert(fields[i]);
        if (document.getElementById(fields[i]).value === "") {
            validation = false;
            break;
        } else {
            validation = true;
        }
    }
    if (validation) {
        document.getElementById(button).disabled = false;
    } else {
        document.getElementById(button).disabled = true;
    }
}

function message_box(msg) {
    visibility2(['myModal']);
    document.getElementById("message-box").innerHTML = msg;
}
