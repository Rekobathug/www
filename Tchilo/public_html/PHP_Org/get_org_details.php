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
        $org_id = $_SESSION['orgID'];

        //sql querry
        $sql = "SELECT orgname,admin,email,description,phonenumber,icon FROM guestlist.organization WHERE idorganization='$org_id';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);
            echo '{"orgname" : "' . $row['orgname']
            . '", "admin" : "' . $row['admin']
            . '" , "email" : "' . $row['email']
            . '" , "description" : "' . $row['description']
            . '", "phonenumber" : "' . $row['phonenumber']
            . '", "icon" : "' . $row['icon'] . '"}';
        } else {
            echo '{"message" : "Error getting User details"}';
        }
    }
    $conn->close();
}
