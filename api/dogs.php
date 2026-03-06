<?php
function get() {
    global $db, $in, $out;
    $q = $db->query('select * from dogs where id = '.$in['id']);
    while($f = $q->fetch_assoc()) array_push($out, $f);
}
function create() {
    _insert('dogs', ['name', 'breed', 'rating', 'notes', 'owner', 'phone']);
}

function update() {
    _update('dogs', ['name', 'breed', 'rating', 'notes', 'owner', 'phone']);
}
?>