<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('idevent');

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
        //filter data
        $filter_event_id = preg_replace("/[^0-9]+/", "", $event_id);
        if (!array_key_exists("EventImageName", $_SESSION)) {
            echo 'No Image found';
        } else {
            $event_image = $_SESSION['EventImageName'];
            $org_id = $_SESSION['orgID'];
            // create image name
            $move_image = rename("Orgs/$org_id/Temp-events-images/" . $event_image, "Orgs/$org_id/Events/$filter_event_id/$filter_event_id" . $event_image);
            if ($move_image === true) {
                $image_name = "Orgs/$org_id/Events/$filter_event_id/" . $event_image;


                //sql querry
                $sql_image = "SELECT picture FROM guestlist.events WHERE idevent='$filter_event_id';";
                $result = mysqli_query($conn, $sql_image);
                if (mysqli_num_rows($result) == 1) {
                    $row = mysqli_fetch_assoc($result);
                    $image_list = "";
                    if (!unlink($row['picture'])) {
                        $image_list = "Error deleting image";
                    } else {
                        $image_list = "Deleted " . $row['picture'];
                    }
                }
                rename("Orgs/$org_id/Events/$filter_event_id/$filter_event_id" . $event_image, "Orgs/$org_id/Events/$filter_event_id/" . $event_image);

                $sql = "UPDATE events SET picture='$image_name' WHERE idevent=$filter_event_id";
                if (mysqli_query($conn, $sql)) {
                    echo ' Image saved';
                } else {
                    echo 'Error updating record:' . mysqli_error($conn);
                }
            } else {
                $image_message = "Event image not save please try upload it again";
            }
        }
    }
    $conn->close();
}
