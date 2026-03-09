<?php
header('Content-Type: application/json; charset=utf-8');

$servername = 'localhost';
$username = 'admin';
$password = 'password';
$dbname = 'trimnasium';
$output = [];
$out = [];
$db = null;
date_default_timezone_set('America/Los_Angeles');
$time = date('Y/m/d H:i:s');
ob_start();

try {
    $db = new mysqli($servername, $username, $password, $dbname);
    $output['err'] = false;

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $in = $_GET;
        require array_keys($_GET)[0].'.php';
        get();
    } else {
        $in = $_REQUEST;
        require $in['_obj_'].'.php';
        $in['_fun_']();
    }
    $output['data'] = $out;
    $output['log'] = strip_tags(ob_get_clean());
    echo json_encode($output); 
    $db->close();
} catch(Exception $e) {
    $output['err'] = true;
    $output['log'] = strip_tags(ob_get_clean()).$e->getMessage();
    echo json_encode($output); 
    if ($db) $db->close();
    exit(-1);
}

function _quote($s) {
    return "'".str_replace("'","''",$s)."'";
}
function _insert($table, $vars) {
    global $db, $in;
    $values = [];
    foreach ($vars as $var) $values[] = _quote($in[$var]);
    $db->query('insert into '.$table.' ('.implode(',', $vars).') values ('.implode(',', $values).')');
    return $db->insert_id;
}
function _update($table, $update) {
    global $db, $in;
    $pairs = [];
    foreach ($in as $key => $value) {
        if (in_array($key, $update)) $pairs[] = $key.'='._quote($value);
    }    
    $db->query('update '.$table.' set '.implode(',', $pairs).' where id = '.$in['id']);
}
function _getvar($var) {
    global $db;
    $q = $db->query('select '.$var.' from vars');
    $f = $q->fetch_assoc();
    return $f[$var];
}
function _setvar($var, $value) {
    global $db;
    $db->query('update vars set '.$var.' = '._quote($value));
}

?>