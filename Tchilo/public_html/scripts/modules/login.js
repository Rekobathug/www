window.onload = checkLogin();

var request = new XMLHttpRequest();
var usrType;
function login() {
    //Create request object
    var textbox = ["emailaddress", "password"];
    var validation = validation_form(textbox, 'server-message');
    if (validation) {
        //Create event handler that specifies what should happen when server responds
        request.onload = function () {
            //Check HTTP status code
            if (request.status === 200) {
                alert(request.responseText);
                //Get data from server
                var responseData = JSON.parse(request.responseText);

                if(responseData['message'] === "Login successfull"){
                  window.location = "home.html";
                } else {
                document.getElementById("server-message").innerHTML = responseData['message'];
                }
            } else
                document.getElementById("server-message").innerHTML = "Error communicating with server";
        };
        //Extract login data
        var usrEmail = document.getElementById("emailaddress").value;
        var usrPassword = document.getElementById("password").value;
        //Set up and send request
        request.open("POST", "PHP_user/login.php");
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("emailaddress=" + usrEmail + "&password=" + usrPassword);
    } else {
        document.getElementById("ErrorMessages").innerHTML = "Complete empty fields:";
    }
}
