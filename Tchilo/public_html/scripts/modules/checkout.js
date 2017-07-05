if ((document.URL.indexOf('file')) >= 0) {
} else if (top.location === self.location) {
    top.location.href = "home.html"
}

window.onload = get_basket();
var all_basket;
function get_basket() {
    var request = new XMLHttpRequest();
    var basket;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            all_basket = JSON.parse(request.responseText);
            if (all_basket.hasOwnProperty("message")) {

                document.getElementById("table-basket").style.display = "none";
                document.getElementById("checkout_b1").style.display = "none";
                document.getElementById("message").innerHTML = all_basket["message"];
                alert(all_basket["message"]);

            } else {
                // Find a <table> element with id="myTable":
                var table = document.getElementById("table-basket");
                while (table.rows.length > 1) {
                    table.deleteRow(1);
                }
                var total = 0;
                for (var i = 0; i < all_basket.length; i++) {
                    basket = all_basket[i];
                    var row = table.insertRow();
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    cell1.innerHTML = basket['eventname'];
                    cell2.innerHTML = basket['dateofevent'];
                    cell3.innerHTML = basket['price'];
                    cell4.innerHTML = '<input type="number" name="quantity" id="quantity' + i + '" value="' + basket['quantity'] + '" oninput="check_basket_quantity(\'' + basket['quantity'] + '\',\'' + i + '\');"><button id="update-quantity-' + i + '" style="display:none" onclick="update_basket(\'' + basket['idbasket'] + '\',\'' + i + '\')">Update</button>';
                    cell5.innerHTML = '<button onclick="del_basket(\'' + basket['idbasket'] + '\')">X</button>';
                    ;
                    //row.setAttribute("onclick", "get_event_details(" + event['idevent'] + ");");
                    total = total + (parseInt(basket['price']) * parseInt(basket['quantity']));
                }
                var row = table.insertRow();
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = "SubTotal";
                cell2.innerHTML = total;
                document.getElementById("checkout_b1").disabled = false;
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Checkout/get_basket.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send();
}

function del_basket(idbasket) {

    alert(idbasket);
    var request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            var responseData = request.responseText;
            alert(responseData);
            get_basket();
        } else {
            document.getElementById("message").innerHTML = "Error communicating with server: " + request.status;
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Checkout/delete_basket.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idbasket=" + idbasket);
}
function check_basket_quantity(quantity, id) {
    var new_quantity = document.getElementById("quantity" + id).value;
    if (new_quantity !== quantity) {
        document.getElementById("update-quantity-" + id).style.display = "block";
        document.getElementById("checkout_b1").disabled = true;
    } else {
        document.getElementById("update-quantity-" + id).style.display = "none";
        document.getElementById("checkout_b1").disabled = false;
    }
}
function update_basket(idbasket, id) {

    alert(idbasket);
    var request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            var responseData = request.responseText;
            alert(responseData);
            get_basket();
        } else {
            document.getElementById("message").innerHTML = "Error communicating with server: " + request.status;
        }
    };

    var new_quantity = document.getElementById("quantity" + id).value;
    //Set up and send request
    request.open("POST", "PHP_Checkout/update_basket.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idbasket=" + idbasket
            + "&quantity=" + new_quantity);
}
function view_basket() {

    var basket;
    var table = document.getElementById("check-table-basket");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    var total = 0;
    for (var i = 0; i < all_basket.length; i++) {
        basket = all_basket[i];
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = basket['eventname'];
        cell2.innerHTML = basket['dateofevent'];
        cell3.innerHTML = basket['price'];
        cell4.innerHTML = basket['quantity'];
        ;
        //row.setAttribute("onclick", "get_event_details(" + event['idevent'] + ");");
        total = total + (parseInt(basket['price']) * parseInt(basket['quantity']));
    }
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "SubTotal";
    cell2.innerHTML = total;



}

function add_order() {

    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {

            alert(request.responseText);
            var responseData = request.responseText;
            document.getElementById("msgcheckout").innerHTML = responseData;

            if (responseData === "order submited") {
                document.getElementById("add-order-back").style.display = "none";
                document.getElementById("add-order").style.display = "none";
                document.getElementById("msgcheckout").innerHTML += "<br><br> Go to tickets page to check your tickets";
            }

        } else {
            document.getElementById("msgcheckout").innerHTML = "Error communicating with server: " + request.status;
        }
    };

    //Set up and send request
    request.open("POST", "PHP_Checkout/add_order.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send();
}
