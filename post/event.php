<?php
$db->query('insert into events (category, start, duration, description) values
    ('.$in['category'].','.$in['start'].','.$in['duration'].',"'.$in['desc'].'")');

?>