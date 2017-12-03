<?php

if(isset($_GET["page"])){
    $page = $_GET["page"];
    if(isset($_GET["name"])){
    	$player = $_GET["name"];
    }
    else
    	$player = "";
}else{
    $page = "home";
    $player = "";
}

?>