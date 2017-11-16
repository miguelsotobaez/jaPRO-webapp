<?php

function TimeToSTring($duration_ms) { //loda fixme... has to be a standard way to do this
  if ($duration_ms >= (60*60*1000)) {
    $hours = (int)(($duration_ms / (1000*60*60)) % 24);
    $minutes = (int)(($duration_ms / (1000*60)) % 60);
    $seconds = (int)($duration_ms / 1000) % 60;
    $milliseconds = $duration_ms % 1000; 

    $minutes = sprintf("%02d", $minutes);
    $seconds = sprintf("%02d", $seconds );
    $milliseconds = sprintf("%03d", $milliseconds );

    $timeStr = "$hours:$minutes:$seconds.$milliseconds";
  }
  else if ($duration_ms >= (60*1000)) {
    $minutes = (int)(($duration_ms / (1000*60)) % 60);
    $seconds = (int)($duration_ms / 1000) % 60;
    $milliseconds = $duration_ms % 1000; 

    $seconds = sprintf("%02d", $seconds );
    $milliseconds = sprintf("%03d", $milliseconds );

    $timeStr = "$minutes:$seconds.$milliseconds";
  }
  else 
    $timeStr = number_format($duration_ms * 0.001, 3);
  return $timeStr;
}

  ?>