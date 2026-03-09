<?php
function store() {
    global $db, $out;
    $db->query('insert into photos () values ()');
    $num = $db->insert_id;
    if (move_uploaded_file($_FILES["file"]["tmp_name"],
        '../img/'.str_pad($num, 8, "0", STR_PAD_LEFT).'.webp')) { $out['num'] = $num; }
    else { echo "Error storing the uploaded file."; $out['num'] = -1; }   
}
function get() {
    global $db, $in, $out;
    $q = $db->query('select id from photos where dog_id = '.$in['id']);
    while($f = $q->fetch_assoc()) array_push($out, $f['id']);
}
?>