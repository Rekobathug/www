<?php

//Start session management
session_start();
//fields
$fields = array('orders');

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
    //Check file data has been sent
    if (!array_key_exists("loggedInUserId", $_SESSION)) {
        echo '{"message" : "No user loggedin"}';
    } else {
        //Extract the data that was sent to the server
        $order = filter_input(INPUT_POST, 'orders', FILTER_SANITIZE_STRING);
        //filter data
        $filter_order= preg_replace("/[^a-zA-Z0-9]+/", "", $order);
        //sql querry
        if ($filter_order === "ALL") {

              //get user id
              $user_id = $_SESSION['loggedInUserId'];
                  //sql querry
                  $sql = "SELECT idorder,date,total FROM guestlist.orders  WHERE iduser='$user_id' ORDER BY  date DESC ;";
        } else {
                  //sql querry
                  $sql = "SELECT idorder,date,total FROM guestlist.orders  WHERE idorder LIKE '$filter_order%' OR  date LIKE '$filter_order%' OR total LIKE '$filter_order%'  ORDER BY  date DESC ;";
        }


        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {

            echo '[';
            $i = 0;
            while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
                if ($i > 0) {
                    echo ',';
                }
                echo'{"idorder" : "' . $row[0]
                . '", "date" : "' . $row[1]
                . '", "total" : "' . $row[2] . '"}';
                $i++;
            }
            echo ']';
        } else {
            echo '{"message" : "0 items in your basket "}';
        }
    }
    $conn->close();
}
}
