<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idevent','eventname', 'description', 'date-of-event', 'time', 'club', 'location', 'address', 'postcode', 'price','tables');

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
        $event_id = filter_input(INPUT_POST, 'idevent', FILTER_SANITIZE_STRING);
        
        $eventname = filter_input(INPUT_POST, 'eventname', FILTER_SANITIZE_STRING);
        $description = ucfirst(strtolower(filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING)));
        $date_of_event = filter_input(INPUT_POST, 'date-of-event', FILTER_SANITIZE_STRING);
        $time = filter_input(INPUT_POST, 'time', FILTER_SANITIZE_STRING);
        $club = ucfirst(strtolower(filter_input(INPUT_POST, 'club', FILTER_SANITIZE_STRING)));
        $location = ucfirst(strtolower(filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING)));
        $address = ucwords(strtolower(filter_input(INPUT_POST, 'address', FILTER_SANITIZE_STRING)));
        $post_code = strtoupper(filter_input(INPUT_POST, 'postcode', FILTER_SANITIZE_STRING));
        $price = filter_input(INPUT_POST, 'price', FILTER_SANITIZE_STRING);
        $tables = filter_input(INPUT_POST, 'tables', FILTER_SANITIZE_STRING);
        
        //filter data
        $filter_event_id = preg_replace("/[^0-9]+/", "", $event_id);
        $filter_eventname = preg_replace("/[^a-zA-Z0-9 ]+/", "", $eventname);
        $filter_description = preg_replace("/[^a-zA-Z0-9 ]+/", "", $description);
        $filter_date_of_event = preg_replace("/[^0-9-]+/", "", $date_of_event);
        $filter_time = preg_replace("/[^0-9-:]+/", "", $time);
        $filter_club = preg_replace("/[^a-zA-Z0-9 ]+/", "", $club);
        $filter_location = preg_replace("/[^a-zA-Z0-9 ]+/", "", $location);
        $filter_address = preg_replace("/[^a-zA-Z0-9 ]+/", "", $address);
        $filter_post_code = preg_replace("/[^a-zA-Z0-9-]+/", "", $post_code);
        $filter_price = preg_replace("/[^0-9]+/", "", $price);
        $filter_tables = preg_replace("/[^0-9]+/", "", $tables);
        
        
        $sql = "UPDATE events SET eventname='$filter_eventname',description='$filter_description',dateofevent='$filter_date_of_event',time='$filter_time',"
                . "club='$filter_club',location='$filter_location',address='$filter_address',postcode='$filter_post_code',price='$filter_price',tables='$filter_tables' WHERE idevent=$filter_event_id";

        if (mysqli_query($conn, $sql)) {
            echo 'Details saved';
        } else {
            echo 'Error updating record:'. mysqli_error($conn) ;
        }
        $conn->close();
    }
}
