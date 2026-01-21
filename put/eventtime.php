<?php
$allowed = ['day', 'time', 'duration'];
$q = '';
foreach ($in as $key => $value) {
    if (in_array($key, $allowed)) {
        if ($q !== '') $q .= ', ';
        $q .= $key.' = '.$value;
    }
}
echo 'update events set '.$q.' where id = '.$in['id'];
$db->query('update events set '.$q.' where id = '.$in['id']);
?>
