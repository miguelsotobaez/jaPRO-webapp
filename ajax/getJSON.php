<?php
require_once('../inc/db_connection.inc.php');
//require_once('../inc/session.inc.php');

$option = $_POST["option"];

switch ($option) {
	case "ladder_saber_top_rank":
		$newArray = null;
	    $query ="SELECT * FROM DuelRanks WHERE type = 0 ORDER BY rank DESC";

	    $arr = sql2arr($query);
	    $count = 1;

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array("id"=>$value["id"],"position"=>$count,"username"=>$value["username"],"rank"=>number_format($value["rank"], 0, ',', ''),"TSSUM"=>number_format($value["TSSUM"], 0, ',', ''));
		    	$count++;
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_saber_duel_count":
		$newArray = null;
	    $query ="SELECT * FROM DuelCounts WHERE type = 0 ORDER BY count DESC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["username"],1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_saber_last_duels":
		$newArray = null;
	    $query ="SELECT * FROM LocalDuel WHERE type = 0";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$duration = date("i:s", $value["duration"] / 1000);
		    	$end_time = date('Y-m-d H:i:s', $value["end_time"]);
		    	$newArray[]=array("id"=>$value["id"],"winner"=>$value["winner"],"loser"=>$value["loser"],"winner_hp"=>$value["winner_hp"],"winner_shield"=>$value["winner_shield"],"duration"=>$duration,"end_time"=>$end_time);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	//FULLFORCE

	case "ladder_fullforce_top_rank":
		$newArray = null;
	    $query ="SELECT * FROM DuelRanks WHERE type = 1 ORDER BY rank DESC";

	    $arr = sql2arr($query);
	    $count = 1;

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array("id"=>$value["id"],"position"=>$count,"username"=>$value["username"],"rank"=>number_format($value["rank"], 0, ',', ''),"TSSUM"=>number_format($value["TSSUM"], 0, ',', ''));
		    	$count++;
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_fullforce_duel_count":
		$newArray = null;
	    $query ="SELECT * FROM DuelCounts WHERE type = 1 ORDER BY count DESC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["username"],1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_fullforce_last_duels":
		$newArray = null;
	    $query ="SELECT * FROM LocalDuel WHERE type = 1";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$duration = date("i:s", $value["duration"] / 1000);
		    	$end_time = date('Y-m-d H:i:s', $value["end_time"]);
		    	$newArray[]=array("id"=>$value["id"],"winner"=>$value["winner"],"loser"=>$value["loser"],"winner_hp"=>$value["winner_hp"],"winner_shield"=>$value["winner_shield"],"duration"=>$duration,"end_time"=>$end_time);
		    }
	    }

	    $json = json_encode($newArray);
	break;


	//GUNS

	case "ladder_guns_top_rank":
		$newArray = null;
	    $query ="SELECT  id, username, type, MAX(rank) AS rank, TSSUM  FROM DuelRanks WHERE type > 1 GROUP BY username, type ORDER BY rank DESC";

	    $arr = sql2arr($query);
	    $count = 1;

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array("id"=>$value["id"],"position"=>$count,"username"=>$value["username"],"type"=>$value["type"],"rank"=>$value["rank"],"TSSUM"=>$value["TSSUM"]);
		    	$count++;
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_guns_duel_count":
		$newArray = null;
	    $query ="SELECT * FROM DuelCounts WHERE type > 1 GROUP BY username";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["username"],1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_guns_last_duels":
		$newArray = null;
	    $query ="SELECT * FROM LocalDuel WHERE type > 1";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$duration = date("i:s", $value["duration"] / 1000);
		    	$end_time = date('Y-m-d H:i:s', $value["end_time"]);
		    	$newArray[]=array("id"=>$value["id"],"winner"=>$value["winner"],"loser"=>$value["loser"],"winner_hp"=>$value["winner_hp"],"winner_shield"=>$value["winner_shield"],"duration"=>$duration,"end_time"=>$end_time);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_race_top_rank":
		$newArray = null;
	    $query ="SELECT  id, username, coursename, MIN(duration_ms) AS duration_ms, topspeed, average, style, end_time FROM LocalRun GROUP BY username, style, coursename  ORDER BY duration_ms ASC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$duration = date("i:s", $value["duration_ms"] / 1000);
		    	$end_time = date('Y-m-d H:i:s', $value["end_time"]);
		    	$style = getStyle($value["style"]);
		    	$newArray[]=array("id"=>$value["id"],"username"=>$value["username"],"coursename"=>$value["coursename"],"duration_ms"=>$duration,"topspeed"=>$value["topspeed"],"average"=>$value["average"],"style"=>$style,"end_time"=>$end_time);
		    }
	    }

	    $json = json_encode($newArray);
	break;
	
}

echo $json;

function getStyle($val){
	//0=SIEGE 1=JKA 2=QW 3=CPM 4=Q3 5=PJK 6=WSW
	$style="UNKNOWN";

	if($val==0){
		$style="0-SIEGE";
	}
	if($val==1){
		$style="1-JKA";
	}
	if($val==2){
		$style="2-QW";
	}
	if($val==3){
		$style="3-CPM";
	}
	if($val==4){
		$style="4-Q3";
	}
	if($val==5){
		$style="5-PJK";
	}
	if($val==6){
		$style="6-WSW";
	}
	if($val==7){
		$style="7-RJQ3";
	}
	if($val==8){
		$style="8-RJCPM";
	}
	if($val==9){
		$style="9-SWOOP";
	}
	if($val==10){
		$style="10-JETPACK";
	}

	return $style;
}

?>