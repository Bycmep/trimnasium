<?php
$db->query('insert into owners (name, phone) values ('.quote($in['name']).','.quote($in['phone']).')');
?>