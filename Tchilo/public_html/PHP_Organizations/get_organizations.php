<?php

//Start session management
session_start();
//fields
$fields = array('orgname');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo '{"message" : "Error field value not found : "' . $_POST[$field] . ' : ' . $field . '"}';
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
        $orgname = filter_input(INPUT_POST, 'orgname', FILTER_SANITIZE_STRING);
        $rownumber = filter_input(INPUT_POST, 'linenumber', FILTER_SANITIZE_STRING);
        //filter data
        $filter_orgname = preg_replace("/[^a-zA-Z0-9]+/", "", $orgname);
        $filter_rownumber = (int) preg_replace("/[^0-9]+/", "", $rownumber);
        //sql querry
        if ($filter_orgname === "ALL") {

            $sql = "SELECT idorganization,orgname,icon FROM guestlist.organization ORDER BY idorganization DESC LIMIT $filter_rownumber,4; ";
        } else {

            $sql = "SELECT idorganization,orgname,icon FROM guestlist.organization WHERE orgname LIKE '$filter_orgname%'  LIMIT $filter_rownumber,4;";
        }


        $result = mysqli_query($conn, $sql);

          if (mysqli_num_rows($result) > 0) {
        //echo 'Error : ' . $conn->error;
        echo '[';
        $i = 0;
        while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {

            if ($i > 0) {
                echo ',';
            }
            echo '{"idorg" : "' . $row[0]
            . '", "orgname" : "' . $row[1]
            . '", "picture" : "' . $row[2] . '"}';
            $i++;
        }
        echo ']';
      } else {
          echo '{"message" : "0 orgs found"}';
      }


        $conn->close();
    }
}
