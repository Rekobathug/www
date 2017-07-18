<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('emailaddress', 'password');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        $check = true;
    }
}

if ($check) {
    echo '{"message" : "<br> Error submiting form.<br> All fields are required."}';
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

        echo '{"message" : "Connection unsuccessfull"}';
    } else {


        //Extract the data that was sent to the server
        $email = strtolower(filter_input(INPUT_POST, 'emailaddress', FILTER_SANITIZE_STRING));
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);

        //filter data
        $filter_email = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $email);
        $filter_password = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $password);

        //get data

        $sql = "SELECT emailaddress, password,idUser,firstname FROM guestlist.user WHERE emailaddress='$filter_email';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            //

            $row = mysqli_fetch_assoc($result);
            $pass = $row['password'];

            if ($pass == $filter_password) {
                echo '{"message" : "Login successfull"}';
                //Start session for this user
                $_SESSION['loggedInUserId'] = $row['idUser'];
                $_SESSION['loggedInUserName'] = $row['firstname'];
            } else {

                echo '{"message" : "Wrong Password"}';
            }
        } else {
            echo '{"message" : "User not found"}';
        }
    }
    $conn->close();
}
