<?php

//Start session management
session_start();
//var_dump($_REQUEST);
//fields
$fields = array('firstname', 'lastname', 'dateofbirth', 'emailaddress','sex', 'password');

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


    /* $host="localhost";
      $port=3306;
      $socket="";
      $user="root";
      $password="damaia";
      $dbname="guestlist";

      $con = new mysqli($host, $user, $password, $dbname, $port, $socket)
      or die ('Could not connect to the database server' . mysqli_connect_error());
     */

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
        $firstname =ucfirst(strtolower( filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_STRING)));
        $lastname = ucfirst(strtolower(filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_STRING)));
        $date_of_birth = filter_input(INPUT_POST, 'dateofbirth', FILTER_SANITIZE_STRING);
        $email = strtolower(filter_input(INPUT_POST, 'emailaddress', FILTER_SANITIZE_STRING));
        $sex = filter_input(INPUT_POST, 'sex', FILTER_SANITIZE_STRING);
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);

        //filter data
        $filter_firstname = preg_replace("/[^a-zA-Z]+/", "", $firstname);
        $filter_lastname = preg_replace("/[^a-zA-Z]+/", "", $lastname);
        $filter_date_of_birth = preg_replace("/[^0-9-]+/", "", $date_of_birth);
        $filter_email = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $email);
        $filter_sex = preg_replace("/[^a-zA-Z]+/", "", $sex);
        $filter_password = preg_replace("/[^a-zA-Z0-9@.\\_\\-]+/", "", $password);

        //sql querry string
        $sql = "INSERT INTO user (firstname, lastname,dateofbirth, emailaddress,sex, password)
VALUES ('$filter_firstname', '$filter_lastname', '$filter_date_of_birth' , '$filter_email','$filter_sex', '$filter_password')";
      
        if ($conn->query($sql) === TRUE) {
            echo 'Registration successfully';
        } else {
            echo 'Error : '.$conn->error ;
        }

    $conn->close();
    }
}
