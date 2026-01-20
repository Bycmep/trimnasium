<?php
if ($db->query('show tables like "events"')->num_rows == 0) {
    echo 'Creating events table.^';
    $db->query('create table events (id int unsigned auto_increment primary key,
        category int unsigned, day int unsigned, time int unsigned, duration int unsigned,
        description varchar(255))');
}
if ($db->query('show tables like "var"')->num_rows == 0) {
    echo 'Creating var table.^';
    $db->query('create table vars (photos int unsigned)');
    $db->query('insert into vars (photos) values (0)');
}
?>