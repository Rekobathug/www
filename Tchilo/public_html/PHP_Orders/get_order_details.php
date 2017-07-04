<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idorder');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo '';
        echo '{"message" : "Error field not found : ' . $_POST[$field] . ' : ' . $field . '"}';
        $check = true;
    }
}

if ($check) {
    echo '{"message" : "Error geting orderIDs."}';
} else {
//set server
    $servername = "localhost";
    $username = "root";
    $password = "damaia";
    $dbname = "guestlist";
// Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());

        echo '{"message" : "Connection unsuccessfull"}';
    } else {

      $order_id = filter_input(INPUT_POST, 'idorder', FILTER_SANITIZE_STRING);
      //filter data
      $filter_order_id = preg_replace("/[^0-9]+/", "", $order_id);
      //sql querry
      $sql = "SELECT numberofitems,date,total FROM guestlist.orders WHERE idorder='$order_id';";
      $result = mysqli_query($conn, $sql);
      if (mysqli_num_rows($result) == 1) {

        $row = mysqli_fetch_assoc($result);
        echo '{"numberofitems" : "' . $row['numberofitems']
        . '", "date" : "' . $row['date']
        . '", "total" : "' . $row['total'] . '"}';
      } else {
        echo '{"message" : "Error getting order details: '. $conn->error .'"}';
      }
    }
  }
