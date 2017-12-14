<?php
require_once('../inc/db_connection.inc.php');
//require_once('../inc/session.inc.php');

$option = null;
if (isset($_GET['option'])) {
	$option = $_GET["option"];
}

switch ($option) {
	case "races":
		$last_update = $db->querySingle("SELECT last_update FROM updates WHERE type = 'races'");
		$time = time();
		if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
			break;
		}

		$json = GetStats("races", $last_update); //Get data from gameserver
		//echo $json;

		//Insert data into races

		//Cleanup races (delete duplicate course/style/usernames with higher duration_ms... or lower end_time ? )

		$stmt = $db->prepare("UPDATE updates SET last_update = :last_update WHERE type = 'races'");
		$stmt->bindValue(':last_update', $time);
		$result = $stmt->execute();
	break;

	case "duels":
		$last_update = $db->querySingle("SELECT last_update FROM updates WHERE type = 'duels'");
		$time = time();
		if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
			break;
		}

		$json = GetStats("duels", $last_update); //Get data from gameserver

		//Insert data into duels

		//No need for cleanup, but it would just be deleting actual duplicate entries

		$stmt = $db->prepare("UPDATE updates SET last_update = :last_update WHERE type = 'duels'");
		$stmt->bindValue(':last_update', $time);
		$result = $stmt->execute();
	break;

	case "accounts":
		$last_update = $db->querySingle("SELECT last_update FROM updates WHERE type = 'accounts'");
		$time = time();
		if ($last_update + 60 > $time) { //If last update was within 1 minute, exit.
			break;
		}

		$json = GetStats("accounts", $last_update); //Get data from gameserver

		//Insert data into accounts

		//Delete duplicate usernames with lower lastlogin ? or should we just refresh this table completely 

		$stmt = $db->prepare("UPDATE updates SET last_update = :last_update WHERE type = 'accounts'");
		$stmt->bindValue(':last_update', $time);
		$result = $stmt->execute();
	break;
}

$db->close();


function GetStats($type, $last_update) {
	$url = "http://162.248.89.208/stats/update.php";
	$postdata = http_build_query(
	    array(
	        'username' => 'username',
	        'password' => 'password',
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
	//$obj = json_decode($json);
	return $json;
} 

?>
