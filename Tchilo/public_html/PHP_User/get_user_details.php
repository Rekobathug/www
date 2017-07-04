<?php

//Start session management
session_start();

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
        //get user id
        $user_id = $_SESSION['loggedInUserId'];

        //sql querry
        $sql = "SELECT emailaddress,firstname,lastname,dateofbirth,sex FROM guestlist.user WHERE idUser='$user_id';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);

            echo '{"firstname" : "' . $row['firstname']
            . '", "lastname" : "' . $row['lastname']
            . '" , "emailaddress" : "' . $row['emailaddress']
            . '" , "date-of-birth" : "' . $row['dateofbirth']
            . '", "sex" : "' . $row['sex'] . '"}';
        } else {
            echo '{"message" : "Error getting User details"}';
        }
    }
    $conn->close();
}