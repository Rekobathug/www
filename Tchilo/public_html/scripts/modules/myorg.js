window.onload = checkOrg();


function checkOrg() {

    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
      alert(request.responseText);
        orgDetails = JSON.parse(request.responseText);
        if (orgDetails.hasOwnProperty("message")) {
            document.getElementById("message").innerHTML = orgDetails["message"];
            window.location="home.html";
        } else {

            document.getElementById("orgname").innerHTML = orgDetails["orgname"];
            document.getElementById("icon").src = value = orgDetails["icon"];
            orgID = orgDetails["orgid"];
            localStorage["orgID"] = orgDetails["orgid"];
            alert(orgID);
        }
    };
    //Set up and send request
    request.open("GET", "PHP_Org/org_login.php");
    request.send();
}
