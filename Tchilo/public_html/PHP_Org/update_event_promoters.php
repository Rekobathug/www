<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idevent', 'promoters');

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

        if (json_decode($_POST['promoters'], true)) {
            $promoters = json_decode($_POST['promoters'], true);

            $promoters_names = json_encode($promoters, true);
            $event_id = filter_input(INPUT_POST, 'idevent', FILTER_SANITIZE_STRING);
            //filter data
            $filter_event_id = preg_replace("/[^0-9 ]+/", "", $event_id);

            //get org id
            $org_id = $_SESSION['orgID'];
            $sql = "UPDATE events SET promoters='$promoters_names' WHERE idevent=$event_id";

            if (mysqli_query($conn, $sql)) {
                echo 'Details saved';
            } else {
                echo 'Error updating record:' . mysqli_error($conn);
            }
        } else {
            echo 'Error getting promoters values';
        }
        $conn->close();
    }
}
