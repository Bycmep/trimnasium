<?php
function get() {
    global $db, $out;
    $q = $db->query('select * from owners');
    while($f = $q->fetch_assoc()) array_push($out, $f);
}
function create() {
    global $db, $in;
    $db->query('insert into owners (name, phone) values ('.quote($in['name']).','.quote($in['phone']).')');
}
function delete() {
}
?>