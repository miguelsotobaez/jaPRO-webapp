<?php
require_once('db_connection.inc.php');


    $myusername = $_POST['username'];
    $mypassword = $_POST['password'];

    $myusername = stripslashes($myusername);
    $mypassword = stripslashes($mypassword);

    $query = "SELECT * FROM LocalAccount WHERE username = '".$myusername."' AND password = '".$mypassword."' ";

    $arr=sql2arr($query);

    if($arr){
        echo'worked';
        session_start();
        $_SESSION['valid_user'] = true;
        $_SESSION['username'] = $myusername;
        $_SESSION['SESSION_START']=time(); 
        header('Location: ../app.php');
    }else{
        echo'failed';
        session_unset();
        session_write_close();
        setcookie(session_name(),'',0,'/');
        session_regenerate_id(true);
        header('Location: loginfail.inc.php');
    }

?>