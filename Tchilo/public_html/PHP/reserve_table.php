<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idevent', 'tablename');

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
        $event_id = filter_input(INPUT_POST, 'idevent', FILTER_SANITIZE_STRING);
        $tablename = filter_input(INPUT_POST, 'tablename', FILTER_SANITIZE_STRING);

        //filter data
        $filter_event_id = preg_replace("/[^0-9]+/", "", $event_id);
        $filter_tablename = preg_replace("/[^a-zA-Z0-9 ]+/", "", $tablename);



        //sql querry
        $sql = "SELECT tables FROM guestlist.events WHERE idevent='$filter_event_id';";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);
            $tables = json_decode($row['tables']);

            for ($x = 0; $x < sizeof($tables); $x++) {
                if ($tables[$x]->{'name'} === $filter_tablename) {

                    $number = (int) $tables[$x]->{'number'};
                    $number--;
                    $tables[$x]->{'number'} = $number;

                    $tables_names = json_encode($tables, true);
                    $sql = "UPDATE events SET tables='$tables_names' WHERE idevent=$filter_event_id";

                    if (mysqli_query($conn, $sql)) {

                        //get org id
                        $user_id = $_SESSION['loggedInUserId'];

                        //query to insert into tables
                        $sql = "INSERT INTO tables (idevent,iduser,tablename)
                        VALUES ($filter_event_id,$user_id,'$filter_tablename')";

                        if ($conn->query($sql) === TRUE) {

                            echo 'Table reserved';
                        } else {
                            echo 'Error : ' . $conn->error;
                        }
                    } else {
                        echo 'Error updating record:' . mysqli_error($conn);
                    }
                }
            }
        }
    }
}
