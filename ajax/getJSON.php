<?php
require_once('../inc/db_connection.inc.php');
//require_once('../inc/session.inc.php');

$option = $_POST["option"];
//$player = $_POST["player"];
//Sanitize player?
              //if (strlen($player) > 32)
                  //$player = substr($player, 0, 32);
			//Also htmlentities? or check special characters?

switch ($option) {
	case "ladder_duel_rank":
		$newArray = null;

	    //$query ="SELECT username, type, ROUND(rank,0) AS rank, 100-ROUND(100*TSSUM/count, 0) AS TS, count FROM DuelRanks ORDER BY rank DESC";
	    $query = "SELECT winner, type, elo FROM (SELECT winner, type, ROUND(winner_elo,0) AS elo, end_time FROM LocalDuel UNION SELECT loser, type, ROUND(loser_elo,0) AS elo, end_time FROM LocalDuel ORDER BY end_time ASC) 
			GROUP BY winner, type ORDER BY elo DESC";

	    $arr = sql2arr($query);
	    $count = 1;

	    if($arr){
		    foreach ($arr as $key => $value) {

		    	$type = DuelToString($value["type"]);
		    	$newArray[]=array("position"=>$count,"count"=>1,"username"=>$value["winner"],"type"=>$type,"elo"=>$value["elo"],"TS"=>1); 
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
	    		ORDER BY end_time DESC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$duration = date("i:s", $value["duration"] / 1000);
		    	$end_time = date('y-m-d H:i', $value["end_time"]);
		    	$type = DuelToString($value["type"]);
		    	$newArray[]=array("winner"=>$value["winner"],"loser"=>$value["loser"],"type"=>$type,"winner_hp"=>$value["winner_hp"],"winner_shield"=>$value["winner_shield"],"duration"=>$duration,"end_time"=>$end_time);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_race_rank":
		$newArray = null;
		$query = "SELECT DISTINCT
				    username,
				    -1 AS style,
				    ROUND(SUM(score),0) AS score_sum,
				    ROUND((SUM(score) / SUM(COUNT)),2) AS avg_score,
				    CAST((SUM(percentilesum) / SUM(COUNT))*100 AS INT) AS avg_percentile,
				    ROUND((CAST(SUM(ranksum) AS FLOAT) / SUM(COUNT)),2) AS avg_rank,
				    SUM(golds) AS golds_sum,
				    SUM(silvers) AS silvers_sum,
				    SUM(bronzes) AS bronzes_sum,
				    SUM(count) AS count_sum
				FROM RaceRanks
				GROUP BY username
				UNION
				SELECT DISTINCT
				    username,
				    style,
				    ROUND(SUM(score),0) AS SumScore,
				    ROUND((score / COUNT),2) AS avg_score,
				    CAST((percentilesum / COUNT)*100 AS INT) AS avg_percentile,
				    ROUND((CAST(ranksum AS FLOAT) / COUNT),2) AS avg_rank,
				    golds,
				    silvers,
				    bronzes,
				    COUNT
				FROM RaceRanks
				GROUP BY style, username
				ORDER BY SumScore DESC";

	    $arr = sql2arr($query);
	    $count = 1;

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$style = StyleToString($value["style"]);
		    	$newArray[]=array("username"=>$value["username"],"position"=>$count,"style"=>$style,"score"=>$value["score_sum"],"avg_score"=>$value["avg_score"],"avg_percentile"=>$value["avg_percentile"],"avg_rank"=>$value["avg_rank"],"golds"=>$value["golds_sum"],"silvers"=>$value["silvers_sum"],"bronzes"=>$value["bronzes_sum"],"count"=>$value["count_sum"]); 
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

	case "ladder_race_dropdowns": //Get a json that can populate all our dropdown filters by getting the minimum amount necessary in one query
		$newArray = null;
	    $query = "SELECT DISTINCT 1 AS type, username AS value FROM LocalRun
	    	UNION
			SELECT Distinct 2 AS type, coursename AS value FROM LocalRun
			UNION
			SELECT Distinct 3 AS type, style AS value FROM LocalRun";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["type"],1=>$value["value"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "ladder_race_list":
		$filterPlayer = $_POST["username"];
		$filterMap = $_POST["coursename"];
		$filterStyle = $_POST["style"];
	
		$newArray = null;

/* --More trouble than its worth
		$query = "SELECT " . $filterPlayer ? "username" : "" .  $filterMap ? "coursename" : "" . "MIN(duration_ms) AS duration_ms, topspeed, average " . $filterStyle ? ", style" : "" . ", rank, end_time FROM LocalRun GROUP BY " 
			. $filterPlayer ? " username" : "" $filterStyle ? ", style" : "" $filterMap ? ", coursename" : "" . "ORDER BY duration_ms ASC";
*/

		if ($filterPlayer == -1) { // Yikes
			if ($filterStyle == -1) {
				if ($filterMap == -1) {
					$stmt = $db->prepare("SELECT username, coursename, MIN(duration_ms) AS duration_ms, topspeed, average, style, rank, end_time FROM LocalRun GROUP BY username, style, coursename ORDER BY duration_ms ASC LIMIT 1000");
				}
				else {
					$stmt = $db->prepare("SELECT username, MIN(duration_ms) AS duration_ms, topspeed, average, style, rank, end_time FROM LocalRun GROUP BY username, style WHERE coursename = :coursename ORDER BY duration_ms ASC");
					$stmt->bindValue(":coursename", $filterMap, SQLITE3_TEXT);
				}
			}
			else {
				if ($filterMap == -1) {
		   			$stmt = $db->prepare("SELECT username, coursename, MIN(duration_ms) AS duration_ms, topspeed, average, rank, end_time FROM LocalRun WHERE style = :style GROUP BY username, coursename ORDER BY duration_ms ASC");
		   			$stmt->bindValue(":style", $filterStyle, SQLITE3_INTEGER);
				}
		   		else {
		   			$stmt = $db->prepare("SELECT username, MIN(duration_ms) AS duration_ms, topspeed, average, rank, end_time FROM LocalRun GROUP BY username WHERE style = :style AND coursename = :coursename ORDER BY duration_ms ASC");
		   			$stmt->bindValue(":style", $filterStyle, SQLITE3_INTEGER);
		   			$stmt->bindValue(":coursename", $filterMap, SQLITE3_TEXT);
		   		}
			}	
		}
		else {
			if ($filterStyle == -1) {
				if ($filterMap == -1) {
					$stmt = $db->prepare("SELECT coursename, MIN(duration_ms) AS duration_ms, topspeed, average, style, rank, end_time FROM LocalRun WHERE username = :username GROUP BY username, style, coursename ORDER BY duration_ms ASC");
		   			$stmt->bindValue(":username", $filterPlayer, SQLITE3_TEXT);
				}
				else {
					$stmt = $db->prepare("SELECT MIN(duration_ms) AS duration_ms, topspeed, average, style, rank, end_time FROM LocalRun GROUP BY username, style WHERE coursename = :coursename AND username = :username ORDER BY duration_ms ASC");
					$stmt->bindValue(":coursename", $filterMap, SQLITE3_TEXT);
					$stmt->bindValue(":username", $filterPlayer, SQLITE3_TEXT);
				}
			}
			else {
				if ($filterMap == -1) {
		   			$stmt = $db->prepare("SELECT coursename, MIN(duration_ms) AS duration_ms, topspeed, average, rank, end_time FROM LocalRun GROUP BY username, coursename WHERE style = :style AND username = :username ORDER BY duration_ms ASC");
		   			$stmt->bindValue(":style", $filterStyle, SQLITE3_INTEGER);
					$stmt->bindValue(":username", $filterPlayer, SQLITE3_TEXT);
				}
		   		else {
		   			$stmt = $db->prepare("SELECT MIN(duration_ms) AS duration_ms, topspeed, average, rank, end_time FROM LocalRun WHERE style = :style AND coursename = :coursename AND username = :username ORDER BY duration_ms ASC");
		   			$stmt->bindValue(":style", $filterStyle, SQLITE3_INTEGER);
					$stmt->bindValue(":username", $filterPlayer, SQLITE3_TEXT);
					$stmt->bindValue(":coursename", $filterMap, SQLITE3_TEXT);
		   		}
			}	
		}

		$result = $stmt->execute();
		$exists = sql2arr2($result);
		$result->finalize();

		if($exists) {
		    foreach ($exists as $key => $value) {
		    	$duration = TimeToString($value["duration_ms"]);
		    	$style = StyleToString($value["style"]);
		    	$demoStyle = StyleToDemoString($value["style"]);
		    	$coursenameCleaned = str_replace(" ","",$value["coursename"]); //Remove the spaces
		    	$username = $value["username"];
		    	$date = date('y-m-d H:i', $value["end_time"]);
		    	$end_time = "<a href='../races/{$username}/{$username}-{$coursenameCleaned}-{$demoStyle}.dm_26'>{$date}</a>";
		    	$rank = $value["rank"];
		    	if ($rank == 1)
		    		$rank =  "<b><font color='gold'>1</font></b>";
		    	else if ($rank == 2)
		    		$rank =  "<b><font color='silver'>2</font></b>";
		    	else if ($rank == 3)
		    		$rank =  "<b><font color='bronze'>3</font></b>";

		    	$newArray[]=array("position"=>$rank,"username"=>$value["username"],"coursename"=>$value["coursename"],"duration_ms"=>$duration,"topspeed"=>$value["topspeed"],"average"=>$value["average"],"style"=>$style,"end_time"=>$end_time);
		    }
		}
		
		$json = json_encode($newArray);
	break;

	case "player_duel_chart":
		$newArray = null;
	    $query ="SELECT type, count FROM DuelRanks WHERE username = 'source' ORDER BY count DESC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$type = DuelToString($value["type"]);
		    	$newArray[]=array(0=>$type,1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_duel_graph":
		$newArray = null;
	    //$query ="SELECT end_time, CAST(winner_elo AS INT) AS winner_elo FROM LocalDuel WHERE winner = 'source' ORDER BY end_time ASC"; // This needs to also search for them as loser

		//Should select type, and let client filter that.. should apply smoothing? 
	    $query = "SELECT end_time, CAST(winner_elo AS INT) AS elo FROM LocalDuel WHERE winner = 'source' AND type = 0 
			UNION
			select end_time, CAST(loser_elo AS INT) AS elo FROM LocalDuel WHERE loser = 'source' AND type = 0
			ORDER BY end_time ASC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["end_time"],1=>$value["elo"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_race_chart":
		$newArray = null;
	    $query ="SELECT style, count FROM RaceRanks WHERE username = 'source' ORDER BY count DESC";

	    $arr = sql2arr($query);

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$type = StyleToString($value["style"]);
		    	$newArray[]=array(0=>$type,1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

}

echo $json;
$db->close();

function StyleToString($val){
	$style="UNKNOWN";
	if($val==-1)
		$style="-1-All Styles";
	if($val==0)
		$style="0-SIEGE";
	else if($val==1)
		$style="1-JKA";
	else if($val==2)
		$style="2-QW";
	else if($val==3)
		$style="3-CPM";
	else if($val==4)
		$style="4-Q3";
	else if($val==5)
		$style="5-PJK";
	else if($val==6)
		$style="6-WSW";
	else if($val==7)
		$style="7-RJQ3";
	else if($val==8)
		$style="8-RJCPM";
	else if($val==9)
		$style="9-SWOOP";
	else if($val==10)
		$style="10-JETPACK";
	else if($val==11)
		$style="11-SPEED";
	else if($val==12)
		$style="12-SP";
	return $style;
}

function StyleToDemoString($val){
	$style="UNKNOWN";
	if($val==0)
		$style="siege";
	else if($val==1)
		$style="jka";
	else if($val==2)
		$style="qw";
	else if($val==3)
		$style="cpm";
	else if($val==4)
		$style="q3";
	else if($val==5)
		$style="pjk";
	else if($val==6)
		$style="wsw";
	else if($val==7)
		$style="rjq3";
	else if($val==8)
		$style="rjcpm";
	else if($val==9)
		$style="swoop";
	else if($val==10)
		$style="jetpack";
	else if($val==11)
		$style="speed";
	else if($val==12)
		$style="sp";
	return $style;
}

function DuelToString($type) {
  $typeStr = "Unknown";
  if ($type == 0)
    $typeStr = "Saber";
  else if ($type == 1)
    $typeStr =  "Force";
  else if ($type == 4)
    $typeStr =  "Melee";
  else if ($type == 6)
    $typeStr =  "Pistol";
  else if ($type == 7)
    $typeStr =  "Blaster";
  else if ($type == 8)
    $typeStr =  "Sniper";
  else if ($type == 9)
    $typeStr =  "Bowcaster";
  else if ($type == 10)
    $typeStr =  "Repeater";
  else if ($type == 11)
    $typeStr =  "Demp2";
  else if ($type == 12)
    $typeStr =  "Flechette";
  else if ($type == 13)
    $typeStr =  "Rocket";
  else if ($type == 14)
    $typeStr =  "Thermal";
  else if ($type == 15)
    $typeStr =  "Trip mine";
  else if ($type == 16)
    $typeStr =  "Det pack";
  else if ($type == 17)
    $typeStr =  "Concussion";
  else if ($type == 18)
    $typeStr =  "Bryar pistol";
  else if ($type == 19)
    $typeStr =  "Stun baton";
  else if ($type == 20)
    $typeStr =  "All weapons";
  return $typeStr;
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