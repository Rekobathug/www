<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idevent', 'quantity');

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
        $quantity = filter_input(INPUT_POST, 'quantity', FILTER_SANITIZE_STRING);

        //filter data
        $filter_event_id = preg_replace("/[^0-9]+/", "", $event_id);
        $filter_quantity = preg_replace("/[^0-9]+/", "", $quantity);

        //get user id
        $user_id = $_SESSION['loggedInUserId'];


        //sql querry
        $sql = "SELECT quantity FROM guestlist.baskets WHERE iduser='$user_id' AND idevent='$filter_event_id';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);


            $new_quantity = $row['quantity'] + $filter_quantity;
            $sql = "UPDATE baskets SET quantity=$new_quantity WHERE iduser='$user_id' AND idevent='$filter_event_id';";
            if (mysqli_query($conn, $sql)) {
                echo 'added to basket';
            } else {
                echo 'Error updating record:' . mysqli_error($conn);
            }
        } else {

            //sql querry string
            $sql = "INSERT INTO baskets (iduser,idevent,quantity)
        VALUES ($user_id,$filter_event_id,$filter_quantity)";

            if ($conn->query($sql) === TRUE) {
                echo'added to basket';
            } else {

                echo 'Error : ' . $conn->error;
            }
        }
    }
}
