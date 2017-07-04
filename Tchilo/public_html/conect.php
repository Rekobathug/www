<?php
$host="localhost";
$port=3306;
$socket="";
$user="root";
$password="damaia";
$dbname="guestlist";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

$sql = "INSERT INTO user (firstName, lastName,dateOfBirth, email,sex)
VALUES ('John', 'Doe','1995-12-03', 'johndoeyty@example.com', 'male')";

if ($con->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $con->error;
}

$con->close();
//$con->close();
