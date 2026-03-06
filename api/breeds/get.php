<?php
$q = $db->query('select * from breeds');
while($f = $q->fetch_assoc()) array_push($out, $f['name']);
?>