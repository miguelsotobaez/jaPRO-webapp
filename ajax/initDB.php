<?php
	require_once('../inc/db_connection.inc.php');

	$query = "CREATE TABLE IF NOT EXISTS accounts(id INTEGER PRIMARY KEY, username VARCHAR(16), password VARCHAR(16), kills UNSIGNED SMALLINT, deaths UNSIGNED SMALLINT, 
		suicides UNSIGNED SMALLINT, captures UNSIGNED SMALLINT, returns UNSIGNED SMALLINT, lastlogin UNSIGNED INTEGER, created UNSIGNED INTEGER, lastip UNSIGNED INTEGER)";
	$results = $db->query($query);

	$query = "CREATE TABLE IF NOT EXISTS races(id INTEGER PRIMARY KEY, username VARCHAR(16), coursename VARCHAR(40), duration_ms UNSIGNED INTEGER, topspeed UNSIGNED SMALLINT, 
		average UNSIGNED SMALLINT, style UNSIGNED TINYINT, end_time UNSIGNED INTEGER, rank UNSIGNED SMALLINT, entries UNSIGNED SMALLINT)";
	$results = $db->query($query);

	$query = "CREATE TABLE IF NOT EXISTS duels(id INTEGER PRIMARY KEY, winner VARCHAR(16), loser VARCHAR(16), duration UNSIGNED SMALLINT, 
		type UNSIGNED TINYINT, winner_hp UNSIGNED TINYINT, winner_shield UNSIGNED TINYINT, end_time UNSIGNED INTEGER, winner_elo DECIMAL(6,2), loser_elo DECIMAL(6,2), odds DECIMAL(9,2))";
	$results = $db->query($query);

	$query = "CREATE TABLE IF NOT EXISTS updates(id INTEGER PRIMARY KEY, type VARCHAR(16), last_update INTEGER)";
	$results = $db->query($query);

	$query = "SELECT COUNT(*) FROM updates WHERE type = 'races'";
	$count = $db->querySingle($query);
	if ($count == 0) {
		$query = "INSERT INTO updates(type, last_update) VALUES('races', 0)";
		$results = $db->query($query);
	}

	$query = "SELECT COUNT(*) FROM updates WHERE type = 'duels'";
	$count = $db->querySingle($query);
	if ($count == 0) {
		$query = "INSERT INTO updates(type, last_update) VALUES('duels', 0)";
		$results = $db->query($query);
	}

	$query = "SELECT COUNT(*) FROM updates WHERE type = 'accounts'";
	$count = $db->querySingle($query);
	if ($count == 0) {
		$query = "INSERT INTO updates(type, last_update) VALUES('accounts', 0)";
		$results = $db->query($query);
	}

	$db->close();

?>