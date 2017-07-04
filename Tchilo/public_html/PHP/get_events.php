<?php

//Start session management
session_start();
//fields
$fields = array('eventname', 'linenumber');

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
        $rownumber = filter_input(INPUT_POST, 'linenumber', FILTER_SANITIZE_STRING);
        //filter data
        $filter_eventname = preg_replace("/[^a-zA-Z0-9 ]+/", "", $eventname);
        $filter_rownumber = (int) preg_replace("/[^0-9]+/", "", $rownumber);
        //sql querry
        if ($filter_eventname === "ALL") {

            $sql = "SELECT idevent,eventname,dateofevent,club,price,picture FROM guestlist.events ORDER BY  dateofevent DESC LIMIT $filter_rownumber,4; ";
        } else {

            $sql = "SELECT idevent,eventname,dateofevent,club,price,picture FROM guestlist.events WHERE eventname LIKE '$filter_eventname%' ORDER BY  dateofevent DESC LIMIT $filter_rownumber,5;";
        }


        $result = mysqli_query($conn, $sql);
        //echo 'Error : ' . $conn->error;
        echo '[';
        $i = 0;
        while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {

            if ($i > 0) {
                echo ',';
            }
            echo '{"idevent" : "' . $row[0]
            . '", "eventname" : "' . $row[1]
            . '", "dateofevent" : "' . $row[2]
            . '", "club" : "' . $row[3]
            . '", "price" : "' . $row[4]
            . '", "row" : "' .  $filter_rownumber
            . '", "picture" : "' . $row[5] . '"}';
            $i++;
        }
        echo ']';



        $conn->close();
    }
}
