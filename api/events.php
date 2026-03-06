<?php
function get() {
    global $db, $in, $out;
    $q = $db->query('select * from events where day between '.$in['from'].' and '.$in['to'].';');
    while($f = $q->fetch_assoc()) array_push($out, $f);
}
function create() {
    _insert('events', ['category', 'day', 'time', 'duration', 'desc']);
}
function update() {
    _update('events', ['day', 'time', 'duration']);
}
?>