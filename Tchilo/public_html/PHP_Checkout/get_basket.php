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
        $sql = "SELECT events.eventname, events.dateofevent,events.price,baskets.quantity,baskets.idbasket
FROM baskets 
INNER JOIN events ON baskets.idevent=events.idevent WHERE iduser='$user_id';";
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {

            echo '[';
            $i = 0;
            while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
                if ($i > 0) {
                    echo ',';
                }
                echo'{"eventname" : "' . $row[0]
                . '", "dateofevent" : "' . $row[1]
                . '" , "price" : "' . $row[2]
                . '" , "quantity" : "' . $row[3]
                . '", "idbasket" : "' . $row[4] . '"}';
                $i++;
            }
            echo ']';
        } else {
            echo '{"message" : "0 items in your basket "}';
        }
    }
    $conn->close();
}