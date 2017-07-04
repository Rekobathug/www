<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idevent');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo 'Error field not found : ' . $_POST[$field] . ' : ' . $field . '';
        $check = true;
    }
}

if ($check) {
    echo 'Error geting event IDs.';
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


        $event_id = filter_input(INPUT_POST, 'idevent', FILTER_SANITIZE_STRING);
        //filter data
        $filter_event_id = preg_replace("/[^0-9]+/", "", $event_id);

        //sql querry
        $sql = "SELECT guestlistID FROM guestlist.events WHERE idevent='$event_id';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);

            // Read JSON file
            $json = file_get_contents($row['guestlistID']);

            //encode JSON
            $json_data = json_encode($json);
            echo $json;
        } else {

            echo 'Error getting guestlist name';
        }
    }
}
