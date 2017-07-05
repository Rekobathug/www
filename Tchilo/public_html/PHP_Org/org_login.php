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


    //Check if user is logged in
    if (!array_key_exists("loggedInUserId", $_SESSION)) {
        echo '{"message" : "No user loggedin"}';
    } else {

        //get user id
        $user_id = $_SESSION['loggedInUserId'];

        //sql querry
        $sql = "SELECT idorganization,orgname,admin,email,description,phonenumber,icon FROM guestlist.organization WHERE admin='$user_id';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);

            //Start session for this user
            $_SESSION['orgID'] = $row['idorganization'];
            $_SESSION['orgname'] = $row['orgname'];
            echo '{"orgname" : "' . $row['orgname']
            . '", "orgid" : "' . $row['idorganization']
            . '", "icon" : "' . $row['icon'] . '"}';
        } else {
            echo '{"message" : "No Org found for this user"}';
        }
    }
    $conn->close();
}
