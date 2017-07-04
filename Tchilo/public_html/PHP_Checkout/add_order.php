<?php

//Start session management
session_start();
//var_dump($_REQUEST);

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

    //get user id
    $user_id = $_SESSION['loggedInUserId'];

    //sql querry
    $sql = "SELECT events.eventname, events.dateofevent,events.price,baskets.quantity,baskets.idbasket
                FROM baskets 
                INNER JOIN events ON baskets.idevent=events.idevent WHERE iduser='$user_id';";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        $check = true;
        $items = '[';
        $i = 0;
        $total = 0;
        $number_of_items = 0;
        while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
            if ($i > 0) {
                $items .= ',';
            }
            $items .= '{"eventname" : "' . $row[0]
                    . '", "dateofevent" : "' . $row[1]
                    . '" , "price" : "' . $row[2]
                    . '" , "quantity" : "' . $row[3]
                    . '", "idbasket" : "' . $row[4] . '"}';
            $i++;
            $number_of_items += $row[3];
            $total += ($row[2] * $row[3]);
            $check = false;
        }
        $items .= ']';


        $today = getdate();
        $month = $today['mon'];
        $mday = $today['mday'];
        $year = $today['year'];
        $d = "";
        $m = "";
        if ((int) ($mday) < 10) {
            $d = "0";
        }
        if ((int) ($month) < 10) {
            $m = "0";
        }

        $date = "$year-$m$month-$d$mday";


        $filter_items_1 = json_encode($items, true);
        $filter_items_2 = json_decode($filter_items_1, true);
        //Extract the data that was sent to the server
        //sql querry string
        $sql = "INSERT INTO orders (iduser,items,numberofitems,date,total)
        VALUES ($user_id,'$items',$number_of_items,'$date',$total)";

        if ($conn->query($sql) === TRUE) {
            //sql querry string
            $sql = "DELETE FROM guestlist.baskets WHERE iduser=$user_id;";

            if ($conn->query($sql) === TRUE) {
                echo'order submited';
            } else {
                echo 'Error 2 : ' . $conn->error;
            }
        } else {

            echo 'Error 1 : ' . $conn->error;
        }
    } else {
        echo 'Error : fail to submit order : ' . $conn->error;
    }
}
