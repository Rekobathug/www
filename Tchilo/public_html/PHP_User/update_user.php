<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('firstname', 'lastname', 'date-of-birth', 'sex');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo '{"message" : "' . $_POST[$field] . ' : ' . $field . '"}';
        $check = true;
    }
}

if ($check) {
    echo '<br> Error submiting form.<br> All fields are required.';
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
//Check file data has been sent
        if (!array_key_exists("loggedInUserId", $_SESSION)) {
            echo 'No user loggedin';
        } else {
            //get user id
            $user_id = $_SESSION['loggedInUserId'];

            //Extract the data that was sent to the server
            $firstname = ucfirst(strtolower(filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_STRING)));
            $lastname = ucfirst(strtolower(filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_STRING)));
            $date_of_birth = filter_input(INPUT_POST, 'date-of-birth', FILTER_SANITIZE_STRING);
            $sex = strtolower(filter_input(INPUT_POST, 'sex', FILTER_SANITIZE_STRING));

            //filter data
            $filter_firstname = preg_replace("/[^a-zA-Z]+/", "", $firstname);
            $filter_lastname = preg_replace("/[^a-zA-Z]+/", "", $lastname);
            $filter_date_of_birth = preg_replace("/[^0-9-]+/", "", $date_of_birth);
            $filter_sex = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $sex);

            $sql = "UPDATE user SET firstname='$filter_firstname',lastname='$filter_lastname',dateofbirth='$filter_date_of_birth',sex='$filter_sex' WHERE idUser=$user_id";

            if (mysqli_query($conn, $sql)) {
                echo 'Details saved';
            } else {
                echo 'Error updating record:' . mysqli_error($conn);
            }
        }
        $conn->close();
    }
}
