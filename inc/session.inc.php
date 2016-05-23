<?php
session_start();

if(!isset($_GET["option"])){
	if(!isset($_SESSION['SESSION_START'])){
		header('Location: ../index.php');
		die();
	}

	if (isset($_SESSION['SESSION_START']) && (time() - $_SESSION['SESSION_START'] > 99999)) {
	    session_unset();
	    session_destroy();
	    session_write_close();
	    setcookie(session_name(),'',0,'/');
	    session_regenerate_id(true);
		header('Location: ../index.php');
		die();
	}
}else{
	$option = $_GET["option"];
	switch ($option) {
		case "sesion_end":
		 	$state = null;
			if (isset($_SESSION['SESSION_START']) && (time() - $_SESSION['SESSION_START'] > 99999)) {
		    	session_unset();
			    session_destroy();
			    session_write_close();
			    setcookie(session_name(),'',0,'/');
			    session_regenerate_id(true);
				$state =1;
			}else{
				$_SESSION['SESSION_START'] = time();
				$state =0;
			}
			echo $state; 
		break;
	}

}

?>