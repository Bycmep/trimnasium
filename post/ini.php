<?php
echo "INI";
if ($db->query('show tables like "events"')->num_rows == 0) {
    echo 'Creating events table.^';
    $db->query('create table events (id int unsigned auto_increment primary key,
        category int unsigned, start bigint unsigned, duration int unsigned, description varchar(255))');
}
?>