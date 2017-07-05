if ((document.URL.indexOf('file')) >= 0) {
} else if (top.location === self.location) {
    top.location.href = "home.html";
}

window.onload = get_orders("ALL");

function get_orders(orders) {

    var request = new XMLHttpRequest();
    var order;
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            var orders = JSON.parse(request.responseText);
            if (orders.hasOwnProperty("message")) {
                document.getElementById("msgorders").innerHTML = orders["message"];
                document.getElementById("table-orders").style.display="none";

            } else {
                // Find a <table> element with id="myTable":
                var table = document.getElementById("table-orders");
                while (table.rows.length > 1) {
                    table.deleteRow(1);
                }
                for (var i = 0; i < orders.length; i++) {
                    order = orders[i];
                    var row = table.insertRow();
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    cell1.innerHTML = order['idorder'];
                    cell2.innerHTML = order['date'];
                    cell3.innerHTML = order['total'];
                    row.setAttribute("onclick", "get_order_details(" + order['idorder'] + ");");
                    ;
                }
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Orders/get_orders.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("orders=" + orders);
}

  function get_order_details(id) {

    var request = new XMLHttpRequest();
    //Create event handler that specifies what should happen when server responds
    request.onload = function () {
        if (request.status === 200) {
            alert(request.responseText);
            var order = JSON.parse(request.responseText);
            if (orders.hasOwnProperty("message")) {
                document.getElementById("msgorderdetails").innerHTML = orders["message"];
                alert(order["message"]);
            } else {
              document.getElementById("date").innerHTML ="Date of purchase :"+ order["date"];
              document.getElementById("numberofitems").innerHTML ="numberofitems :" + order["numberofitems"];
              document.getElementById("total").innerHTML ="Total : "+ order["total"];
              get_order_items(id);
              visibility(['orders-details','orders']);
            }
        } else {
            alert("Error communicating with server: " + request.status);
        }
    };
    //Set up and send request
    request.open("POST", "PHP_Orders/get_order_details.php");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("idorder=" + id);

  }

  function get_order_items(id) {

      var request = new XMLHttpRequest();
      var event;
      //Create event handler that specifies what should happen when server responds
      request.onload = function () {
          if (request.status === 200) {
              var orders = JSON.parse(request.responseText);
              if (orders.hasOwnProperty("message")) {
                  document.getElementById("msgorders").innerHTML = orders["message"];
                  alert(orders["message"]);

              } else {
                  // Find a <table> element with id="myTable":
                  var table = document.getElementById("table-order-details");
                  while (table.rows.length > 1) {
                      table.deleteRow(1);
                  }
                  for (var i = 0; i < orders.length; i++) {
                      event = orders[i];
                      var row = table.insertRow();
                      var cell1 = row.insertCell(0);
                      var cell2 = row.insertCell(1);
                      var cell3 = row.insertCell(2);
                      var cell4 = row.insertCell(3);
                      cell1.innerHTML = event['eventname'];
                      cell2.innerHTML = event['dateofevent'];
                      cell3.innerHTML = event['price'];
                      cell4.innerHTML = event['quantity'];
                      ;
                  }
              }
          } else {
              alert("Error communicating with server: " + request.status);
          }
      };
      //Set up and send request
      request.open("POST", "PHP_Orders/get_order_items.php");
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.send("idorder=" + id);
  }

  function search_orders() {
      var name = document.getElementById("ordersearch").value;

      if (name === "") {
        get_orders("ALL");
          document.getElementById("table-orders").style.display="block";
      } else {
          get_orders(name);
      }
  }
