if ((document.URL.indexOf('file')) >= 0) {
    } else if (top.location === self.location) {
        top.location.href = "home.html";
    }
    window.onload = load;
    function load() {
        get_details();
        document.getElementById("date-of-birth").max = today.toISOString().split('T')[0];
    }

    // naem of elements to turn disabel
    var details_fields = ["firstname", "lastname", "date-of-birth", "male", "female", 'save_details'];
    var email_fields = ['save_email'];
    var password_fields = ['new_password', 'confirm_new_password'];

    // name os elements to hidde and display
    var details_box = ['panel_details', 'panel_password', 'panel_options', 'panel_email'];
    var email_box = ['panel_email', 'panel_details', 'panel_password', 'panel_options'];
    var password_box = ['panel_password', 'panel_details', 'panel_options', 'panel_email'];
    var options_box = ['panel_options', 'panel_details', 'panel_password', 'panel_email'];

    // name of message elements
    var message_text = ['message_details', 'message_password', 'message_email'];

    // name of input fields to validate
    var details = ["firstname", "lastname", "date-of-birth"];
    var email = ['password', 'new_email', 'confirm_new_email'];
    var pass = ['current_password', 'new_password', 'confirm_new_password'];

    // get date for date picker
    var today = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

    function get_details() {
        var request = new XMLHttpRequest();
        var usrDetails;
        //Create event handler that specifies what should happen when server responds
        request.onload = function () {
            if (request.status === 200) {
                alert(request.responseText);
                usrDetails = JSON.parse(request.responseText);
                if (usrDetails.hasOwnProperty("message")) {
                    document.getElementById("message_details").innerHTML = usrDetails["message"];
                } else {
                    document.getElementById("user_id").value = usrDetails["user_id"];
                    document.getElementById("firstname").value = usrDetails["firstname"];
                    document.getElementById("lastname").value = usrDetails["lastname"];
                    document.getElementById("date-of-birth").value = usrDetails["date-of-birth"];
                    if (usrDetails["sex"] === "male") {
                        document.getElementById('male').checked = true;
                    }
                    if (usrDetails["sex"] === "female") {
                        document.getElementById('female').checked = true;
                    }
                }
            }
        };
        //Set up and send request
        request.open("GET", "PHP_User/get_user_details.php");
        request.send();
    }


    function update_details() {
        var val = validation_form(details, 'message_details');
        if (val) {
            var request = new XMLHttpRequest();
            //Create event handler that specifies what should happen when server responds
            request.onload = function () {
                //Check HTTP status code
                if (request.status === 200) {
                    //Get data from server
                    var responseData = request.responseText;
                    document.getElementById("message_details").innerHTML = responseData;
                    get_details();
                    details_fields.forEach(disabel_input);
                } else
                    alert("Error communicating with server: " + request.status);
            };
            //Set up request with HTTP method and URL
            request.open("POST", "PHP_User/update_user.php");
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            //Extract registration data
            var usrFirstName = document.getElementById("firstname").value;
            var usrLastName = document.getElementById("lastname").value;
            var usrDate_of_birth = document.getElementById("date-of-birth").value;
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
                    "&date-of-birth=" + usrDate_of_birth +
                    "&sex=" + usrSex);
        } else {
            document.getElementById("message_details").innerHTML = "Complete empty fields:";
        }
    }

    function update_email() {
        var val = validation_form(email, 'message_email');
        if ((document.getElementById('new_email').value !== document.getElementById('confirm_new_email').value) && (val)) {
            document.getElementById('message_email').innerHTML = "New emails does not match";
            email.forEach(empty_input);
            email_fields.forEach(disabel_input);
            val = false;
        }

        if (val) {
            var request = new XMLHttpRequest();
            //Create event handler that specifies what should happen when server responds
            request.onload = function () {
                //Check HTTP status code
                if (request.status === 200) {
                    //Get data from server
                    var responseData = request.responseText;
                    document.getElementById("message_email").innerHTML = responseData;
                    email.forEach(empty_input);
                    email_fields.forEach(disabel_input);
                } else
                    alert("Error communicating with server: " + request.status);
            };
            //Set up request with HTTP method and URL
            request.open("POST", "PHP_User/update_user_email.php");
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            //Extract registration data
            var usrEmail = document.getElementById("new_email").value;
            var usrPassword = document.getElementById("password").value;
            //Send request
            request.send("newemailaddress=" + usrEmail
                    + "&password=" + usrPassword);
        }
    }


    function update_password() {

        var val = validation_form(pass, 'message_password');
        if ((document.getElementById('new_password').value !== document.getElementById('confirm_new_password').value) && (val)) {
            document.getElementById('message_password').innerHTML = "new passwords does not match";
            pass.forEach(empty_input);
            val = false;
        }
        if (val) {

            var request = new XMLHttpRequest();
            request.onload = function () {
                //Check HTTP status code
                if (request.status === 200) {
                    //Get data from server
                    var responseData = request.responseText;
                    document.getElementById("message_password").innerHTML = responseData;
                    pass.forEach(empty_input);
                    password_fields.forEach(disabel_input);
                } else
                    alert("Error communicating with server: " + request.status);
            };
            //Set up request with HTTP method and URL
            request.open("POST", "PHP_User/update_user_password.php");
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            //Extract registration data
            var usrPassword = document.getElementById("current_password").value;
            var usrNewpassword = document.getElementById("new_password").value;

            //Send request
            request.send("password=" + usrPassword +
                    "&newpassword=" + usrNewpassword);
        }
    }

    function panel() {
        message_text.forEach(empty_text);
        details.forEach(reset_input);
        details_fields.forEach(disabel_input);
        email.forEach(empty_input);
        email.forEach(reset_input);
        email_fields.forEach(disabel_input);
        pass.forEach(empty_input);
        pass.forEach(reset_input);
        password_fields.forEach(disabel_input);
    }
