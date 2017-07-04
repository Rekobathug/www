<?php

//Start session management
session_start();

//fields
$fields = array('newemailaddress');

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
            $sql = "SELECT emailaddress,password FROM guestlist.user WHERE idUser='$user_id';";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) == 1) {


                $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
                $filter_password = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $password);
                $row = mysqli_fetch_assoc($result);
                $pass = $row['password'];

                if ($filter_password === $pass) {

                    $email = filter_input(INPUT_POST, 'newemailaddress', FILTER_SANITIZE_STRING);
                    $filter_newemail = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $email);
                    $old_email = $row['emailaddress'];

                    if ($filter_newemail === $old_email) {
                        echo 'Email same as old';
                    } else {


                        $sql = "UPDATE user SET emailaddress='$filter_newemail' WHERE idUser=$user_id";

                        if (mysqli_query($conn, $sql)) {
                            echo 'Email saved';
                        } else {
                            echo 'Error updating record:' . mysqli_error($conn);
                        }
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

