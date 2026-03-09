<?php
function get() {
    global $db, $in, $out;
    $q = $db->query('select * from dogs where id = '.$in['id']);
    $out = $q->fetch_assoc();
}
function create() {
    global $db, $in, $out;
    $id = _insert('dogs', ['name', 'breed', 'rating', 'notes', 'owner', 'phone']);
    if (!empty($in['photoids']))
        $db->query('update photos set dog_id = '.$id.' where id in ('.$in['photoids'].')');
    $out['id'] = $id;
}
function update() {
    global $db, $in;
    _update('dogs', ['name', 'breed', 'rating', 'notes', 'owner', 'phone']);
    if (!empty($in['plus']))
        $db->query('update photos set dog_id = '.$in['id'].' where id in ('.$in['plus'].')');
    if (!empty($in['minus']))
        $db->query('update photos set dog_id = null where id in ('.$in['minus'].')');
}
?>