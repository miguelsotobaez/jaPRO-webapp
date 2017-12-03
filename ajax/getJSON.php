<?php
require_once('../inc/db_connection.inc.php');
date_default_timezone_set('EST');
//require_once('../inc/session.inc.php');

$option = $_POST["option"];
//$player = $_POST["player"];
//Sanitize player?
              //if (strlen($player) > 32)
                  //$player = substr($player, 0, 32);
			//Also htmlentities? or check special characters?

switch ($option) {
	case "duel_rank":
		$newArray = null;

	    //$query ="SELECT username, type, ROUND(rank,0) AS rank, 100-ROUND(100*TSSUM/count, 0) AS TS, count FROM DuelRanks ORDER BY rank DESC";
	    //$query = "SELECT winner, type, elo FROM (SELECT winner, type, ROUND(winner_elo,0) AS elo, end_time FROM LocalDuel UNION SELECT loser, type, ROUND(loser_elo,0) AS elo, end_time FROM LocalDuel ORDER BY end_time ASC) 
		//	GROUP BY winner, type ORDER BY elo DESC";
		$query = "SELECT D1.username, type, elo, 100-ROUND(100*(win_ts + loss_ts)/(win_count+loss_count), 0) AS TS, win_count+loss_count AS count FROM 
			((SELECT username, type, elo FROM ((SELECT winner AS username, type, ROUND(winner_elo,0) AS elo, end_time FROM LocalDuel 
			UNION ALL SELECT loser AS username, type, ROUND(loser_elo,0) AS elo, end_time FROM LocalDuel ORDER BY end_time ASC)) GROUP BY username, type ORDER BY elo DESC) AS D1 
			INNER JOIN (SELECT winner AS username2, type AS type2, COUNT(*) AS win_count, SUM(odds) AS win_ts FROM LocalDuel GROUP BY username2, type2) AS D2
			ON D1.username = D2.username2 AND D1.type = D2.type2)
			INNER JOIN (SELECT loser AS username3, type AS type3, COUNT(*) AS loss_count, SUM(1-odds) AS loss_ts FROM LocalDuel GROUP BY username3, type3) AS D3
			ON D1.username = D3.username3 AND D1.type = D3.type3 ORDER BY elo desc";

	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array("count"=>$value["count"],"username"=>$value["username"],"type"=>$value["type"],"elo"=>$value["elo"],"TS"=>$value["TS"]); 
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "duel_count": //Loda fixme, we could just do one query maybe and have duel_rank also return the counts and use that?
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

	case "duel_list":
		$newArray = null;
	    $query ="SELECT winner, loser, type, winner_hp, winner_shield, duration, end_time, ROUND(odds*100,0) AS odds
	    		FROM LocalDuel 
	    		ORDER BY end_time DESC";

	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array("winner"=>$value["winner"],"loser"=>$value["loser"],"type"=>$value["type"],"winner_health"=>($value["winner_hp"] . " / " . $value["winner_shield"]),"duration"=>$value["duration"],"end_time"=>date('y-m-d H:i', $value["end_time"]),"odds"=>$value["odds"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "race_rank":
		$newArray = null;
		$query = "SELECT DISTINCT
				    username,
				    99 AS style,
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
				UNION ALL
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
				//From RaceRanks WHERE score > 10 - to cut out the useless crap, if it really is affecting pageload, but then we cant trust distinct username/style(?) to be complete for other dropdowns

	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array("username"=>$value["username"],"style"=>$value["style"],"score"=>$value["score_sum"],"avg_score"=>$value["avg_score"],"avg_percentile"=>$value["avg_percentile"],"avg_rank"=>$value["avg_rank"],"golds"=>$value["golds_sum"],"silvers"=>$value["silvers_sum"],"bronzes"=>$value["bronzes_sum"],"count"=>$value["count_sum"]); 
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "race_count":
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
	
	case "map_dropdown": //Get a json that can populate all our dropdown filters by getting the minimum amount necessary in one query
		$newArray = null;
	    $query = "SELECT DISTINCT coursename FROM LocalRun";

	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["coursename"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "race_list":	
		$newArray = null;
		$query = "SELECT username, coursename, MIN(duration_ms) AS duration_ms, topspeed, average, style, rank, end_time FROM LocalRun GROUP BY username, style, coursename ORDER BY end_time DESC";

		$arr = sql2arr($query);
		if($arr) {
		    foreach ($arr as $key => $value) {
			    $demoStyle = StyleToDemoString($value["style"]);
				$coursenameCleaned = urlencode(str_replace(" ","",$value["coursename"])); //Remove the spaces
				$username = urlencode($value["username"]);
		    	$end_time = date('y-m-d H:i', $value["end_time"]);
				$date = "<a href='../races/{$username}/{$username}-{$coursenameCleaned}-{$demoStyle}.dm_26'>{$end_time}</a>";

				$newArray[]=array("rank"=>$value["rank"],"username"=>$value["username"],"coursename"=>$value["coursename"],"duration"=>$value["duration_ms"],"topspeed"=>$value["topspeed"],"average"=>$value["average"],"style"=>$value["style"],"date"=>$date);
		    }
		}
		
		$json = json_encode($newArray);
	break;

	case "player_duel_chart":
		$username = $_POST["player"];
		$newArray = null;

		$stmt = $db->prepare("SELECT type, elo from (SELECT type, ROUND(winner_elo,0) AS elo, end_time FROM LocalDuel WHERE winner = :username GROUP BY type
				UNION
				SELECT type, ROUND(loser_elo,0) AS elo, end_time FROM LocalDuel WHERE loser = :username GROUP BY type) GROUP BY type ORDER BY elo DESC LIMIT 5");
		$stmt->bindValue(":username", $username, SQLITE3_TEXT);
		$result = $stmt->execute();
		$exists = sql2arr2($result);
		$result->finalize();

	    if($exists){
			$min = min(array_column($exists, 'elo'));
		    foreach ($exists as $key => $value) {
		    	$type = $value["type"];
		    	$strength = $value["elo"] - $min + 100; //Subtract smallest element..
		    	$newArray[]=array(0=>$type,1=>$strength);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_duel_graph":
		$username = $_POST["player"];
		$newArray = null;

		//Should select type, and let client filter that.. should apply smoothing? 
		$stmt = $db->prepare("SELECT end_time, type, CAST(winner_elo AS INT) AS elo FROM LocalDuel WHERE winner = :username 
			UNION
			select end_time, type, CAST(loser_elo AS INT) AS elo FROM LocalDuel WHERE loser = :username 
			ORDER BY end_time ASC");
		$stmt->bindValue(":username", $username, SQLITE3_TEXT);
		$result = $stmt->execute();
		$exists = sql2arr2($result);
		$result->finalize();

	    if($exists){
		    foreach ($exists as $key => $value) {
		    	$newArray[]=array(0=>$value["end_time"],1=>$value["elo"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_race_chart": //Get relative strength of each race style for this player
		$username = $_POST["player"];
		$newArray = null;

	   	$stmt = $db->prepare("SELECT x.style AS style, ROUND(x.score/y.avg_score, 0) AS diff FROM (SELECT style, score from RaceRanks WHERE username=:username) as x, 
	    	(SELECT style, AVG(score) AS avg_score FROM RaceRanks GROUP BY style) as y WHERE x.style = y.style ORDER BY diff DESC LIMIT 5");
		$stmt->bindValue(":username", $username, SQLITE3_TEXT);
		$result = $stmt->execute();
		$exists = sql2arr2($result);
		$result->finalize();

	    if($exists){
		    foreach ($exists as $key => $value) {
		    	$type = $value["style"];
		    	$newArray[]=array(0=>$type,1=>$value["diff"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

}

echo $json;
$db->close();

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

?>
