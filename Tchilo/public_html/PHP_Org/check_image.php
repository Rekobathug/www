<?php

//Start session management
session_start();

//Check file data has been sent
if (!array_key_exists("EventImageName", $_SESSION)) {
    echo 'File missing.';
} else {
    echo 'Ok';
    
}
