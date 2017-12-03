<?php

if(isset($_GET["page"])){
    $page = $_GET["page"];
    if(isset($_GET["name"])){
    	$player = $_GET["name"];
    }
}else{
    $page = "home";
}

?>