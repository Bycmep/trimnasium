<?php
$from = $in['events']*86400000;
$to = $in['to']*86400000;
$q = $db->query('select * from events where start >= '.$from.' && start < '.$to);
while($f = $q->fetch_assoc()) array_push($out, $f);
?>