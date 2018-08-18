<?php
require_once('../inc/db_connection.inc.php');
//require_once('../inc/session.inc.php');

//Query caching: have_query_cache=yes, query_cache_type=2, query_cache_size=1mb+

$json = null;
$option = null;
if (isset($_POST['option'])) {
	$option = $_POST["option"];
}

//Debug
if (isset($_GET['option'])) {
	$option = $_GET["option"];
}
//Debug

$awards = array(
array("jump1-jka", 				"racearena_pro (jump1)", 		"jka", 		0),
array("jump2-jka", 				"racearena_pro (jump2)", 		"jka",		0),
array("jump3-jka", 				"racearena_pro (jump3)", 		"jka", 		0),
array("bhop-jka", 				"racearena_pro (bhop)", 		"jka", 		0),
array("ysal-jka", 				"racearena_pro (ysal)", 		"jka", 		0),
array("rocketjump-rjq3", 		"racearena_pro (rocketjump)", 	"rjq3",		0),
array("handbreaker-jka", 		"racearena_pro (handbreaker)", 	"jka", 		0),
array("amountain-jka", 			"racearena_pro (a-mountain)", 	"jka", 		0),
array("climb-jka", 				"racearena_pro (climb)", 		"jka", 		0),
array("torture-q3", 			"racepack5 (torture)", 			"q3", 		0),
array("bmountain-jka", 			"racepack5 (b-mountain)", 		"jka", 		0),
array("cmountain-jka", 			"racepack6 (c-mountain)", 		"jka", 		0),
array("jump1-wsw", 				"racearena_pro (jump1)", 		"wsw", 		0),
array("jump2-wsw", 				"racearena_pro (jump2)", 		"wsw", 		0),
array("handbreaker-wsw", 		"racearena_pro (handbreaker)", 	"wsw", 		0),
array("amountain-siege", 		"racearena_pro (a-mountain)", 	"siege", 	0),
array("jumpgreenpro-jka", 		"jump_green_pro", 				"jka", 		0),
array("hevil-jka", 				"t3_hevil", 					"jka", 		0),
array("r724-swoop", 			"racepack6 (r7-24)", 			"swoop", 	0),
array("yavin-under14-jka", 		"racepack4 (yavin)", 			"jka", 		14000),
array("imperial-under5-speed", 	"racepack6 (imperial)", 		"speed",	5000),


array("idk", 	"f", 	"j", 0) //tiered shit

);

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
				SELECT username, 99 AS style, SUM(season_rank) AS rank, COUNT(*) as count, SUM(season_entries-season_rank) AS newscore, SUM(CAST(season_entries AS DECIMAL(10, 2))/season_rank) AS score, SUM((season_entries - CAST(season_rank-1 AS DECIMAL(10, 2)))/season_entries) AS percentile, SUM(CASE WHEN season_rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN season_rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN season_rank = 3 THEN 1 ELSE 0 END) AS bronzes FROM Races WHERE season = {$season} AND style != 14 GROUP BY username
				UNION ALL
				SELECT username, style, SUM(season_rank) AS rank, COUNT(*) as count, SUM(season_entries-season_rank) AS newscore, SUM(CAST(season_entries AS DECIMAL(10, 2))/season_rank) AS score, SUM((season_entries - CAST(season_rank-1 AS DECIMAL(10, 2)))/season_entries) AS percentile, SUM(CASE WHEN season_rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN season_rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN season_rank = 3 THEN 1 ELSE 0 END) AS bronzes FROM Races WHERE season = {$season} GROUP BY username, style) AS T
				ORDER BY score DESC";

			$arr = sql2arr($query);
		}
		else {
			$query = "SELECT SQL_CACHE username, style, CAST(((score+newscore)/2) AS INT) AS score, ROUND(CAST(score AS DECIMAL(10, 2))/count, 2) AS avg_score, ROUND(percentile/count, 2) AS avg_percentile, ROUND(CAST(rank AS DECIMAL(10, 2))/count, 2) AS avg_rank, COALESCE(golds, 0) AS golds, COALESCE(silvers, 0) AS silvers, COALESCE(bronzes, 0) AS bronzes, count FROM (
				SELECT username, 99 AS style, SUM(rank) AS rank, COUNT(*) as count, SUM(entries-rank) AS newscore, SUM(CAST(entries AS DECIMAL(10, 2))/rank) AS score, SUM((entries - CAST(rank-1 AS DECIMAL(10, 2)))/entries) AS percentile, SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS bronzes FROM Races WHERE rank != 0 AND style != 14 GROUP BY username
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
		$query = "SELECT username, created, lastlogin FROM Accounts ORDER BY username ASC";

		$arr = sql2arr($query);
		if($arr) {
		    foreach ($arr as $key => $value) {
				$newArray[]=array(0=>$value["username"],1=>$value["created"],2=>$value["lastlogin"]);
		    }
		}	

		$json = json_encode($newArray);
	break;

	case "player_map_charts": //Get Most popular courses,  most exclusive course-styles.  The ordering isn't reliable like it is in sqlite?
		$newArray = null; //rank == 1 to avoid noob times, and treat all courses equally
		$query = "SELECT SQL_CACHE coursename, -1 AS style, count FROM (SELECT coursename, COUNT(*) as count 
				FROM Races GROUP BY coursename ORDER BY count DESC, coursename DESC LIMIT 5) AS T
			UNION ALL
			SELECT coursename, style, count FROM (SELECT coursename, style, COUNT(*) as count 
				FROM Races GROUP BY coursename, style ORDER BY count, coursename, end_time ASC LIMIT 5) AS T
			UNION ALL
			SELECT -1 AS coursename, style, CAST(AVG(duration_ms) AS INT) FROM Races WHERE rank = 1 GROUP BY style
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
			//$min = min(array_column($arr, 'elo'));
		    foreach ($arr as $key => $value) {
		    	//$type = $value["type"];
		    	//$strength = $value["elo"] - $min + 100; //Subtract smallest element..
		    	$newArray[]=array(0=>$value["type"],1=>$value["elo"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;
/*
	case "player_race_statsOLD2": //Get relative strength of each race style for this player
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
*/

	case "player_race_stats":
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"]; //accept either GET or POST 
		//dont want to use binding because then it wont sql_cache - cool, it wont anyway. cuz of stupid limitations.

		$newArray = null;
		$stmt = $db->prepare("SELECT SQL_CACHE style, diff, score, score_pct, SPR, SPR_pct, avg_rank, avg_rank_pct, percentile, percentile_pct, golds, golds_pct, silvers, bronzes, count, count_pct 
			FROM
			(SELECT username, style, ROUND(oldscore/global_avg, 0) AS diff, ROUND((oldscore+newscore)/2,0) as score, ROUND(PERCENT_RANK() over (partition by style order by score),2) AS score_pct, ROUND(oldscore/count,2) AS SPR, ROUND(PERCENT_RANK() over (partition by style order by SPR),2) AS SPR_pct, avg_rank, ROUND(PERCENT_RANK() over (partition by style order by avg_rank DESC),2) AS avg_rank_pct, percentile, ROUND(PERCENT_RANK() over (partition by style order by percentile),2) AS percentile_pct, golds, ROUND(PERCENT_RANK() over (partition by style order by golds),2) AS golds_pct, silvers, bronzes, count, ROUND(PERCENT_RANK() over (partition by style order by count),2) AS count_pct
			FROM 
			(SELECT username, style, SUM(entries-rank) AS newscore, CAST(SUM(entries/CAST(rank AS DECIMAL(10, 2))) AS INT) AS oldscore, ROUND(AVG(rank),2) as avg_rank, ROUND(AVG((entries-CAST(rank-1 AS DECIMAL(10, 2)))/entries),2) AS percentile, SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS bronzes, COUNT(*) as count
			FROM Races WHERE rank != 0 GROUP BY username, style) AS T1, (SELECT style AS global_style, AVG(entries/rank) AS global_avg FROM Races GROUP BY style) as T2 WHERE style = global_style) AS T3 WHERE username = ? 
			UNION ALL 
			SELECT style, diff, score, score_pct, SPR, SPR_pct, avg_rank, avg_rank_pct, percentile, percentile_pct, golds, golds_pct, silvers, bronzes, count, count_pct 
			FROM
			(SELECT username, '-1' AS style, ROUND(oldscore/global_avg, 0) AS diff, ROUND((oldscore+newscore)/2,0) as score, ROUND(PERCENT_RANK() over (order by score),2) AS score_pct, ROUND(oldscore/count,2) AS SPR, ROUND(PERCENT_RANK() over (order by SPR),2) AS SPR_pct, avg_rank, ROUND(PERCENT_RANK() over (order by avg_rank DESC),2) AS avg_rank_pct, percentile, ROUND(PERCENT_RANK() over (order by percentile),2) AS percentile_pct, golds, ROUND(PERCENT_RANK() over (order by golds),2) AS golds_pct, silvers, bronzes, count, ROUND(PERCENT_RANK() over (order by count),2) AS count_pct
			FROM 
			(SELECT username, style, SUM(entries-rank) AS newscore, CAST(SUM(entries/CAST(rank AS DECIMAL(10, 2))) AS INT) AS oldscore, ROUND(AVG(rank),2) as avg_rank, ROUND(AVG((entries-CAST(rank-1 AS DECIMAL(10, 2)))/entries),2) AS percentile, SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS bronzes, COUNT(*) as count
			FROM Races WHERE rank != 0 GROUP BY username) AS T1, (SELECT AVG(entries/rank) AS global_avg FROM Races) as T2) AS T3 WHERE username = ? ORDER BY diff DESC");
		$stmt->bind_param('ss', $username, $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();
		if($arr) {
		    foreach ($arr as $key => $value) {
				$newArray[]=array(0=>$value["style"],1=>$value["diff"],2=>$value["score"],3=>$value["score_pct"],4=>$value["SPR"],5=>$value["SPR_pct"],6=>$value["avg_rank"],7=>$value["avg_rank_pct"],8=>$value["percentile"],
					9=>$value["percentile_pct"],10=>$value["golds"],11=>$value["golds_pct"],12=>$value["silvers"],13=>$value["bronzes"],14=>$value["count"],15=>$value["count_pct"]);
		    }
		}
		
		$json = json_encode($newArray);
	break;

/*
	case "player_race_stats_older": //Combine with other stats query
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"]; //accept either GET or POST 
		$newArray = null;
	   	$stmt = $db->prepare("SELECT SQL_CACHE style, newscore, oldscore, ROUND(oldscore/global_avg, 0) AS diff, ROUND(rank, 2) AS rank, ROUND(percentile, 2) AS percentile, golds, silvers, bronzes, count FROM 
			(SELECT style, SUM(entries-rank) AS newscore, CAST(SUM(entries/CAST(rank AS DECIMAL(10, 2))) AS INT) AS oldscore, AVG(rank) as rank, AVG((entries - CAST(rank-1 AS DECIMAL(10, 2)))/entries) AS percentile, SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS bronzes, COUNT(*) as count from Races WHERE username = ? AND rank != 0 GROUP BY style) as T1, 
			(SELECT style AS global_style, AVG(entries/rank) AS global_avg FROM Races GROUP BY style) as T2 WHERE style = global_style 
			UNION ALL 
			SELECT '-1' AS style, newscore, oldscore, ROUND(oldscore/global_avg, 0) AS diff, ROUND(rank, 2) AS rank, ROUND(percentile, 2) AS percentile, golds, silvers, bronzes, count FROM (SELECT SUM(entries-rank) AS newscore, CAST(SUM(entries/CAST(rank AS DECIMAL(10, 2))) AS INT) AS oldscore, AVG(rank) as rank, AVG((entries - CAST(rank-1 AS DECIMAL(10, 2)))/entries) AS percentile, SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS golds, SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS silvers, SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS bronzes, COUNT(*) as count from Races WHERE username = ? AND rank != 0) as T1, 
			(SELECT AVG(entries/rank) AS global_avg FROM Races) as T2 ORDER BY diff DESC");
		$stmt->bind_param('ss', $username, $username);

		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["style"],1=>$value["newscore"],2=>$value["oldscore"],3=>$value["diff"],4=>$value["rank"],5=>$value["percentile"],6=>$value["golds"],7=>$value["silvers"],8=>$value["bronzes"],9=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;
*/

	case "player_best_races": //Get relative strength of each race style for this player
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"]; //accept either GET or POST 
		$newArray = null;
	   	$stmt = $db->prepare("SELECT rank, coursename, style, ROUND(entries/rank, 0) AS strength, duration_ms, end_time FROM Races WHERE username = ? ORDER BY strength DESC LIMIT 50");
		$stmt->bind_param('s', $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();

	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["rank"],1=>$value["coursename"],2=>$value["style"],3=>$value["strength"],4=>$value["end_time"],5=>$value["duration_ms"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;
	
/*
	case "player_race_stats": //Should select type, and let client filter that.. should apply smoothing? 
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"];
		$newArray = null;
		$stmt = $db->prepare("SELECT SQL_CACHE style, COUNT(*) AS count FROM Races WHERE username = ? GROUP BY style ORDER BY count DESC");
		$stmt->bind_param('s', $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();
	
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["style"],1=>$value["count"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;
	*/

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



/*

		$query = "";
		foreach ($awards as $i => $row)
		{
			//special case for weird awards
			//If row[3] then add duration_ms check
		    $query += "SELECT ".$row[0]." AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = ".$row[2]." AND username = ? AND coursename = ".$row[1]." THEN 1 ELSE 0 END as 'val'";
		    $query += " UNION ALL ";
		}
		//Strip the last UNION ALL
		$stmt = $db->prepare($query);
		//bind generate bind param

*/



/*

		$last = count($awards) - 1;
		foreach ($awards as $i => $row)
		{
		    $isFirst = ($i == 0);
		    $isLast = ($i == $last);

	    	$style = RaceNameToInteger($row[2]);
	    	$query = "SELECT ".$row[0]." AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE coursename = '".$row[1]."'".(($style == -1) ? "": " AND style = ".$style."").(($row[3] == 0) ? "" : " AND duration_ms < ".$duration) . ") THEN 1 ELSE 0 END as 'val'";
			
			echo $query;
			//append to query
			//append s to bind
			//append $username to bind
		}

*/


		//Prepare this automatically from badges array..?

		$stmt = $db->prepare("SELECT SQL_CACHE 'jump1-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (jump1)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'jump2-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (jump2)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'jump3-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (jump3)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'bhop-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (bhop)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'ysal-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (ysal)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'rocketjump-rjq3' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (rocketjump)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'handbreaker-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (handbreaker)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'amountain-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (a-mountain)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'climb-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (climb)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'torture-q3' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 4 AND username = ? AND coursename = 'racepack5 (torture)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'bmountain-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racepack5 (b-mountain)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'cmountain-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racepack6 (c-mountain)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'jump1-wsw' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 6 AND username = ? AND coursename = 'racearena_pro (jump1)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'jump2-wsw' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 6 AND username = ? AND coursename = 'racearena_pro (jump2)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'handbreaker-wsw' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 6 AND username = ? AND coursename = 'racearena_pro (handbreaker)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'amountain-siege' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 6 AND username = ? AND coursename = 'racearena_pro (a-mountain)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'jumpgreenpro-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'jump_green_pro') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'hevil-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 't3_hevil') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'r724-swoop' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 9 AND username = ? AND coursename = 'racepack6 (r7-24)') THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'yavin-under14-jka' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 1 AND username = ? AND coursename = 'racepack4 (yavin)' AND duration_ms < 14000) THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'imperial-under5-speed' AS 'key', CASE WHEN EXISTS (SELECT id FROM Races WHERE style = 11 AND username = ? AND coursename = 'racepack6 (imperial)' AND duration_ms < 5000) THEN 1 ELSE 0 END AS 'val' 
			UNION ALL 
			SELECT 'dash' AS 'key', (SELECT MIN(duration_ms) FROM Races WHERE style = 1 AND username = ? AND coursename = 'racearena_pro (dash1)') AS 'val' 
			UNION ALL 
			SELECT 'topspeed' AS 'key', (SELECT MAX(topspeed) FROM Races WHERE username = ?) AS 'val'");
		$stmt->bind_param('sssssssssssssssssssssss', 
			$username, $username, $username, $username, $username, $username, $username, $username, $username, $username, $username, $username, $username, $username, $username, 
			$username, $username, $username, $username, $username, $username, $username, $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();
	
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["key"],1=>$value["val"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_duel_awards": //Should select type, and let client filter that.. should apply smoothing? 
		if (!isset($_POST['player'])) {
			break;
		}
		$username = $_POST["player"];
		$newArray = null;
		$stmt = $db->prepare("SELECT SQL_CACHE 'saber-wins' AS 'key', (SELECT COUNT(*) FROM Duels WHERE type = 0 AND winner = ?) AS 'val' 
			UNION ALL 
			SELECT 'force-wins' AS 'key', (SELECT COUNT(*) FROM Duels WHERE type = 1 AND winner = ?) AS 'val' 
			UNION ALL 
			SELECT 'gun-wins' AS 'key', (SELECT COUNT(*) FROM Duels WHERE type > 1 AND winner = ?) AS 'val' 
			UNION ALL 
			SELECT 'saber-flawless' AS 'key', (SELECT COUNT(*) FROM Duels WHERE type = 0 AND winner_hp = 100 AND winner_shield = 100 AND winner = ?) AS 'val' 
			UNION ALL 
			SELECT 'gun-flawless' AS 'key', (SELECT COUNT(*) FROM Duels WHERE type > 1 AND winner_hp = 100 AND winner_shield = 100 AND winner = ?) AS 'val'");
		$stmt->bind_param('sssss', $username, $username, $username, $username, $username);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();
	
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["key"],1=>$value["val"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "player_badges": //Get relative strength of each race style for this player
		if (!isset($_POST['badge'])) {
			break;
		}
		$badge = $_POST["badge"]; //accept either GET or POST 
		$newArray = null;

		$last = count($awards) - 1;
		foreach ($awards as $i => $row)
		{
		    $isFirst = ($i == 0);
		    $isLast = ($i == $last);

		    if ($row[0] == $badge) {
		    	$style = RaceNameToInteger($row[2]);
		    	//Use min(end_time to get first instance of the award completion, for multiple season support, ah but this doesnt work, cuz someone can get it first then later update it.
		    	$query = "SELECT username, style, MIN(duration_ms) AS duration FROM Races WHERE coursename = '".$row[1]."'".(($style == -1) ? "": " AND style = ".$style."").(($row[3] == 0) ? "" : " AND duration_ms < ".$duration) . " GROUP BY username ORDER BY duration ASC";
		    	//echo $query;
		    	$arr = sql2arr($query);
				if($arr) {
				    foreach ($arr as $key => $value) {
						$newArray[]=array(0=>$value["username"],1=>$value["style"],2=>$value["duration"]);
				    }
				}	
				$json = json_encode($newArray);
		    	break;
		    }
		}
	break;

	case "team_list": //This will be hard to get the race-score for each team?
		$newArray = null;
	    //$query = "SELECT name, flags FROM Teams ORDER BY name ASC";
	    $query = "SELECT T.name AS name, TA.count AS count, T.flags AS flags FROM 
				(SELECT name, flags From Teams) AS T
				INNER JOIN
				(SELECT team, COUNT(*) AS count From TeamAccounts WHERE (flags & 2 != 2) GROUP BY team) AS TA
				ON T.name = TA.team ORDER BY count DESC";
	    $arr = sql2arr($query);
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["name"],1=>$value["count"],2=>$value["flags"]);
		    }
	    }

	    $json = json_encode($newArray);
	break;

	case "team_member_list": //Also get race score and stats of each dude?
		if (!isset($_POST['team'])) {
			break;
		}
		$teamname = $_POST["team"];
		$newArray = null;
		$stmt = $db->prepare("SELECT username, ROUND(SUM((entries/rank + entries-rank))/2,0) AS score, COUNT(*) AS count FROM Races WHERE rank != 0 AND username IN (SELECT account FROM TeamAccounts WHERE team = ? AND (flags & 2 != 2)) GROUP BY username ORDER BY score DESC"); //Dont show pending invites (flags = 2)
		$stmt->bind_param('s', $teamname);
		$stmt->execute();
		$result = $stmt->get_result();
		$arr = preparedsql2arr($result);
		$result->free();
	
	    if($arr){
		    foreach ($arr as $key => $value) {
		    	$newArray[]=array(0=>$value["username"],1=>$value["score"],2=>$value["count"]);
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

function RaceNameToInteger($name) {
	if ($name == "siege")
		return 0;
	else if ($name == "jka")
		return 1;
	else if ($name == "qw")
		return 2;
	else if ($name == "cpm")
		return 3;
	else if ($name == "q3")
		return 4;
	else if ($name == "pjk")
		return 5;
	else if ($name == "wsw")
		return 6;
	else if ($name == "rjq3")
		return 7;
	else if ($name == "rjcpm")
		return 8;
	else if ($name == "swoop")
		return 9;
	else if ($name == "jetpack")
		return 10;
	else if ($name == "speed")
		return 11;
	else if ($name == "sp")
		return 12;
	else if ($name == "slick")
		return 13;
	else if ($name == "botcpm")
		return 14;
	return -1;
}

?>
