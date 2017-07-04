<?php

//Start session management
session_start();
//fields
$fields = array('eventname');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo '{"message" : "Error field not found : "' . $_POST[$field] . ' : ' . $field . '"}';
        $check = true;
    }
}

if ($check) {
    echo '{"message" : "Error submiting form.<br> All fields are required."}';
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


        //Extract the data that was sent to the server
        $eventname = filter_input(INPUT_POST, 'eventname', FILTER_SANITIZE_STRING);
        //filter data
        $filter_eventname = preg_replace("/[^a-zA-Z0-9 ]+/", "", $eventname);

        //get user id
        $org_id = $_SESSION['orgID'];

        //sql querry
        if ($filter_eventname === "ALL") {
            
            $sql = "SELECT idevent,eventname,dateofevent FROM guestlist.events WHERE orgID='$org_id' ORDER BY  dateofevent ASC ;";
        } else {
            
            $sql = "SELECT idevent,eventname,dateofevent FROM guestlist.events WHERE orgID='$org_id' and eventname LIKE '$filter_eventname%' ORDER BY  dateofevent ASC ";
        }


        $result = mysqli_query($conn, $sql);
        echo '[';
        $i = 0;
        while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {

            if ($i > 0) {
                echo ',';
            }
            echo '{"idevent" : "' . $row[0]
            . '", "eventname" : "' . $row[1]
            . '", "dateofevent" : "' . $row[2] . '"}';
            $i++;
        }
        echo ']';



        $conn->close();
    }
}