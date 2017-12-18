<?php
require_once('config.inc.php');
set_time_limit(45);

//Disable these after debugging
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

$db = new mysqli("localhost", "u", "p", "japro_web") or die(mysqli_error());

?>
