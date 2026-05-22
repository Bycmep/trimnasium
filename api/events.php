<?php
function get() {
    global $db, $in, $out;
    $query = 'select * from events';
    $params = [];
    if (isset($in['from'])) $params[] = 'day between '.$in['from'].' and '.$in['to'];
    if (isset($in['cat'])) $params[] = 'category='.$in['cat'];
    if (!empty($params)) $query .= ' where '.implode(' and ', $params);

    $q = $db->query($query);
    if (array_key_exists('count', $in)) $out = $q->num_rows;
    else while($f = $q->fetch_assoc()) array_push($out, $f);
}
function replacecat() {
    global $db, $in;
    $db->query('update events set category='.$in['to'].' where category='.$in['from']);
}
function create() {
    _insert('events', ['category', 'day', 'time', 'duration', 'description']);
}
function update() {
    _update('events', ['day', 'time', 'duration']);
}
?>