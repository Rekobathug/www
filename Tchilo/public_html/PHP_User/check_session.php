<?php
//Start session management
session_start();

//Find out if session exists
if( array_key_exists("loggedInUserId", $_SESSION) ){

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
    
    //get user id
        $user_id = $_SESSION['loggedInUserId'];
      //sql querry
        $sql = "SELECT orgname FROM guestlist.organization WHERE admin='$user_id';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);
            echo '{"username" :'.json_encode($_SESSION['loggedInUserName']).', "orgname" : "'.$row['orgname'].'"}';
        } else {
            echo '{"username" :'.json_encode($_SESSION['loggedInUserName']).'}';
        } 
}
}
else{
     echo 'Session not started';
}
