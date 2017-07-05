window.onload = get_org_details();

// name of elementes to turn disabel
var org_details_fields = ['org-name', 'org-description', 'org-email', 'org-phonenumber', 'org-save'];


// name of inputs to check
var org_details = ['org-name', 'org-description', 'org-email', 'org-phonenumber'];
function get_org_details() {

    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        alert(request.responseText);
        orgDetails = JSON.parse(request.responseText);
        if (orgDetails.hasOwnProperty("message")) {
            document.getElementById("message_details").innerHTML = orgDetails["message"];
        } else {
            document.getElementById("org-name").value = orgDetails["orgname"];
            document.getElementById("org-image-view").src = value = orgDetails["icon"];
            document.getElementById("org-description").value = orgDetails["description"];
            document.getElementById("org-email").value = orgDetails["email"];
            document.getElementById("org-phonenumber").value = orgDetails["phonenumber"];

        }
    };
    //Set up and send request
    request.open("GET", "PHP_Org/get_org_details.php");
    request.send();
}

function update_org_details() {
    var val = validation_form(org_details, 'message-org-details');
    if (val) {
        var request = new XMLHttpRequest();
        //Create event handler that specifies what should happen when server responds
        request.onload = function () {
            //Check HTTP status code
            if (request.status === 200) {
                //Get data from server
                var responseData = request.responseText;
                document.getElementById("message-org-details").innerHTML = responseData;
                org_details_fields.forEach(disabel_input);
            } else
                alert("Error communicating with server: " + request.status);
        };
        //Set up request with HTTP method and URL
        request.open("POST", "PHP_Org/update_org_details.php");
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        //Extract data
        var orgName = document.getElementById("org-name").value;
        var orgDescription = document.getElementById("org-description").value;
        var orgEmail = document.getElementById("org-email").value;
        var orgPhonenumber = document.getElementById("org-phonenumber").value;

        //Send request
        request.send("orgname=" + orgName +
                "&description=" + orgDescription +
                "&email=" + orgEmail +
                "&phonenumber=" + orgPhonenumber);
    } else {
        document.getElementById("message-org-details").innerHTML = "Complete empty fields:";
    }
}
