<?php
$db->query('insert into events (category, day, time, duration, description) values
    ('.$in['category'].','.$in['day'].','.$in['time'].','.$in['duration'].',"'.$in['desc'].'")');
?>