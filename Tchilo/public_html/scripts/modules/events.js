if ((document.URL.indexOf('file')) >= 0) {
} else if (top.location === self.location) {
    top.location.href = "home.html"
}


window.onload = get_events("ALL", line);

var line = 0, linesearch = 0;
var text = "ALL";
var guestnames = [];
var evtID, evtTables;
var promotername, price, total_price, quantity;
var divs = ['events-1', 'events-2', 'events-3', 'events-search'];
var colnum = 0, reserves = 0;

function get_events(eventname, linenumber) {

    var request = new XMLHttpRequest();
    var all_events, event;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            all_events = JSON.parse(request.responseText);
            if (all_events.length === 0) {

                if (eventname === "ALL") {
                    document.getElementById('message').innerHTML = "No more Events";
                    linesearch = 0;
                } else {
                    document.getElementById("events-search").innerHTML += "<p id='message-search'></p>";
                    document.getElementById('message-search').innerHTML = "No more Events";
                }

                return;
            }
            // Find a <table> element with id="myTable":
            var table = document.getElementById("table-events");


            if(linenumber === 0){
              while (table.rows.length > 1) {
                  table.deleteRow(1);
              }
            }
            for (var i = 0; i < all_events.length; i++) {
              if(colnum === 0){
              var row = table.insertRow();
            }
                event = all_events[i];
                var btn = document.createElement("A"); // Create a <button> element
                btn.setAttribute("onclick", 'get_event_details(\'' + event['idevent'] + '\')');
                btn.setAttribute("class", "view");
                btn.setAttribute("width", "350");
                btn.setAttribute("height", "400");
                var h3 = document.createElement("H3");
                var title = document.createTextNode(event['eventname']);
                h3.appendChild(title);
                var image = document.createElement("IMG");
                image.setAttribute("src", "PHP_Org/" + event['picture']);
                image.setAttribute("width", "200");
                image.setAttribute("alt", "The Pulpit Rock");
                var text = document.createTextNode('Date:' + event['dateofevent'] + ' Price:£' + event['price']);
                var br = document.createElement("BR");
                btn.appendChild(h3);
                btn.appendChild(image);
                btn.appendChild(br);
                btn.appendChild(text);
                // Append the button to body;
                if (eventname === "ALL") {
                  var cell1 = row.insertCell(colnum);
                  cell1.insertBefore(btn,cell1.childNodes[0]);
                } else {
                    var div = document.getElementById("events-search");
                    div.insertBefore(btn, div.childNodes[0]);
                }
                if (eventname === "ALL") {
                colnum++;
                if (colnum === 4) {
                    colnum = 0;
                }
              }
            }

            if (eventname === "ALL") {
                line += all_events.length;
            } else {
                linesearch += all_events.length;
            }

        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP/get_events.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("eventname=" + eventname
            + "&linenumber=" + linenumber);
}
function search_event() {
    var name = document.getElementById("eventsearch").value;
    if (name === "") {
        visibility(['events', 'events-search']);
        alert("all");
        text = "ALL";
        document.getElementById("events-search").innerHTML = "<p id='message-search'></p>";
    } else {
        document.getElementById("events-search").innerHTML = "<p id='message-search'></p>";
        get_events(name);
        visibility(['events-search', 'events']);
        alert("name");
        text = name;
    }
}

function get_event_details(id) {
    alert(localStorage['log']);
    if (localStorage['log'] === "true") {

        document.getElementById("get-ticket").style.display = "block";
        document.getElementById("get-name").style.display = "block";
        document.getElementById("get-table").style.display = "block";
        document.getElementById('info-message').innerHTML = "";
    }
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
                price = parseInt(event['price']);
                document.getElementById('eventname').innerHTML = event['eventname'];
                document.getElementById('description').innerHTML = event['description'];
                document.getElementById('date-of-event').innerHTML = event['dateofevent'];
                document.getElementById('time').innerHTML = event['time'];
                document.getElementById('club').innerHTML = event['club'];
                document.getElementById('location').innerHTML = event['location'];
                document.getElementById('address').innerHTML = event['address'];
                document.getElementById('postcode').innerHTML = event['postcode'];
                document.getElementById('price').innerHTML = event['price'];
                document.getElementById('eventimage').src = "PHP_Org/" + event['picture'];
                get_event_promoters(id);
                visibility(['checkevent', 'viewevents']);
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP/get_event_details.php");
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
                document.getElementById("message").innerHTML = evtPromoters["message"];

            } else {
                document.getElementById('promoters').innerHTML = "<br><br>";
                document.getElementById('promo').innerHTML = "<br><br>";
                for (var i = 0; i < evtPromoters.length; i++) {
                    document.getElementById('promoters').innerHTML += i + 1 + " - " + evtPromoters[i] + "<br>";
                }

                for (var i = 0; i < evtPromoters.length; i++) {
                    document.getElementById('promo').innerHTML += '<input type="radio" onclick="promoter(\'' + evtPromoters[i] + '\')" name="promoter" id=' + evtPromoters[i] + ' value=' + evtPromoters[i] + '>' + evtPromoters[i];
                }
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP/get_event_promoters.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idevent=" + id);
}

function get_event_tables() {
    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            evtTables = JSON.parse(request.responseText);
            document.getElementById('tables-layout').innerHTML = "";
            alert(evtTables[1]);
            for (var i = 0; i < evtTables.length; i++) {
                var table = evtTables[i];
                alert(table['name']);
                document.getElementById('tables-layout').innerHTML += i + 1 + " - Table name : " + table['name'] + " - Number of tables : " + table['number'] + " - Price : " + table['price'] + '   <button onclick="reserve_table(\'' + table['name'] + '\');">Reserve</button> <br>';
            }
            alert("done");
            /* var ul = document.createElement('ul');

             document.getElementById('message-reserve').innerHTML = "There is " + (evtTables - reserved) + " tables left to reserve";

             document.getElementById('tables-layout').appendChild(ul);
             var count = 0;
             for (var i = 0; i < evtTables; i++) {
             if (count === 0) {
             var li = document.createElement('li');
             ul.appendChild(li);
             }

             var img = document.createElement('img');
             li.appendChild(img);
             img.setAttribute("id", i);

             if (i < reserved) {
             img.setAttribute("src", "images/square-x.png");
             img.setAttribute("onclick", "alert( '" + i + " tsble reserved');");
             } else {
             img.setAttribute("src", "images/square.png");

             img.setAttribute("onclick", "select_table('" + i + "');");
             }

             img.setAttribute("height", "100");
             count++;
             if (count === 3) {
             count = 0;
             }


             }
             */



        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP/get_event_tables.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idevent=" + evtID);

    /* var ul = document.createElement('ul');

     document.getElementById('tables-layout').appendChild(ul);
     var count = 0;
     for (var i = 0; i < evtTables; i++) {
     if (count === 0) {
     var li = document.createElement('li');
     ul.appendChild(li);
     }

     var img = document.createElement('img');
     li.appendChild(img);
     img.setAttribute("id", i);
     img.setAttribute("src", "images/square.png");
     img.setAttribute("height", "100");
     //img.setAttribute("onclick", "clickx(" + index + ");");
     count++;
     if (count === 3) {
     count = 0;
     }


     }*/
}
function reserve_table(tablename) {
    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        //Check HTTP status code
        if (request.status === 200) {
            //Get data from server
            var responseData = request.responseText;
            if (responseData === "Table reserved") {
                document.getElementById("tables-layout").innerHTML = responseData + "<br> Please go to Tickets page to get yout Reserve Ticket";
            } else {
                document.getElementById("tables-layout").innerHTML = responseData;
            }
        } else
            alert("Error communicating with server: " + request.status);
    };
    //Set up request with HTTP method and URL
    request.open("POST", "PHP/reserve_table.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //Send request
    request.send("idevent=" + evtID +
            "&tablename=" + tablename);
}

function select_table(table) {
    if (reserves === 0) {
        reserves++;
        alert(table);
        document.getElementById(table).src = "images/square-s.png";
        document.getElementById("reserve").style.display = "block";

    } else {
        document.getElementById('message-reserve').innerHTML = "You can only reserve 1 table";
    }
}

function promoter(name) {
    promotername = name;
}

function add_name(field, message, button) {
    var val = validation_form([field], message);
    if (guestnames.length === 5) {
        val = false;
    }
    if (val) {
        guestnames.push(document.getElementById(field).value);
        document.getElementById(field).value = "";
        document.getElementById(message).innerHTML = "";
        for (var i = 0; i < guestnames.length; i++) {
            document.getElementById(message).innerHTML += i + 1 + " - " + guestnames[i] + '<button onclick="del_name(' + i + ',\'' + message + '\');">X</button> <br>';
        }
        count = guestnames.length;
        document.getElementById("promo-message").innerHTML = count + " Added";
        document.getElementById(button).disabled = true;
        if (count === 5) {
            document.getElementById(field).disabled = true;
        }
    }

}
function del_name(index, message) {
    guestnames.splice(index, 1);
    document.getElementById(message).innerHTML = "";
    if (guestnames.length < 5) {
        document.getElementById("name").disabled = false;
    }
    if (evtPromoters.length > 0) {
        for (var i = 0; i < guestnames.length; i++) {
            document.getElementById(message).innerHTML += i + 1 + " - " + guestnames[i] + '<button onclick="del_name(' + i + ',' + message + ');">X</button> <br>';
        }
    } else {
        document.getElementById(message).innerHTML = "No names added";
    }

}

function add_name_to_guestlist() {
    alert(promotername);
    //var today = new Date();
    //var date = today.toISOString().split('T')[0];
    if (promotername === undefined) {
        document.getElementById("names").innerHTML = "Choose a promoter";
    } else {
        if (guestnames.length === 0) {
            document.getElementById("names").innerHTML = "Add at least 1 name";
        } else {

            var request = new XMLHttpRequest();
            //Create event handler that specifies what should happen when server responds
            request.onload = function () {
                //Check HTTP status code
                if (request.status === 200) {
                    //Get data from server
                    var responseData = request.responseText;
                    document.getElementById("names").innerHTML = responseData;
                } else
                    alert("Error communicating with server: " + request.status);
            };
            //Set up request with HTTP method and URL
            request.open("POST", "PHP/add_name_to_guestlist.php");
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //Send request
            request.send("idevent=" + evtID +
                    "&names=" + JSON.stringify(guestnames) +
                    "&promoter=" + promotername);
        }
    }
}
function open_quantity() {


    document.getElementById('add-to-basket').style.display = "block";
    document.getElementById('get-ticket').style.display = "none";
    document.getElementById('get-table').style.display = "none";
    document.getElementById('get-name').style.display = "none";
}
function close_quantity() {


    document.getElementById('add-to-basket').style.display = "none";
    document.getElementById('get-ticket').style.display = "block";
    document.getElementById('get-table').style.display = "block";
    document.getElementById('get-name').style.display = "block";
}

function total() {
    quantity = parseInt(document.getElementById('quantity').value);
    if (quantity > 0) {
        total_price = quantity * price;
        document.getElementById('total').innerHTML = "Total price:" + total_price;
        document.getElementById('basket_but').disabled = false;
    } else {
        total_price = 0;
        document.getElementById('total').innerHTML = "Select at least 1";
        document.getElementById('basket_but').disabled = true;
    }
}
function add_to_basket() {
    alert('basket');
    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        //Check HTTP status code
        if (request.status === 200) {
            //Get data from server
            var responseData = request.responseText;
            document.getElementById("total").innerHTML = responseData;
            document.getElementById('quantity').value = "";
            document.getElementById('basket_but').disabled = true;
        } else
            alert("Error communicating with server: " + request.status);
    };
    //Set up request with HTTP method and URL
    request.open("POST", "PHP/add_to_basket.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //Send request
    request.send("idevent=" + evtID +
            "&quantity=" + quantity);
}


$(window).scroll(function () {
    if ($('#viewevents').css('display') === 'block')
    {
        if ($('#events').css('display') === 'block')
        {
            if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
                get_events(text, line);
            }
        }
        if ($('#events-search').css('display') === 'block')
        {
            if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
                get_events(text, linesearch);
            }
        }
    }
});
