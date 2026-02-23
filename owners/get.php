<?php
$q = $db->query('select * from owners');
while($f = $q->fetch_assoc()) array_push($out, $f);
?>