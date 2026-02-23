<?php
if ($db->query('show tables like "events"')->num_rows == 0) {
    echo 'Creating events table.^';
    $db->query('create table events (id int unsigned auto_increment primary key,
        category int unsigned, day int unsigned, time int unsigned, duration int unsigned,
        description varchar(255))');
}
if ($db->query('show tables like "breeds"')->num_rows == 0) {
    echo 'Creating breeds table.^';
    $db->query('create table breeds (id int unsigned auto_increment primary key, name varchar(64))');
}
if ($db->query('show tables like "dogs"')->num_rows == 0) {
    echo 'Creating dogs table.^';
    $db->query('create table dogs (id int unsigned auto_increment primary key,
        name varchar(64), breed varchar(64), rating int unsigned, notes tinytext,
        owner varchar(64), phone varchar(10))');
}
if ($db->query('show tables like "owners"')->num_rows == 0) {
    echo 'Creating owners table.^';
    $db->query('create table owners (id int unsigned auto_increment primary key,
        name varchar(64), phone varchar(10))');
}
if ($db->query('show tables like "vars"')->num_rows == 0) {
    echo 'Creating var table.^';
    $db->query('create table vars (photos int unsigned)');
    $db->query('insert into vars (photos) values (0)');
}
?>