<?php
function get() {
    global $db, $out;
    $q = $db->query('select * from categories order by id');
    while($f = $q->fetch_assoc()) array_push($out, $f);
}
function create() {
    _insert('categories', ['id', 'name', 'color']);
}
function update() {
    _update('categories', ['name', 'color']);
}
function delete() {
    global $db, $in;
    $q = $db->query('delete from categories where id='.$in['id']);
}
?>