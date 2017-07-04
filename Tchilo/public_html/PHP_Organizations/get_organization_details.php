<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idorg');

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
    echo '{"message" : "Error geting event IDs."}';
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


        $org_id = filter_input(INPUT_POST, 'idorg', FILTER_SANITIZE_STRING);
        //filter data
        $filter_org_id = preg_replace("/[^0-9 ]+/", "", $org_id);

        //sql querry
        $sql = "SELECT orgname,email,description,phonenumber,icon FROM guestlist.organization WHERE idorganization='$org_id';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);
            echo '{"orgname" : "' . $row['orgname']
            . '", "email" : "' . $row['email']
            . '", "description" : "' . $row['description']
            . '", "phonenumber" : "' . $row['phonenumber']
            . '", "icon" : "' . $row['icon'] . '"}';
        } else {

            echo '{"message" : "Error getting event details"}';
        }
    }
}
