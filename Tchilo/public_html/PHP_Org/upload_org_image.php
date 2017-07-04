<?php

//Start session management
session_start();
echo 'imageee';
//Check file data has been sent
if (!array_key_exists("imageToUpload", $_FILES)) {
    echo 'File missing.';
    return;
}
if ($_FILES["imageToUpload"]["name"] == "" || $_FILES["imageToUpload"]["name"] == null) {
    echo 'File missing.';
    return;
}

/*  Check if image file is a actual image or fake image
  tmp_name is the temporary path to the uploaded file. */
if (getimagesize($_FILES["imageToUpload"]["tmp_name"]) === false) {
    echo "File is not an image.";
    return;
}
// Check file size
if ($_FILES["imageToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    return;
}


// get image
$uploadFileName = $_FILES["imageToUpload"]["name"];
// Check that the file is the correct type
$imageFileType = pathinfo($uploadFileName, PATHINFO_EXTENSION);
if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    return;
}



//Get the content of the image and then add slashes to it
$imagetmp = addslashes(file_get_contents($_FILES['imageToUpload']['tmp_name']));

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
    $sql = "SELECT idOrganization FROM guestlist.organization WHERE admin='$user_id';";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) == 1) {
        $row = mysqli_fetch_assoc($result);
        $name =$row['idorganization'];
        //Specify where file will be stored
        $target_file = "PHP_Org/Orgs/$name/" . $uploadFileName;

        /* Files are uploaded to a temporary location.
          Need to move file to the location that was set earlier in the script */
        if (move_uploaded_file($_FILES["imageToUpload"]["tmp_name"], "../" . $target_file)) {

            $sql = "UPDATE organization SET  icon='$target_file' WHERE admin=$user_id";

            if ($conn->query($sql) === TRUE) {
                echo '<p>Uploaded image: <img src="../' . $target_file . '"  style="width: 300px;"></p>'; //Include uploaded image on page
            } else {
                echo 'Error : ' . $conn->error;
            }
        } else {
            echo "Sorry, there was an error uploading your file.";
            return;
        }
    } else {
        echo "Sorry, there was an error uploading your file. Org not found";
    }
}
