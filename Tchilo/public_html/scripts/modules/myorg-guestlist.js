window.onload = get_events("ALL");
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
                row.setAttribute("onclick", "get_guestlist(" + event['idevent'] + ");");
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
function get_guestlist(id) {
    alert("events : " + id);
    var request = new XMLHttpRequest();
    var guestlist;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            guestlist =JSON.parse(request.responseText);
            visibility(['edit-guestlist', 'check-guestlist']);
            if(guestlist['Guestlist'].length === 0){
            document.getElementById('guestlistnames').innerHTML = "0 names in your guestlist";

            }else {


            document.getElementById('guestlistnames').innerHTML = "names";



            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Org/get_guestlist.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idevent=" + id);
}
function search_event() {
    var text = document.getElementById("eventsearch").value;
    if (text === "") {
        get_events('ALL');
    } else {
        get_events(text);
    }
}
