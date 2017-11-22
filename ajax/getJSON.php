<?php
require_once('../inc/db_connection.inc.php');
//require_once('../inc/session.inc.php');

$option = $_POST["option"];

switch ($option) {
	case "ladder_duel_rank":
		$newArray = null;

	    $query ="SELECT username, type, ROUND(rank,0) as rank, TSSUM, count FROM DuelRanks ORDER BY rank DESC";
	    $arr = sql2arr($query);
	    $count = 1;

	    if($arr){
		    foreach ($arr as $key => $value) {

		    	$newArray[]=array("position"=>$count,"count"=>$value["count"],"username"=>$value["username"],"type"=>$value["type"],"rank"=>$value["rank"],"TSSUM"=>$value["TSSUM"]); 
		    	$count++;
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_duel_count": //Loda fixme, we could just do one query maybe and have duel_rank also return the counts and use that?
		$newArray = null;
	    $query ="SELECT username, SUM(count) AS count FROM DuelRanks GROUP BY username ORDER BY count DESC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["username"],1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_duel_list":
		$newArray = null;
	    $query ="SELECT winner, loser, type, winner_hp, winner_shield, duration, end_time 
	    		FROM LocalDuel 
	    		ORDER BY end_time DESC
	    		LIMIT 500
	    ";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$duration = date("i:s", $value["duration"] / 1000);
		    	$end_time = date('y-M-d H:i', $value["end_time"]);
		    	$newArray[]=array("winner"=>$value["winner"],"loser"=>$value["loser"],"type"=>$value["type"],"winner_hp"=>$value["winner_hp"],"winner_shield"=>$value["winner_shield"],"duration"=>$duration,"end_time"=>$end_time);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_race_rank":
		$newArray = null;
	    $query ="SELECT 
		    		username, 
		    		style, 
		    		ROUND(score,0) as score, 
		    		ROUND((score / count),2) AS avg_score,
		    		CAST((percentilesum / count)*100 AS INT) AS avg_percentile,
		    		ROUND((CAST(ranksum AS float) / count),2) AS avg_rank, 
		    		golds, 
		    		silvers, 
		    		bronzes, 
		    		count 
		    	FROM RaceRanks 
		    	ORDER BY score DESC";

	    $arr = sql2arr($query);
	    $count = 1;

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array("username"=>$value["username"],"position"=>$count,"style"=>$value["style"],"score"=>$value["score"],"avg_score"=>$value["avg_score"],"avg_percentile"=>$value["avg_percentile"],"avg_rank"=>$value["avg_rank"],"golds"=>$value["golds"],"silvers"=>$value["silvers"],"bronzes"=>$value["bronzes"],"count"=>$value["count"]); 
		    	$count++;
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_race_count":
		$newArray = null;
	    $query ="SELECT username, SUM(count) AS count FROM RaceRanks GROUP BY username ORDER BY count DESC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["username"],1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_race_list":
		$newArray = null;

	    $query ="SELECT username, coursename, MIN(duration_ms) AS duration_ms, topspeed, average, style, rank, end_time FROM LocalRun GROUP BY username, style, coursename ORDER BY duration_ms ASC LIMIT 1000";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$duration = TimeToString($value["duration_ms"]);
		    	$end_time = date('y-M-d H:i', $value["end_time"]);
		    	$style = getStyle($value["style"]);
		    	$newArray[]=array("position"=>$value["rank"],"username"=>$value["username"],"coursename"=>$value["coursename"],"duration_ms"=>$duration,"topspeed"=>$value["topspeed"],"average"=>$value["average"],"style"=>$style,"end_time"=>$end_time);
		    }
	    }

	    $json = json_encode($newArray);
	break;

}

echo $json;

function getStyle($val){
	$style="UNKNOWN";

	if($val==0){
		$style="0-SIEGE";
	}
	else if($val==1){
		$style="1-JKA";
	}
	else if($val==2){
		$style="2-QW";
	}
	else if($val==3){
		$style="3-CPM";
	}
	else if($val==4){
		$style="4-Q3";
	}
	else if($val==5){
		$style="5-PJK";
	}
	else if($val==6){
		$style="6-WSW";
	}
	else if($val==7){
		$style="7-RJQ3";
	}
	else if($val==8){
		$style="8-RJCPM";
	}
	else if($val==9){
		$style="9-SWOOP";
	}
	else if($val==10){
		$style="10-JETPACK";
	}
	else if($val==11){
		$style="11-SPEED";
	}
	else if($val==12){
		$style="12-SP";
	}

	return $style;
}

function TimeToSTring($duration_ms) { //loda fixme... has to be a standard way to do this
  if ($duration_ms >= (60*60*1000)) {
    $hours = (int)(($duration_ms / (1000*60*60)) % 24);
    $minutes = (int)(($duration_ms / (1000*60)) % 60);
    $seconds = (int)($duration_ms / 1000) % 60;
    $milliseconds = $duration_ms % 1000; 

    $minutes = sprintf("%02d", $minutes);
    $seconds = sprintf("%02d", $seconds );
    $milliseconds = sprintf("%03d", $milliseconds );

    $timeStr = "$hours:$minutes:$seconds.$milliseconds";
  }
  else if ($duration_ms >= (60*1000)) {
    $minutes = (int)(($duration_ms / (1000*60)) % 60);
    $seconds = (int)($duration_ms / 1000) % 60;
    $milliseconds = $duration_ms % 1000; 

    $seconds = sprintf("%02d", $seconds );
    $milliseconds = sprintf("%03d", $milliseconds );

    $timeStr = "$minutes:$seconds.$milliseconds";
  }
  else 
    $timeStr = number_format($duration_ms * 0.001, 3);
  return $timeStr;
}

?>