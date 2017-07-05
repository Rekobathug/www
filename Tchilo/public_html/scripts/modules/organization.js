if ((document.URL.indexOf('file')) >= 0) {
} else if (top.location === self.location) {
    top.location.href = "home.html"
}
function register_org() {
    //Create request object
    var textbox = ["organizationname", "org-description", "org-email", "org-phonenumber"];
    var validation = validation_form(textbox, 'create-response');
    if (validation) {

        var request = new XMLHttpRequest();
        //Create event handler that specifies what should happen when server responds
        request.onload = function () {
            alert("request status");
            //Check HTTP status code
            if (request.status === 200) {
                alert(request.responseText);
                //Get data from server
                var responseData = request.responseText;

                if (responseData === "Registration successfully") {
                    visibility(['create-icon', 'create-details'])
                }

                document.getElementById("create-response").innerHTML = responseData;
            } else
                alert("Error communicating with server: " + request.status);
        };


        //Set up request with HTTP method and URL
        request.open("POST", "PHP_Org/add_org.php");
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        //Extract registration data
        var orgName = document.getElementById("organizationname").value;
        var orgDescription = document.getElementById("org-description").value;
        var orgEmail = document.getElementById("org-email").value;
        var orgPhonenumber = document.getElementById("org-phonenumber").value;

        //Send request
        request.send("orgname=" + orgName +
                "&description=" + orgDescription +
                "&email=" + orgEmail +
                "&phonenumber=" + orgPhonenumber);
    } else {
        document.getElementById("create-response").innerHTML = "Complete empty fields";
    }
}

var line = 0, linesearch = 0;
var text = "ALL";
var guestnames = [];
var evtID, evtTables;
var promotername, price, total_price, quantity;
var divs = ['events-1', 'events-2', 'events-3', 'events-search'];
var colnum = 0, reserves = 0;
var line = "0";
window.onload = get_organizations("ALL", "0");
function get_organizations(orgname, linenumber) {

    var request = new XMLHttpRequest();
    var all_orgs, org;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            all_orgs = JSON.parse(request.responseText);
            if (all_orgs.length === 0) {

                if (orgname === "ALL") {
                    document.getElementById('message').innerHTML = "No more orgs";
                    linesearch = 0;
                } else {
                    document.getElementById("orgs-search").innerHTML += "<p id='message-search'></p>";
                    document.getElementById('message-search').innerHTML = "No more orgs";
                }

                return;
            }
            // Find a <table> element with id="myTable":
            var table = document.getElementById("table-orgs");

            if (linenumber === 0) {
                while (table.rows.length > 1) {
                    table.deleteRow(1);
                }
            }

            for (var i = 0; i < all_orgs.length; i++) {
                if (colnum === 0) {
                    var row = table.insertRow();
                }
                org = all_orgs[i];
                var btn = document.createElement("A"); // Create a <button> element
                btn.setAttribute("onclick", 'get_org_details(\'' + org['idorg'] + '\')');
                btn.setAttribute("class", "view");
                btn.setAttribute("width", "350");
                btn.setAttribute("height", "400");
                var h3 = document.createElement("H3");
                var title = document.createTextNode(org['orgname']);
                h3.appendChild(title);
                var image = document.createElement("IMG");
                image.setAttribute("src", org['picture']);
                image.setAttribute("width", "200");
                image.setAttribute("alt", org['orgname']);
                var br = document.createElement("BR");
                btn.appendChild(h3);
                btn.appendChild(br);
                btn.appendChild(image);
                // Append the button to body;
                if (orgname === "ALL") {
                    var cell1 = row.insertCell(colnum);
                    cell1.insertBefore(btn, cell1.childNodes[0]);
                } else {
                    var div = document.getElementById("orgs-search");
                    div.insertBefore(btn, div.childNodes[0]);
                }
                if (orgname === "ALL") {
                    colnum++;
                    if (colnum === 4) {
                        colnum = 0;
                    }
                }
            }




        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Organizations/get_organizations.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("orgname=" + orgname
            + "&linenumber=" + linenumber);
}

function search_org() {
    var name = document.getElementById("orgsearch").value;
    if (name === "") {
        visibility(['orgs', 'orgs-search']);
        alert("all");
        text = "ALL";
        document.getElementById("orgs-search").innerHTML = "<p id='message-search'></p>";
    } else {

        document.getElementById("orgs-search").innerHTML = "<p id='message-search'></p>";
        get_organizations(name);
        visibility(['orgs-search', 'orgs']);
        alert("name");
        text = name;
    }
}


function get_org_details(id) {

    var request = new XMLHttpRequest();
    var org;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            org = JSON.parse(request.responseText);
            if (org.hasOwnProperty("message")) {
                document.getElementById("message").innerHTML = org["message"];
            } else {

                document.getElementById('view-organizationname').innerHTML = org['orgname'];
                document.getElementById('view-org-description').innerHTML = org['description'];
                document.getElementById('view-org-email').innerHTML = org['email'];
                document.getElementById('view-org-phonenumber').innerHTML = org['phonenumber'];
                document.getElementById('view-org-image').src = org['icon'];
                visibility(['vieworgsinfo', 'vieworgs']);
                get_org_events(id);
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Organizations/get_organization_details.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idorg=" + id);
}

function get_org_events(id) {

    var request = new XMLHttpRequest();
    var all_events,event;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            all_events = JSON.parse(request.responseText);
            if (all_events.hasOwnProperty("message")) {
                document.getElementById("message").innerHTML = all_events["message"];
            } else {
                // Find a <table> element with id="myTable":
                var table = document.getElementById("table-events");
                while (table.rows.length > 1) {
                    table.deleteRow(1);
                }
                for (var i = 0; i < all_events.length; i++) {
                    event = all_events[i];
                    var row = table.insertRow();
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    cell1.innerHTML = event['eventname'];
                    cell2.innerHTML = event['dateofevent'];
                    row.setAttribute("onclick", "get_event_details(" + event['idevent'] + ");");
                }


            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Organizations/get_organization_events.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idorg=" + id);
}
