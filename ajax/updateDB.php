<?php
require_once('../inc/db_connection.inc.php');
//require_once('../inc/session.inc.php');

$option = null;
if (isset($_POST['option'])) {
	$option = $_POST["option"];
}

//Debug
if (isset($_GET['option'])) {
	$option = $_GET["option"];
}
//Debug

/*
	if ($query_stmt = mysqli_prepare($link, $query)) {
		mysqli_stmt_bind_param($query_stmt, "ss", $lastip, $lastip);
		mysqli_stmt_execute($query_stmt);
		mysqli_stmt_bind_result($query_stmt, $country);
		mysqli_stmt_fetch($query_stmt);
		mysqli_stmt_close($query_stmt);
}
*/

function UpdateRaces() {
	global $db;
	$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'races'")->fetch_object()->last_update;  
	$time = time();
	if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
		return;
	}

	$data = GetStats("races", $last_update);

	if ($data) {
		if (!$db->query("DROP INDEX IF EXISTS RaceRankIndex on japro_web.Races")) {
			echo $db->error;
		}
		if (!$db->query("DROP INDEX IF EXISTS RaceSeasonRankIndex on japro_web.Races")) {
			echo $db->error;
		}
	}

	$values = "";
	if ($data) {
		foreach ($data as $value) {
			$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."', '".$value[4]."', '".$value[5]."', '".$value[6]."', '".$value[7]."', '".$value[8]."', '".$value[9]."', '".$value[10]."', '".$value[11]."'),";
		}
	}
	InsertStats("REPLACE INTO Races(username, coursename, style, season, duration_ms, topspeed, average, end_time, rank, entries, season_rank, season_entries)", $values);

	if ($data)	{//Index rank, this speeds up gold/silver/bronze query a bit //Fixme make sure no results means this doesnt go through
		if (!$db->query("CREATE INDEX IF NOT EXISTS RaceRankIndex ON Races (rank)")) {
			echo $db->error;
		}
		if (!$db->query("CREATE INDEX IF NOT EXISTS RaceSeasonRankIndex ON Races (season_rank)")) {
			echo $db->error;
		}
	}

	if ($stmt = $db->prepare("UPDATE Updates SET last_update = ? WHERE type = 'races'")) {
		$stmt->bind_param('i', $time);
		$stmt->execute();
		$stmt->close();
	}

}

function UpdateDuels() {
	global $db;
	$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'duels'")->fetch_object()->last_update;  
	$time = time();
	if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
		//return;
	}

	$data = GetStats("duels", $last_update);

	$values = "";
	if ($data) {
		foreach ($data as $value) {
			$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."', '".$value[4]."', '".$value[5]."', '".$value[6]."', '".$value[7]."', '".$value[8]."', '".$value[9]."'),";
		}
	}
	InsertStats("INSERT INTO Duels(winner, loser, type, duration, winner_hp, winner_shield, end_time, winner_elo, loser_elo, odds)", $values);

	if ($stmt = $db->prepare("UPDATE Updates SET last_update = ? WHERE type = 'duels'")) {
		$stmt->bind_param('i', $time);
		$stmt->execute();
		$stmt->close();
	}
}

function UpdateAccounts() {
	global $db;
	$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'accounts'")->fetch_object()->last_update;  
	$time = time();
	if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
		return;
	}

	$data = GetStats("accounts", $last_update);

	$values = "";
	if ($data) {
		foreach ($data as $value) {
			$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."', '".$value[4]."', '".$value[5]."', '".$value[6]."', '".$value[7]."'),";
		}
	}
	InsertStats("REPLACE INTO Accounts(username, kills, deaths, suicides, captures, returns, lastlogin, created)", $values);

	if ($stmt = $db->prepare("UPDATE Updates SET last_update = ? WHERE type = 'accounts'")) {
		$stmt->bind_param('i', $time);
		$stmt->execute();
		$stmt->close();
	}
}

function UpdateTeams() {
	global $db;
	$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'teams'")->fetch_object()->last_update;  
	$time = time();
	if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
		return;
	}

	$data = GetStats("teams", $last_update);

	$values = "";
	if ($data) {
		foreach ($data as $value) {
			$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."', '".$value[3]."'),";
		}
	}
	InsertStats("REPLACE INTO Teams(name, tag, longname, flags)", $values);

	if ($stmt = $db->prepare("UPDATE Updates SET last_update = ? WHERE type = 'teams'")) {
		$stmt->bind_param('i', $time);
		$stmt->execute();
		$stmt->close();
	}
}

function UpdateTeamAccounts() {
	global $db;
	$last_update = $db->query("SELECT last_update FROM Updates WHERE type = 'team_accounts'")->fetch_object()->last_update;  
	$time = time();
	if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
		return;
	}

	$data = GetStats("team_accounts", $last_update);

	$values = "";
	if ($data) {
		foreach ($data as $value) {
			$values .= "('".$value[0]."', '".$value[1]."', '".$value[2]."'),";
		}
	}
	InsertStats("REPLACE INTO TeamAccounts(team, account, flags)", $values);

	if ($stmt = $db->prepare("UPDATE Updates SET last_update = ? WHERE type = 'team_accounts'")) {
		$stmt->bind_param('i', $time);
		$stmt->execute();
		$stmt->close();
	}
}

switch ($option) {
	case "races":	
		UpdateRaces();
	break;

	case "duels":
		UpdateDuels();
	break;

	case "accounts": //Just update everything, also update team names?
		UpdateAccounts();
		UpdateRaces();
		UpdateDuels();
		UpdateTeams();
		UpdateTeamAccounts();
	break;
}

$db->close();

function GetStats($type, $last_update) {
	$url = "http://74.91.123.99/stats/update.php";
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


function InsertStats2($query, $columns, $values) {
	global $db;
	if(!empty($values)) {
		$values = substr($values, 0, -1); //Remove trailing comma

		//$query is "REPLACE INTO Races" format
		//$columns is "username, coursename, style" format
		//$values is "(a b c), (d e f), (g h i), " format 
		//formats can be changed if needed!

		//Create the string of (? ? ?), (? ? ?), (? ? ?)  etc
		//Should values just be an array of values without (), ??, or can it work in current format

		$rowPlaces = '(' . implode(', ', array_fill(0, count($columns), '?')) . ')';
		$allPlaces = implode(', ', array_fill(0, count($values), $rowPlaces));

		$sql = $query . "(" . $columns . ") VALUES " . $allPlaces;
		$stmt = $db->prepare($sql);

		$stmt->execute($values); //???
		$stmt->close();

	}
}

?>
