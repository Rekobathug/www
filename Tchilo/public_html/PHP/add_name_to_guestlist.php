<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idevent', 'names', 'promoter');

// Loop over field names, make sure each one exists and is not empty
$check = false;
foreach ($fields as $field) {
    if (empty($_POST[$field])) {
        echo 'Error field not found :' . $_POST[$field] . ' : ' . $field . '';
        $check = true;
    }
}

if ($check) {
    echo 'Error submiting form.<br> All fields are required.';
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
        if (json_decode($_POST['names'], true)) {
            $names = json_decode($_POST['names'], true);

            $event_id = filter_input(INPUT_POST, 'idevent', FILTER_SANITIZE_STRING);
            $promoter = filter_input(INPUT_POST, 'promoter', FILTER_SANITIZE_STRING);

            //filter data
            $filter_event_id = preg_replace("/[^0-9]+/", "", $event_id);
            $filter_promoter = preg_replace("/[^a-zA-Z0-9 ]+/", "", $promoter);
            //get org id
            $user_id = $_SESSION['loggedInUserId'];

            //sql querry
            $sql = "SELECT guestlistID FROM guestlist.events WHERE idevent='$filter_event_id';";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) == 1) {
                $row = mysqli_fetch_assoc($result);
                $file = $row['guestlistID'];
            } else {
                echo 'Error : ' . $conn->error;
            }




            $check = true;
            for ($x = 0; $x < sizeof($names); $x++) {
                //sql querry string
                $sql = "INSERT INTO guestlist (idevent,iduser,name,promoter)
        VALUES ($filter_event_id,$user_id,'$filter_promoter','$names[$x]')";

                if ($conn->query($sql) === TRUE) {


                    $object = (object) ['userid' => $user_id, 'name' => $names[$x], 'ref-promoter' => $filter_promoter, 'check' => "0"];

                    $json = json_decode(file_get_contents("../PHP_Org/$file"), TRUE);


                    array_push($json['Guestlist'], $object); 

                    file_put_contents("../PHP_Org/$file", json_encode($json));
                } else {
                    echo 'Error : ' . $conn->error;
                    echo "$x ";
                    $check = false;
                }
            }


            if ($check) {
                echo "Names added to $filter_promoter guestlist";
            } else {
                echo '<br> Error adding name to guestlist record';
            }
        } else {
            echo 'Error getting promoters values';
        }
        $conn->close();
    }
}

    