<?php
$db->query('insert into breeds (name) values ('.quote($in['name']).')');
?>