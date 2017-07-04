<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idbasket', 'quantity');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo 'Error field not found :' . $_POST[$field] . ' : ' . $field . '';
        $check = true;
    }
}

if ($check) {
    echo 'Error submiting form.<br> All fields are required.';
} else {
    $servername = "localhost";
    $username = "root";
    $password = "damaia";
    $dbname = "guestlist";
// Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());

        echo 'Connection unsuccessfull';
    } else {

        //Extract the data that was sent to the server
        $basket_id = filter_input(INPUT_POST, 'idbasket', FILTER_SANITIZE_STRING);
        $quantity = filter_input(INPUT_POST, 'quantity', FILTER_SANITIZE_STRING);

        //filter data
        $filter_basket_id = preg_replace("/[^0-9]+/", "", $basket_id);
        $filter_quantity = preg_replace("/[^0-9]+/", "", $quantity);
        
        $sql = "UPDATE baskets SET quantity=$filter_quantity WHERE idbasket='$basket_id';";
        if (mysqli_query($conn, $sql)) {
            echo 'quantity updated';
        } else {
            echo 'Error updating record:' . mysqli_error($conn);
        }
    }
}
