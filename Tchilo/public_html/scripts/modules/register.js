window.onload = checkLogin();

var today = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
window.onload = load;
function load() {
    document.getElementById("date-of-birth").max = today.toISOString().split('T')[0];
}
function register() {
    //Create request object
    var textbox = ["firstname", "lastname", "date-of-birth", "emailaddress", "confirmemailaddress", "password"];
    var validation = validation_form(textbox, 'response-message');
    if (validation) {

        var request = new XMLHttpRequest();
        //Create event handler that specifies what should happen when server responds
        request.onload = function () {
            //Check HTTP status code
            if (request.status === 200) {
                //Get data from server
                var responseData = request.responseText;
                document.getElementById("response-message").innerHTML = responseData;
                textbox.forEach(empty_input);
                document.getElementById('male').checked = false;
                document.getElementById('female').checked = false;
            } else
                alert("Error communicating with server: " + request.status);
        };
        //Set up request with HTTP method and URL
        request.open("POST", "PHP_User/add_user.php");
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        //Extract registration data

        var usrFirstName = document.getElementById("firstname").value;
        var usrLastName = document.getElementById("lastname").value;
        var usrDateOfBirth = document.getElementById("date-of-birth").value;
        var usrEmailAddress = document.getElementById("emailaddress").value;
        var usrPassword = document.getElementById("password").value;
        var usrSex = "Not Selected";
        if (document.getElementById('male').checked) {
            usrSex = document.getElementById('male').value;
        }
        if (document.getElementById('female').checked) {
            usrSex = document.getElementById('female').value;
        }
        //Send request
        request.send("firstname=" + usrFirstName +
                "&lastname=" + usrLastName +
                "&date-of-birth=" + usrDateOfBirth +
                "&emailaddress=" + usrEmailAddress +
                "&password=" + usrPassword +
                "&sex=" + usrSex);
    } else {
        document.getElementById("response-message").innerHTML = "Complete empty fields";
    }
}
