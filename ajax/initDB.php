<?php
	require_once('../inc/db_connection.inc.php');
	
	$db->query("DROP TABLE Accounts");
	$db->query("DROP TABLE Races");
	$db->query("DROP TABLE Duels");
	$db->query("DROP TABLE Updates");

	if (!$db->query("CREATE TABLE IF NOT EXISTS Accounts(id SMALLINT UNSIGNED AUTO_INCREMENT, username VARCHAR(16), kills SMALLINT UNSIGNED, deaths SMALLINT UNSIGNED, suicides SMALLINT UNSIGNED, captures SMALLINT UNSIGNED, returns SMALLINT UNSIGNED, lastlogin INT UNSIGNED, created INT UNSIGNED, lastip INT UNSIGNED, PRIMARY KEY (id), UNIQUE KEY (username))")) {
		echo $db->error;
	}
	if (!$db->query("CREATE TABLE IF NOT EXISTS Races(id INT UNSIGNED AUTO_INCREMENT, username VARCHAR(16), coursename VARCHAR(40), style TINYINT UNSIGNED, duration_ms INTEGER UNSIGNED, topspeed SMALLINT UNSIGNED, average SMALLINT UNSIGNED, end_time INTEGER UNSIGNED, rank SMALLINT UNSIGNED, entries SMALLINT UNSIGNED, PRIMARY KEY (id), CONSTRAINT user_course_style UNIQUE KEY (username, coursename, style))")) {
		echo $db->error;
	}
	if (!$db->query("CREATE TABLE IF NOT EXISTS Duels(id INT UNSIGNED AUTO_INCREMENT, winner VARCHAR(16), loser VARCHAR(16), type TINYINT UNSIGNED, duration INTEGER UNSIGNED, winner_hp TINYINT UNSIGNED, winner_shield TINYINT UNSIGNED, end_time INTEGER UNSIGNED, winner_elo DECIMAL(6,2), loser_elo DECIMAL (6,2), odds DECIMAL (9,2), PRIMARY KEY (id))")) {
		echo $db->error;
	}
	if (!$db->query("CREATE TABLE IF NOT EXISTS Updates(id TINYINT UNSIGNED AUTO_INCREMENT, type VARCHAR(16), last_update INTEGER UNSIGNED, PRIMARY KEY (id), UNIQUE KEY (id))")) {
		echo $db->error;
	}

	$count = $db->query("SELECT COUNT(*) as count FROM Updates WHERE type = 'accounts'")->fetch_object()->count;  
	if ($count == 0) {
		$db->query("INSERT INTO Updates(type, last_update) VALUES('accounts', 0)");
	}
	$count = $db->query("SELECT COUNT(*) as count FROM Updates WHERE type = 'races'")->fetch_object()->count;  
	if ($count == 0) {
		$db->query("INSERT INTO Updates(type, last_update) VALUES('races', 0)");
	}
	$count = $db->query("SELECT COUNT(*) as count FROM Updates WHERE type = 'duels'")->fetch_object()->count;  
	if ($count == 0) {
		$db->query("INSERT INTO Updates(type, last_update) VALUES('duels', 0)");
	}

	$db->close();

?>