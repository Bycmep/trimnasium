<?php
$q = $db->query('select * from events where day between '.$in['events'].' and '.$in['to'].';');
while($f = $q->fetch_assoc()) array_push($out, $f);
?>