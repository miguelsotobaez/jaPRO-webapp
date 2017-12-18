<?php
require_once('../inc/db_connection.inc.php');
//require_once('../inc/session.inc.php');

$option = null;
if (isset($_POST['option'])) {
	$option = $_POST["option"];
}

/*
	if ($query_stmt = mysqli_prepare($link, $query)) {
		mysqli_stmt_bind_param($query_stmt, "ss", $lastip, $lastip);
		mysqli_stmt_execute($query_stmt);
		mysqli_stmt_bind_result($query_stmt, $country);
		mysqli_stmt_fetch($query_stmt);
		mysqli_stmt_close($query_stmt);
}
*/

switch ($option) {
	case "races":
		$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'races'")->fetch_object()->last_update;  
		$time = time();
		if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
			break;
		}

		//IF FORCE REFRESH
		//$db->query("DELETE FROM Races");
		//$last_update = 1512099645;

		$data = GetStats("races", $last_update);

		if ($data) {
			if (!$db->query("DROP INDEX IF EXISTS RaceRankIndex on japro_web.Races;")) {
				echo $db->error;
			}
		}

		$values = "";
		if ($data) {
			foreach ($data as $value) {
				$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."', '".$value[4]."', '".$value[5]."', '".$value[6]."', '".$value[7]."', '".$value[8]."'),";
			}
		}
		InsertStats("REPLACE INTO Races(username, coursename, style, duration_ms, topspeed, average, end_time, rank, entries)", $values);

		if ($data)	{//Index rank, this speeds up gold/silver/bronze query a bit //Fixme make sure no results means this doesnt go through
			if (!$db->query("CREATE INDEX IF NOT EXISTS RaceRankIndex ON Races (rank)")) {
				echo $db->error;
			}
		}

		$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'accounts'")->fetch_object()->last_update;  
		$data = GetStats("accounts", $last_update);
		$values = "";
		if ($data) {
			foreach ($data as $value) {
				$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."', '".$value[4]."', '".$value[5]."', '".$value[6]."', '".$value[7]."'),";
			}
		}
		InsertStats("REPLACE INTO Accounts(username, kills, deaths, suicides, captures, returns, lastlogin, created)", $values);

		//Make sure we dont have any duplicates (this is needed because we get rows that have been recently affected even though they have not been recently completed) //fixme - should also sort by last_update 
		//if (!$db->query("DELETE FROM Races WHERE id NOT IN (SELECT id FROM (SELECT id, coursename, username, style FROM Races ORDER BY duration_ms DESC, last_update ASC) AS T GROUP BY T.username, T.coursename, T.style)")) {
		//	echo $db->error;
		//}

		if ($stmt = $db->prepare("UPDATE Updates SET last_update = ? WHERE type = 'races' OR type = 'accounts'")) {
			$stmt->bind_param('i', $time);
			$stmt->execute();
			$stmt->close();
		}

	break;

	case "duels":
		$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'duels'")->fetch_object()->last_update;  
		$time = time();
		if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
			break;
		}

		$data = GetStats("duels", $last_update);
		$values = "";
		if ($data) {
			foreach ($data as $value) {
				$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."', '".$value[4]."', '".$value[5]."', '".$value[6]."', '".$value[7]."', '".$value[8]."', '".$value[9]."'),";
			}
		}
		InsertStats("INSERT INTO Duels(winner, loser, type, duration, winner_hp, winner_shield, end_time, winner_elo, loser_elo, odds)", $values);

		$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'accounts'")->fetch_object()->last_update;  
		$data = GetStats("accounts", $last_update);
		$values = "";
		if ($data) {
			foreach ($data as $value) {
				$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."', '".$value[4]."', '".$value[5]."', '".$value[6]."', '".$value[7]."'),";
			}
		}
		InsertStats("REPLACE INTO Accounts(username, kills, deaths, suicides, captures, returns, lastlogin, created)", $values);
		//No need for cleanup, but it would just be deleting actual duplicate entries

		if ($stmt = $db->prepare("UPDATE Updates SET last_update = ? WHERE type = 'duels' OR type = 'accounts'")) {
			$stmt->bind_param('i', $time);
			$stmt->execute();
			$stmt->close();
		}
	break;

	case "accounts":
		$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'accounts'")->fetch_object()->last_update;  
		$time = time();
		if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
			break;
		}

		//$db->query("DELETE FROM Types");

		$data = GetStats("accounts", $last_update);
		$values = "";
		if ($data) {
			foreach ($data as $value) {
				$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."', '".$value[4]."', '".$value[5]."', '".$value[6]."', '".$value[7]."'),";
			}
		}
		InsertStats("REPLACE INTO Accounts(username, kills, deaths, suicides, captures, returns, lastlogin, created)", $values);


		//$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'accounts'")->fetch_object()->last_update;  
				//Update everything here ?
		//Insert data into accounts

		//Delete duplicate usernames with lower lastlogin ? or should we just refresh this table completely -fixme

		if ($stmt = $db->prepare("UPDATE Updates SET last_update = ? WHERE type = 'accounts'")) {
			$stmt->bind_param('i', $time);
			$stmt->execute();
			$stmt->close();
		}
	break;
}

$db->close();

function GetStats($type, $last_update) {
	$url = "http://162.248.89.208/stats/update.php";
	$postdata = http_build_query(
	    array(
	        'username' => 'ups',
	        'password' => 'fyUfFZj6qYYg7U',
	        'type' => $type,
	        'last_update' => $last_update
	    )
	);
	$opts = array('http' =>
	    array(
	        'method'  => 'POST',
	        'header'  => 'Content-type: application/x-www-form-urlencoded',
	        'content' => $postdata
	    )
	);
	$context  = stream_context_create($opts);
	$json = file_get_contents($url, false, $context);
	return json_decode($json);
} 

function InsertStats($query, $values) {
	global $db;
	if(!empty($values)) {
		$values = substr($values, 0, -1); //Remove trailing comma
		if (!$db->query("{$query} VALUES {$values}")) { //Prepare this?
			echo $db->error;
		}
	}
}


?>
