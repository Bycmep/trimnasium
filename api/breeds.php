<?php
function get() {
    global $db, $out;
    $q = $db->query('select * from breeds');
    while($f = $q->fetch_assoc()) array_push($out, $f['name']);
}
function create() {
    global $db, $in;
    $db->query('insert into breeds (name) values ('.quote($in['name']).')');
}
function delete() {
}
?>