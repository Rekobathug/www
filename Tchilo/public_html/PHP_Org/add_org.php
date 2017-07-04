<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('orgname', 'description', 'email', 'phonenumber');

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


        //Extract the data that was sent to the server
        $orgname = ucfirst(strtolower(filter_input(INPUT_POST, 'orgname', FILTER_SANITIZE_STRING)));
        $description = ucfirst(strtolower(filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING)));
        $email = strtolower(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_STRING));
        $phonenumber = filter_input(INPUT_POST, 'phonenumber', FILTER_SANITIZE_STRING);

        $filter_orgname = preg_replace("/[^a-zA-Z]+/", "", $orgname);
        $filter_description = preg_replace("/[^a-zA-Z]+/", "", $description);
        $filter_email = preg_replace("/[^a-zA-Z]+/", "", $email);
        $filter_phonenumber = preg_replace("/[^0-9-]+/", "", $phonenumber);
        $image = "No Image";

        //get user id
        $user_id = $_SESSION['loggedInUserId'];



        //sql querry string
        $sql = "INSERT INTO organization (orgname,admin,email,description,phonenumber, icon)
        VALUES ('$filter_orgname','$user_id','$filter_email' ,'$filter_description', '$filter_phonenumber', '$image' )";

        if ($conn->query($sql) === TRUE) {

            //sql querry
            $sql = "SELECT idorganization FROM guestlist.organization WHERE admin='$user_id';";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) == 1) {
                $row = mysqli_fetch_assoc($result);

                $name = "ORG-" + $row['idorganization'];

                //The name of the directory that we need to create.
                $directoryName = "./Orgs/$name";
                $directoryName2 = "./Orgs/$name/Events-Images";
                $directoryName3 = "./Orgs/$name/Temp-events-images";

                //Check if the directory already exists.
                if (!is_dir($directoryName)) {
                    //Directory does not exist, so lets create it.
                    mkdir($directoryName, 0755, true);
                    if (!is_dir($directoryName2)) {
                        mkdir($directoryName2, 0755, true);
                        if (!is_dir($directoryName3)) {
                            mkdir($directoryName3, 0755, true);
                            echo 'Registration successfully';
                        } else {
                            echo '{"message" : "Error creating folder 3"}';
                        }
                    } else {
                        echo '{"message" : "Error creating folder 2"}';
                    }
                } else {
                    echo '{"message" : "Error creating folder 1"}';
                }
            } else {
                echo '{"message" : "Error getting org details"}';
            }
        } else {
            echo 'Error : ' . $conn->error;
        }
        $conn->close();
    }
}
