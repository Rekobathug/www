<?php

//Start session management
session_start();
//fields
$fields = array('idbasket');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo "Error field not found : ". $_POST[$field] . ' : ' . $field . '"}';
        $check = true;
    }
}

if ($check) {
    echo 'Error submiting form.<br> All fields are required.';
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

        echo 'Connection unsuccessfull';
    } else {


        //Extract the data that was sent to the server
        $idbasket = filter_input(INPUT_POST, 'idbasket', FILTER_SANITIZE_STRING);


        $filter_idbasket = (int) preg_replace("/[^0-9]+/", "", $idbasket);


        //sql querry string
        $sql = "DELETE FROM guestlist.baskets WHERE idbasket=$idbasket;";

        if ($conn->query($sql) === TRUE) {
            echo 'Deleted';
        } else {
            echo 'Error : ' . $conn->error;
        }
    }
}
