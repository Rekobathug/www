window.onload = get_events("ALL");

var evtID, evtName, evtDescription, evtDate, evtTime, evtClub, evtLocation, evtAddress, evtPostcode, evtPrice, evtImage;
var evtPromoters = [];
var evtTables = [];
var perm_evtPromoters = [];
var form1 = ['eventname', 'event-description', 'date-of-event', 'time', 'club', 'location', 'address-1', 'address-2', 'post-code', 'price'];
var form_table = ['tablename', 'tablenumber', 'tableprice'];
var form_e_table = ['e_tablename', 'e_tablenumber', 'e_tableprice'];
var form3 = ['eventimage'];
var form_preview = ['p_eventname', 'p_description', 'p_date', 'p_time', 'p_club', 'p_location', 'p_address', 'p_postcode', 'p_price', 'p_promoters'];
var form_edit = ['e_eventname', 'e_description', 'e_date-of-event', 'e_time', 'e_club', 'e_location', 'e_address', 'e_postcode', 'e_price'];
var messages_create = ['create-response1', 'create-response2', 'create-response3', 'create-response4'];
var messages_update = ['edit_promoters', 'edit-response', 'e_promoters', 'edit_promoters', 'update_image_message'];
// create event functions
function add_event() {
    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        //Check HTTP status code
        if (request.status === 200) {
            //Get data from server
            var responseData = request.responseText;
            alert(responseData);
            document.getElementById("create-response4").innerHTML = responseData;
            message_box(responseData);
            if (responseData === "Event Created") {
                document.getElementById('preview_submit').style.display = 'none';
                document.getElementById('preview_previous').style.display = 'none';
            }

        } else
            alert("Error communicating with server: " + request.status);
    };
    //Set up request with HTTP method and URL
    request.open("POST", "PHP_Org/add_event.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var tables = JSON.stringify(evtTables);
    alert(tables);
    //Send request
    request.send("eventname=" + evtName +
            "&description=" + evtDescription +
            "&date-of-event=" + evtDate +
            "&time=" + evtTime +
            "&club=" + evtClub +
            "&location=" + evtLocation +
            "&address=" + evtAddress +
            "&postcode=" + evtPostcode +
            "&price=" + evtPrice +
            "&tables=" + tables +
            "&promoters=" + JSON.stringify(evtPromoters));

}
function form_1() {

    var val = validation_form(form1, 'create-response1');

    if (val) {

        evtName = document.getElementById('eventname').value;
        evtDescription = document.getElementById('event-description').value;
        evtDate = document.getElementById('date-of-event').value;
        evtTime = document.getElementById('time').value;
        evtClub = document.getElementById('club').value;
        evtLocation = document.getElementById('location').value;
        evtAddress = document.getElementById('address-1').value + document.getElementById('address-2').value;
        evtPostcode = document.getElementById('post-code').value;
        evtPrice = document.getElementById('price').value;

        visibility(['create_2', 'create_1']);
    }

}


function add_table(fields, message, button, check) {
    var val = validation_form(fields, check);

    if (val) {
        var name, number, price;

        name = document.getElementById(fields[0]).value;
        number = document.getElementById(fields[1]).value;
        price = document.getElementById(fields[2]).value;

        var obj = {name: name, number: number, price: price};
        evtTables.push(obj);
        alert(evtTables.toString());
        document.getElementById(message).innerHTML = "";
        for (var i = 0; i < evtTables.length; i++) {
            var table = evtTables[i];
            document.getElementById(message).innerHTML += i + 1 + " - Table name : " + table['name'] + " - Number of tables : " + table['number'] + " - Price : " + table['price'] + '<button onclick="del_table(' + i + ',\'' + message + '\');">X</button> <br>';
        }
        form_table.forEach(empty_input);
        document.getElementById(button).disabled = true;
        alert(JSON.stringify(evtTables));
    }
}
function del_table(index, message) {
    evtTables.splice(index, 1);
    document.getElementById(message).innerHTML = "";
    if (evtTables.length > 0) {
        for (var i = 0; i < evtTables.length; i++) {
            var table = evtTables[i];
            document.getElementById(message).innerHTML += i + 1 + " - Table name : " + table['name'] + " - Number of tables : " + table['number'] + " - Price : " + table['price'] + '<button onclick="del_table(' + i + ',\'' + message + '\');">X</button> <br>';
        }
    } else {
        document.getElementById(message).innerHTML = "No Tables added";
    }
}




function add_promoter(field, message, button) {
    var val = validation_form([field], message);

    if (val) {
        evtPromoters.push(document.getElementById(field).value);
        document.getElementById(field).value = "";
        document.getElementById(message).innerHTML = "";
        for (var i = 0; i < evtPromoters.length; i++) {
            document.getElementById(message).innerHTML += i + 1 + " - " + evtPromoters[i] + '<button onclick="del_promoter(' + i + ',\'' + message + '\');">X</button> <br>';
        }
        alert(message);
        document.getElementById(button).disabled = true;

    }

}
function del_promoter(index, message) {
    alert(message);
    evtPromoters.splice(index, 1);
    document.getElementById(message).innerHTML = "";
    if (evtPromoters.length > 0) {
        for (var i = 0; i < evtPromoters.length; i++) {
            document.getElementById(message).innerHTML += i + 1 + " - " + evtPromoters[i] + '<button onclick="del_promoter(' + i + ',' + message + ');">X</button> <br>';
        }
    } else {
        document.getElementById(message).innerHTML = "No Promoters added";
    }
}
function form_2() {
    var val = validation_form(form3, 'create-response3');
    evtImage = document.getElementById('eventimage');

    if (!evtImage.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {

        alert('not an image');
        val = false;
    }

    if (val) {
        visibility(['create_5', 'create_4']);
        document.getElementById('p_eventname').innerHTML = evtName;
        document.getElementById('p_description').innerHTML = evtDescription;
        document.getElementById('p_date').innerHTML = evtDate;
        document.getElementById('p_time').innerHTML = evtTime;
        document.getElementById('p_club').innerHTML = evtClub;
        document.getElementById('p_location').innerHTML = evtLocation;
        document.getElementById('p_address').innerHTML = evtAddress;
        document.getElementById('p_postcode').innerHTML = evtPostcode;
        document.getElementById('p_price').innerHTML = evtPrice;
        document.getElementById('p_tables').innerHTML = "";
        document.getElementById('p_promoters').innerHTML = "";

        if (evtTables.length > 0) {
            for (var i = 0; i < evtTables.length; i++) {
                var table = evtTables[i];
                document.getElementById('p_tables').innerHTML += i + 1 + " - Table name : " + table['name'] + " - Number of tables : " + table['number'] + " - Price : " + table['price'] + '<button onclick="del_table(' + i + ');">X</button> <br>';
            }
        } else {
            document.getElementById('tables').innerHTML = "No Tables added";
        }
        if (evtPromoters.length > 0) {
            for (var i = 0; i < evtPromoters.length; i++) {
                document.getElementById('p_promoters').innerHTML += i + 1 + " - " + evtPromoters[i];
            }
        } else {
            document.getElementById('p_promoters').innerHTML = "No Promoters added";
        }
        evtImage = document.getElementById('eventimage').value;
        evtImage = evtImage.replace(/.*[\/\\]/, '');
        var image = "PHP_Org/Orgs/" + localStorage["orgID"] + "/Temp-events-images/" + evtImage;
        alert(image);
        document.getElementById('p_eventimage').src = image;

        document.getElementById('preview_submit').style.display = 'block';
        document.getElementById('preview_previous').style.display = 'block';
    } else {
        document.getElementById('create-response3').innerHTML = "Select a Image to Upload";
    }

}
function clean_create_inputs() {
    form1.forEach(empty_input);
    ['promoter'].forEach(empty_input);
    form3.forEach(empty_input);
    form_preview.forEach(empty_text);
    messages_create.forEach(empty_text);
    evtID = evtName = evtDescription = evtDate = evtTime = evtClub = evtLocation = evtAddress = evtPostcode = evtPrice = evtImage = null;
    evtPromoters = [];
    visibility(['create_1', 'create_4']);
    document.getElementById('p_eventimage').src = "";
    get_events("ALL");
    var iframe = document.getElementById("view_imageToUpload");
    var html = "";

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();

}

//edit event functions

function get_events(eventname) {
    var request = new XMLHttpRequest();
    var all_events, event;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            all_events = JSON.parse(request.responseText);

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
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Org/get_events.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("eventname=" + eventname);
}

function get_event_details(id) {
    alert("events : " + id);
    var request = new XMLHttpRequest();
    var event;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            event = JSON.parse(request.responseText);
            if (event.hasOwnProperty("message")) {
                document.getElementById("message").innerHTML = event["message"];
            } else {
                evtID = id;
                document.getElementById('e_eventname').value = event['eventname'];
                document.getElementById('e_description').value = event['description'];
                document.getElementById('e_date-of-event').value = event['dateofevent'];
                document.getElementById('e_time').value = event['time'];
                document.getElementById('e_club').value = event['club'];
                document.getElementById('e_location').value = event['location'];
                document.getElementById('e_address').value = event['address'];
                document.getElementById('e_postcode').value = event['postcode'];
                document.getElementById('e_price').value = event['price'];
                document.getElementById('e_image').src = "PHP_Org/" + event['picture'];
                get_event_promoters(id);
                get_event_tables(id);
                visibility(['edit-event', 'check-events']);
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Org/get_event_details.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idevent=" + id);
}

function get_event_promoters(id) {
    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            evtPromoters = JSON.parse(request.responseText);
            perm_evtPromoters = evtPromoters;
            if (evtPromoters.hasOwnProperty("message")) {
                document.getElementById("edit_promoters").innerHTML = evtPromoters["message"];

            } else {
                document.getElementById('e_promoters').innerHTML = "";
                document.getElementById('edit_promoters').innerHTML = "";
                for (var i = 0; i < evtPromoters.length; i++) {
                    document.getElementById('e_promoters').innerHTML += i + 1 + " - " + evtPromoters[i] + "<br>";
                }
                for (var i = 0; i < evtPromoters.length; i++) {
                    document.getElementById('edit_promoters').innerHTML += i + 1 + " - " + evtPromoters[i] + '<button onclick="del_promoter(' + i + ',\'edit_promoters\')">X</button> <br>';
                }
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Org/get_event_promoters.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idevent=" + id);
}
function get_event_tables(id) {
    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            evtTables = JSON.parse(request.responseText);
            perm_evtTables = evtTables;
            if (evtPromoters.hasOwnProperty("message")) {
                document.getElementById("edit-table-message").innerHTML = evtTables["message"];

            } else {
                document.getElementById("e_tables").innerHTML = "";
                for (var i = 0; i < evtTables.length; i++) {
                    var table = evtTables[i];
                    document.getElementById("e_tables").innerHTML += i + 1 + " - Table name : " + table['name'] + " - Number of tables : " + table['number'] + " - Price : " + table['price'] + '<button onclick="del_table(' + i + ',\'e_tables\');">X</button> <br>';
                }
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Org/get_event_tables.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idevent=" + id);
}


function update_event_promoters() {
    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        //Check HTTP status code
        if (request.status === 200) {
            //Get data from server
            var responseData = request.responseText;
            document.getElementById("edit_promoters").innerHTML = responseData;
            if (responseData === "Details saved") {
                visibility(['edit-menu', 'edit-promoters']);
                get_event_promoters(evtID);
            }
        } else
            alert("Error communicating with server: " + request.status);
    };
    //Set up request with HTTP method and URL
    request.open("POST", "PHP_Org/update_event_promoters.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    //Send request
    request.send("idevent=" + evtID +
            "&promoters=" + JSON.stringify(evtPromoters));
}

function update_event_tables() {
    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        //Check HTTP status code
        if (request.status === 200) {
            //Get data from server
            var responseData = request.responseText;
            document.getElementById("edit-table-message").innerHTML = responseData;
            if (responseData === "Details saved") {
                get_event_tables(evtID);
            }
        } else
            alert("Error communicating with server: " + request.status);
    };
    //Set up request with HTTP method and URL
    request.open("POST", "PHP_Org/update_event_tables.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    var tables = JSON.stringify(evtTables);
    alert(tables);

    //Send request
    request.send("idevent=" + evtID +
            "&tables=" + tables);
}
function update_event_image() {
    var val = validation_form(['new-eventimage'], 'update_image_message');
    evtImage = document.getElementById('new-eventimage');

    if (!evtImage.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {

        alert('not an image');
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
                document.getElementById("update_image_message").innerHTML = responseData;
                ['save_image'].forEach(disabel_input);
                get_event_details(evtID);
            } else
                alert("Error communicating with server: " + request.status);
        };


        //Set up request with HTTP method and URL
        request.open("POST", "PHP_Org/update_event_image.php");
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        //Send request
        request.send("idevent=" + evtID);
    } else {
        document.getElementById("update_image_message").innerHTML = "Error uploading Image";
    }
}
function update_event_details() {

    var val = validation_form(form_edit, 'edit-response');
    if (val) {


        var request = new XMLHttpRequest();
        //Create event handler that specifies what should happen when server responds
        request.onload = function () {
            //Check HTTP status code
            if (request.status === 200) {
                //Get data from server
                var responseData = request.responseText;
                alert(responseData);
                document.getElementById("edit-response").innerHTML = responseData;
                message_box(responseData);
                disable_edit_details();

            } else
                alert("Error communicating with server: " + request.status);
        };

        evtName = document.getElementById('e_eventname').value;
        evtDescription = document.getElementById('e_description').value;
        evtDate = document.getElementById('e_date-of-event').value;
        evtTime = document.getElementById('e_time').value;
        evtClub = document.getElementById('e_club').value;
        evtLocation = document.getElementById('e_location').value;
        evtAddress = document.getElementById('e_address').value;
        evtPostcode = document.getElementById('e_postcode').value;
        evtPrice = document.getElementById('e_price').value;

        //Set up request with HTTP method and URL
        request.open("POST", "PHP_Org/update_event.php");
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        //Send request
        request.send("idevent=" + evtID +
                "&eventname=" + evtName +
                "&description=" + evtDescription +
                "&date-of-event=" + evtDate +
                "&time=" + evtTime +
                "&club=" + evtClub +
                "&location=" + evtLocation +
                "&address=" + evtAddress +
                "&postcode=" + evtPostcode +
                "&price=" + evtPrice);
    }
}

function enable_edit_details() {
    form_edit.forEach(enabel_input);
    ['edit_details'].forEach(disabel_input);
    ['update_details'].forEach(enabel_input);
}
function disable_edit_details() {

    form_edit.forEach(disabel_input);
    ['update_details'].forEach(disabel_input);
    ['edit_details'].forEach(enabel_input);
}

function clean_update_inputs() {
    form_edit.forEach(empty_input);
    disable_edit_details();
    messages_update.forEach(empty_text);
    evtID = evtName = evtDescription = evtDate = evtTime = evtClub = evtLocation = evtAddress = evtPostcode = evtPrice = evtImage = null;
    evtPromoters = [];
    visibility(['check-events', 'edit-event']);
    document.getElementById('e_image').src = "";
    get_events("ALL");
    var iframe = document.getElementById("new_view_imageToUpload");
    var html = "";
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
}

function search_event() {
    var text = document.getElementById("eventsearch").value;
    if (text === "") {
        get_events('ALL');
    } else {
        get_events(text);
    }
}
