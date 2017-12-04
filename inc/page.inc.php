<?php


$page = "home";
$player = "";
$race = "";

if(isset($_GET["page"])){
    $page = $_GET["page"];
    if(isset($_GET["name"])){
    	$player = $_GET["name"];
    	if(isset($_GET["race"])){
			$race = $_GET["race"];
	   	}
    }
}
?>