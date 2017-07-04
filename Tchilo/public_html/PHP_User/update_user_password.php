<?php

//Start session management
session_start();

//fields
$fields = array('password', 'newpassword');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo "$_POST[$field] : $field,   ";
        $check = true;
    }
}

if ($check) {
    echo "<br> Error submiting form.<br> All fields are required.";
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

            //sql querry
            $sql = "SELECT password FROM guestlist.user WHERE idUser='$user_id';";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) == 1) {


                $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
                $filter_password = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $password);
                $row = mysqli_fetch_assoc($result);
                $pass = $row['password'];

                if ($filter_password === $pass) {

                    $newpassword = filter_input(INPUT_POST, 'newpassword', FILTER_SANITIZE_STRING);
                    $filter_newpassword = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $newpassword);

                    $sql = "UPDATE user SET password='$filter_newpassword' WHERE idUser=$user_id";

                    if (mysqli_query($conn, $sql)) {
                        echo 'password saved';
                    } else {
                        echo 'Error updating record:' . mysqli_error($conn);
                    }
                } else {
                    echo 'wrong password';
                }
            } else {
                echo 'User not found';
            }
        }
        $conn->close();
    }
}
    