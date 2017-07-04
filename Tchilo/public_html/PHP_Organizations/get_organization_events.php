<?php

//Start session management
session_start();
//fields
$fields = array('idorg');

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
        $org_id = filter_input(INPUT_POST, 'idorg', FILTER_SANITIZE_STRING);
        //filter data
        $filter_org_id = preg_replace("/[^0-9 ]+/", "", $org_id);


        $sql = "SELECT idevent,eventname,dateofevent FROM guestlist.events WHERE orgID='$org_id' ORDER BY  dateofevent ASC ;";

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
