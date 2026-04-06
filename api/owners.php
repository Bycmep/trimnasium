<?php
function get() {
    global $db, $out;
    $q = $db->query('select * from owners');
    while($f = $q->fetch_assoc()) array_push($out, $f);
}
function store() {
    global $db, $in;
    $q = $db->query('select id fom owners where name='._quote($in['name']));
    if($f = $q->fetch_assoc())
        $db->query('update owners set phone='.$in['phone'].' where id='.$f['id']);
    else $db->query('insert into owners (name, phone) values ('.
        _quote($in['name']).','._quote($in['phone']).')');
}
function delete() {
}
?>