<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('orgname', 'description', 'email', 'phonenumber');

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

        //get user id
        $org_id = $_SESSION['orgID'];

        //Extract the data that was sent to the server
        $orgname = ucfirst(strtolower(filter_input(INPUT_POST, 'orgname', FILTER_SANITIZE_STRING)));
        $description = ucfirst(strtolower(filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING)));
        $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_STRING);
        $phonenumber = filter_input(INPUT_POST, 'phonenumber', FILTER_SANITIZE_STRING);

        //Filter data
        $filter_orgname = preg_replace("/[^a-zA-Z]+/", "", $orgname);
        $filter_description = preg_replace("/[^a-zA-Z]+/", "", $description);
        $filter_email = preg_replace("/[^a-zA-Z]+/", "", $email);
        $filter_phonenumber = preg_replace("/[^0-9-]+/", "", $phonenumber);

        $sql = "UPDATE organization SET orgname='$filter_orgname',description='$filter_description',email='$filter_email',phonenumber='$filter_phonenumber' WHERE idorganization=$org_id";

        if (mysqli_query($conn, $sql)) {
            echo 'Details saved';
        } else {
            echo 'Error updating record:'. mysqli_error($conn) ;
        }
        $conn->close();
    }
}
