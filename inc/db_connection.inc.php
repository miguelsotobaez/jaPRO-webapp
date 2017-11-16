<?php
require_once('config.inc.php');
set_time_limit(45);

function connect(){
  class MyDB extends SQLite3
   {
      function __construct()
      {
        //Sqlite database never have to be writen by the webapp. This can help to do not block database from server writes.
        $this->open(DATABASE_ROUTE, SQLITE3_OPEN_READONLY);
      }
   }
   $db = new MyDB();
   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      //echo "Opened database successfully\n";
      return $db;
   }

}

function sql2arr($sql){
  $conn = connect();
  $arrayResult = null;
  $results = $conn->query($sql);
  while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
      $arrayResult[]=$row;
  }
  if($arrayResult){
    return $arrayResult;
  }else{
    return false;
  }
  
}
?>