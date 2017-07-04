<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('eventname', 'description', 'date-of-event', 'time', 'club', 'location', 'address', 'postcode', 'price','tables', 'promoters');

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



        //Check if user is logged in
        if (!array_key_exists("orgID", $_SESSION)) {
            echo '{"message" : "No org logged in"}';
        } else {

            //Extract the data that was sent to the server
            $eventname = filter_input(INPUT_POST, 'eventname', FILTER_SANITIZE_STRING);
            $description = ucfirst(strtolower(filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING)));
            $date_of_event = filter_input(INPUT_POST, 'date-of-event', FILTER_SANITIZE_STRING);
            $time = filter_input(INPUT_POST, 'time', FILTER_SANITIZE_STRING);
            $club = ucfirst(strtolower(filter_input(INPUT_POST, 'club', FILTER_SANITIZE_STRING)));
            $location = ucfirst(strtolower(filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING)));
            $address = ucwords(strtolower(filter_input(INPUT_POST, 'address', FILTER_SANITIZE_STRING)));
            $post_code = strtoupper(filter_input(INPUT_POST, 'postcode', FILTER_SANITIZE_STRING));
            $price = filter_input(INPUT_POST, 'price', FILTER_SANITIZE_STRING);
            
            //filter data
            $filter_eventname = preg_replace("/[^a-zA-Z0-9 ]+/", "", $eventname);
            $filter_description = preg_replace("/[^a-zA-Z0-9 ]+/", "", $description);
            $filter_date_of_event = preg_replace("/[^0-9-]+/", "", $date_of_event);
            $filter_time = preg_replace("/[^0-9-:]+/", "", $time);
            $filter_club = preg_replace("/[^a-zA-Z0-9 ]+/", "", $club);
            $filter_location = preg_replace("/[^a-zA-Z0-9 ]+/", "", $location);
            $filter_address = preg_replace("/[^a-zA-Z0-9 ]+/", "", $address);
            $filter_post_code = preg_replace("/[^a-zA-Z0-9-]+/", "", $post_code);
            $filter_price = preg_replace("/[^0-9]+/", "", $price);
            
            if ((json_decode($_POST['tables'], true)) &&(json_decode($_POST['promoters'], true)))  {
                $tables = json_decode($_POST['tables'], true);
                $promoters = json_decode($_POST['promoters'], true);
                $guestlist_array = Array();
                // get session variabels
                $org_id = $_SESSION['orgID'];
                $org_name = $_SESSION['orgname'];
                $tables_names = json_encode($tables, true);
                $promoters_names = json_encode($promoters, true);
                //sql querry string
                $sql = "INSERT INTO events (orgID,eventname,description,dateofevent,time,club,location,address,postcode,price,tables,promoters,orgname)
        VALUES ('$org_id','$filter_eventname', '$filter_description', '$filter_date_of_event' , '$filter_time','$filter_club', '$filter_location', '$filter_address','$filter_post_code','$filter_price',' $tables_names','$promoters_names','$org_name')";

                if ($conn->query($sql) === TRUE) {
//sql querry
                    $sql = "SELECT MAX(idevent) FROM guestlist.events where orgID=$org_id;";
                    $result = mysqli_query($conn, $sql);
                    if (mysqli_num_rows($result) == 1) {
                        $row = mysqli_fetch_assoc($result);
                        $event_id = $row['MAX(idevent)'];

                        $directoryName = "./Orgs/$org_id/Events/$event_id";

                        //Check if the directory already exists.
                        if (!is_dir($directoryName)) {
                            //Directory does not exist, so lets create it.
                            mkdir($directoryName, 0755, true);

                            $image_message = "";
                            $image_name = "No image";
                            if (!array_key_exists("EventImageName", $_SESSION)) {
                                echo 'No Image found';
                            } else {
                                $event_image = $_SESSION['EventImageName'];
                                
                                $move_image = rename("Orgs/$org_id/Temp-events-images/" . $event_image, "Orgs/$org_id/Events/$event_id/" . $event_image);
                                if ($move_image === true) {
                                    $image_message = "";
                                    $image_name = "Orgs/$org_id/Events/$event_id/" . $event_image;
                                } else {
                                    $image_message = "Event image not save please try upload it again in 'Edit Events' page";
                                }
                            }
                            // json file array
                            $json = json_encode(array("Guestlist" => $guestlist_array, JSON_PRETTY_PRINT));
                            $json_name = "Orgs/$org_id/Events/$event_id/Guestlist-$event_id.json";
                            //write json to file
                            if (file_put_contents($json_name, $json)) {
                                //sql querry string
                                $sql = "UPDATE events SET guestlistID='$json_name',picture='$image_name' WHERE idevent=$event_id";

                                if (mysqli_query($conn, $sql)) {
                                    echo 'Event Created';
                                } else {
                                    echo 'Error creating events ' . mysqli_error($conn);
                                }
                            } else {
                                echo "Oops! Error creating json file...";
                            }
                        } else {

                            echo 'Error creating event folder';
                        }
                    } else {
                        echo 'Error : ' . $conn->error;
                    }
                } else {
                    echo 'Error : ' . $conn->error;
                }
            } else {

                echo 'error creating event guestlist';
            }
        }
        $conn->close();
    }
}
