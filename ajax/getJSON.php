<?php
require_once('../inc/db_connection.inc.php');
//require_once('../inc/session.inc.php');

//Query caching: have_query_cache=yes, query_cache_type=2, query_cache_size=1mb+

$json = null;
$option = null;
if (isset($_POST['option'])) {
	$option = $_POST["option"];
}

switch ($option) {
	case "duel_rank":
		$newArray = null;
		$query = "SELECT SQL_CACHE D1.username, type, elo, ROUND(100*(win_ts + loss_ts)/(win_count+loss_count), 0) AS TS, win_count+loss_count AS count FROM 
			((SELECT username, type, elo FROM ((SELECT winner AS username, type, ROUND(winner_elo,0) AS elo, end_time FROM Duels 
			UNION ALL SELECT loser AS username, type, ROUND(loser_elo,0) AS elo, end_time FROM Duels ORDER BY end_time DESC)) AS T GROUP BY username, type ORDER BY elo DESC) AS D1 
			INNER JOIN (SELECT winner AS username2, type AS type2, COUNT(*) AS win_count, SUM(odds) AS win_ts FROM Duels GROUP BY username2, type2) AS D2
			ON D1.username = D2.username2 AND D1.type = D2.type2)
			INNER JOIN (SELECT loser AS username3, type AS type3, COUNT(*) AS loss_count, SUM(1-odds) AS loss_ts FROM Duels GROUP BY username3, type3) AS D3
			ON D1.username = D3.username3 AND D1.type = D3.type3 ORDER BY elo DESC"; //Does not return rows of people-types with 0 wins or with 0 losses

	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["username"],1=>$value["type"],2=>$value["elo"],3=>$value["TS"],4=>$value["count"]); 
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "duel_count": //Loda fixme, we could just do one query maybe and have duel_rank also return the counts and use that?
		$newArray = null;
	    $query ="SELECT SQL_CACHE type, COUNT(*) AS count FROM Duels GROUP BY type ORDER BY count DESC";

	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["type"],1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "duel_list":
		$newArray = null;
	    $query ="SELECT winner, loser, type, CONCAT(winner_hp, '/', winner_shield) AS winner_health, ROUND(odds*100,0) AS odds, end_time, duration
	    		FROM Duels 
	    		ORDER BY end_time DESC";
	
	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["winner"],1=>$value["loser"],2=>$value["type"],3=>$value["winner_health"],4=>$value["odds"],5=>$value["end_time"],6=>$value["duration"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;


	//Have top dropdown for seasons that replaces last year/month/week?
	//query is just where season = ? instead of end time <>? filters.

	case "race_rank":
		if (isset($_POST['season']))
			$season = $_POST["season"];
		else
			$season = 0;

		if ($season < 0 || $season >= 512)
			$season = 0;

		$newArray = null;

		if ($season) { //Preset filter so we can use sql cache
			$query = "SELECT SQL_CACHE username, style, CAST(((score+newscore)/2) AS INT) AS score, ROUND(CAST(score AS DECIMAL(10, 2))/count, 2) AS avg_score, ROUND(percentile/count, 2) AS avg_percentile, ROUND(CAST(rank AS DECIMAL(10, 2))/count, 2) AS avg_rank, COALESCE(golds, 0) AS golds, COALESCE(silvers, 0) AS silvers, COALESCE(bronzes, 0) AS bronzes, count FROM (
				SELECT username, 99 AS style, SUM(season_rank) AS rank, COUNT(*) as count, SUM(season_entries-season_rank) AS newscore, SUM(CAST(season_entries AS DECIMAL(10, 2))/season_rank) AS score, SUM((season_entries - CAST(season_rank-1 AS DECIMAL(10, 2)))/season_entries) AS percentile, SUM(CASE WHEN season_rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN season_rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN season_rank = 3 THEN 1 ELSE 0 END) AS bronzes FROM Races WHERE season = {$season} GROUP BY username
				UNION ALL
				SELECT username, style, SUM(season_rank) AS rank, COUNT(*) as count, SUM(season_entries-season_rank) AS newscore, SUM(CAST(season_entries AS DECIMAL(10, 2))/season_rank) AS score, SUM((season_entries - CAST(season_rank-1 AS DECIMAL(10, 2)))/season_entries) AS percentile, SUM(CASE WHEN season_rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN season_rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN season_rank = 3 THEN 1 ELSE 0 END) AS bronzes FROM Races WHERE season = {$season} GROUP BY username, style) AS T
				ORDER BY score DESC";

			$arr = sql2arr($query);
		}
		else {
			$query = "SELECT SQL_CACHE username, style, CAST(((score+newscore)/2) AS INT) AS score, ROUND(CAST(score AS DECIMAL(10, 2))/count, 2) AS avg_score, ROUND(percentile/count, 2) AS avg_percentile, ROUND(CAST(rank AS DECIMAL(10, 2))/count, 2) AS avg_rank, COALESCE(golds, 0) AS golds, COALESCE(silvers, 0) AS silvers, COALESCE(bronzes, 0) AS bronzes, count FROM (
				SELECT username, 99 AS style, SUM(rank) AS rank, COUNT(*) as count, SUM(entries-rank) AS newscore, SUM(CAST(entries AS DECIMAL(10, 2))/rank) AS score, SUM((entries - CAST(rank-1 AS DECIMAL(10, 2)))/entries) AS percentile, SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS bronzes FROM Races WHERE rank != 0 GROUP BY username
				UNION ALL
				SELECT username, style, SUM(rank) AS rank, COUNT(*) as count, SUM(entries-rank) AS newscore, SUM(CAST(entries AS DECIMAL(10, 2))/rank) AS score, SUM((entries - CAST(rank-1 AS DECIMAL(10, 2)))/entries) AS percentile, SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS bronzes FROM Races WHERE rank != 0 GROUP BY username, style) AS T
				ORDER BY score DESC";

			$arr = sql2arr($query);
		}

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["username"],1=>$value["style"],2=>$value["score"],3=>$value["avg_score"],4=>$value["avg_percentile"],5=>$value["avg_rank"],6=>$value["golds"],7=>$value["silvers"],
		    		8=>$value["bronzes"],9=>$value["count"]); 
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "race_count":
		$newArray = null;
	    $query ="SELECT SQL_CACHE style, COUNT(*) AS count FROM Races GROUP BY style ORDER BY count DESC";

	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["style"],1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;
	
	case "race_list":	
		if (isset($_POST['season']))
			$season = $_POST["season"];
		else
			$season = 0;

		if ($season < 0 || $season >= 512)
			$season = 0;

		$newArray = null;

		if ($season == 0) //We dont want to select somones slower season entries, just the one fastest season entry.  Slower season entries have rank=0?
			$query = "SELECT rank, username, coursename, style, topspeed, average, end_time, duration_ms FROM Races WHERE rank != 0 ORDER BY end_time DESC";
		else
			$query = "SELECT season_rank AS rank, username, coursename, style, topspeed, average, end_time, duration_ms FROM Races WHERE season = {$season} ORDER BY end_time DESC";
			

		//Season update:
		//Select season as well, have a dropdown for it.
		//If dropdown is set to ALL
		//Dont show all seasons per user/course/style, just the fastest.  (how to do this)

			//Possible solution:  Season dropdown be serverside and require a new query.  Put it at top of race list table.

		$arr = sql2arr($query);
		if($arr) {
		    foreach ($arr as $key => $value) {
				$newArray[]=array(0=>$value["rank"],1=>$value["username"],2=>$value["coursename"],3=>$value["style"],4=>$value["topspeed"],5=>$value["average"],6=>$value["end_time"],7=>$value["duration_ms"]);
		    }
		}	

		$json = json_encode($newArray);
	break;

	case "dashboard": //Get total counts and last update info
		$newArray = null;
		$query = "SELECT 'account_count' as type, COUNT(*) AS count FROM Accounts
			UNION ALL
			SELECT 'duel_count' AS type, COUNT(*) AS count FROM Duels
			UNION ALL
			SELECT 'race_count' AS type, COUNT(*) AS count FROM Races
			UNION ALL
			SELECT type, last_update AS count FROM Updates
			UNION ALL
			SELECT 'seasons' AS type, COUNT(DISTINCT season) AS count from Races";

		$arr = sql2arr($query);
		if($arr) {
		    foreach ($arr as $key => $value) {
				$newArray[]=array(0=>$value["type"],1=>$value["count"]);
		    }
		}	

		$json = json_encode($newArray);
	break;

	case "player_accounts":
		$newArray = null;
		$query = "SELECT username, lastlogin, created FROM Accounts ORDER BY username ASC";

		$arr = sql2arr($query);
		if($arr) {
		    foreach ($arr as $key => $value) {
				$newArray[]=array(0=>$value["username"],1=>$value["lastlogin"],2=>$value["created"]);
		    }
		}	

		$json = json_encode($newArray);
	break;

	case "player_map_charts": //Get Most popular courses,  most exclusive course-styles.  The ordering isn't reliable like it is in sqlite?
		$newArray = null;
		$query = "SELECT SQL_CACHE coursename, -1 AS style, count FROM (SELECT coursename, COUNT(*) as count 
				FROM Races GROUP BY coursename ORDER BY count DESC, coursename DESC LIMIT 5) AS T
			UNION ALL
			SELECT coursename, style, count FROM (SELECT coursename, style, COUNT(*) as count 
				FROM Races GROUP BY coursename, style ORDER BY count, coursename, end_time ASC LIMIT 5) AS T
			UNION ALL
			SELECT -1 AS coursename, style, CAST(AVG(duration_ms) AS INT) FROM Races GROUP BY style
			ORDER BY count ASC";

		$arr = sql2arr($query);
		if($arr) {
		    foreach ($arr as $key => $value) {
				$newArray[]=array(0=>$value["coursename"],1=>$value["style"],2=>$value["count"]);
		    }
		}	

		$json = json_encode($newArray);
	break;

	case "player_duel_charts": //IDK what this should be
		$newArray = null;
		$query = "SELECT SQL_CACHE type, CAST(AVG(duration)/1000 AS INT) as duration From Duels WHERE duration != 0 GROUP BY type ORDER BY duration ASC";

		$arr = sql2arr($query);
		if($arr) {
		    foreach ($arr as $key => $value) {
				$newArray[]=array(0=>$value["type"],1=>$value["duration"]);
		    }
		}
		
		$json = json_encode($newArray);
	break;

	case "player_duel_stats":
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"];
		$newArray = null;
		$stmt = $db->prepare("SELECT SQL_CACHE type, elo FROM (SELECT type, ROUND(winner_elo,0) AS elo, end_time FROM Duels WHERE winner = ? GROUP BY type
				UNION ALL
				SELECT type, ROUND(loser_elo,0) AS elo, end_time FROM Duels WHERE loser = ? GROUP BY type) AS T GROUP BY type ORDER BY elo DESC LIMIT 5");
		$stmt->bind_param('ss', $username, $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();

	    if($arr){
			$min = min(array_column($arr, 'elo'));
		    foreach ($arr as $key => $value) {
		    	$type = $value["type"];
		    	$strength = $value["elo"] - $min + 100; //Subtract smallest element..
		    	$newArray[]=array(0=>$type,1=>$strength);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_race_stats": //Get relative strength of each race style for this player
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"]; //accept either GET or POST 
		$newArray = null;
	   	$stmt = $db->prepare("SELECT SQL_CACHE x.style AS style, ROUND(x.score/y.avg_score, 0) AS diff FROM (SELECT style, SUM(entries/rank) AS score from Races WHERE username = ? group by style) as x, 
	    	(SELECT style, AVG(entries/rank) AS avg_score FROM Races GROUP BY style) as y WHERE x.style = y.style ORDER BY diff DESC LIMIT 5");
		$stmt->bind_param('s', $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["style"],1=>$value["diff"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_duel_graph": //Should select type, and let client filter that.. should apply smoothing? 
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"];
		$newArray = null;
		$stmt = $db->prepare("SELECT end_time, type, CAST(winner_elo AS INT) AS elo FROM Duels WHERE winner = ? 
			UNION ALL
			SELECT end_time, type, CAST(loser_elo AS INT) AS elo FROM Duels WHERE loser = ? 
			ORDER BY end_time ASC");
		$stmt->bind_param('ss', $username, $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();
	
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["end_time"],1=>$value["type"],2=>$value["elo"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_race_awards": //Should select type, and let client filter that.. should apply smoothing? 
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"];
		$newArray = null;
		$stmt = $db->prepare("SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (jump1)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (jump2)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (jump3)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (bhop)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (rocketjump)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (handbreaker)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (a-mountain)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (jump1)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racepack5 (b-mountain)') THEN 1 ELSE 0 END AS 'AWARD' 
			UNION ALL 
			SELECT CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racepack6 (c-mountain)') THEN 1 ELSE 0 END AS 'AWARD'");
		$stmt->bind_param('ssssssssss', $username, $username, $username, $username, $username, $username, $username, $username, $username, $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();
	
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["AWARD"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

}

ob_start('ob_gzhandler'); //Compress json
echo $json;
$db->close();

function preparedsql2arr($result){ //For prepared statements that needed to be bound
	if ($result) {
		while ($row = $result->fetch_assoc()) { //error here?
			$arrayResult[]=$row;
		}
		if ($arrayResult) {
      		return $arrayResult;
    	} else {
      		return false;
    	}
  	}
}

function sql2arr($query){
	global $db;
	$arrayResult = null;
  
	//$starttime = microtime(true);
	$result = $db->query($query); //Show error?
	//$endtime = microtime(true);
	//echo "query took " . ($endtime - $starttime) * 1000;

	if ($result) {
		while ($row = $result->fetch_assoc()) {
			$arrayResult[]=$row;
		}
		$result->free();
		if ($arrayResult) {
			return $arrayResult;
		} else {
			return false;
		}
	}
}

?>
