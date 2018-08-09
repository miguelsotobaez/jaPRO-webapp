<?php


$page = "home";
$player = "";
$race = "";
$badge = "";
$team = "";

if(isset($_GET["page"])){
    $page = $_GET["page"];
    if(isset($_GET["name"])){
    	$player = $_GET["name"];
    	if(isset($_GET["race"])){
			$race = $_GET["race"];
	   	}
    }
    if(isset($_GET["badge"])){
    	$badge = $_GET["badge"];
    }
    if(isset($_GET["team"])){
        $team = $_GET["team"];
    }
}
?>