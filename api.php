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
        require array_keys($_GET)[0].'/get.php';    
    } else {
        $in = $_REQUEST;
        require $in['_obj_'].'/'.$_SERVER['REQUEST_METHOD'].'.php';
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

function quote($s) {
    return "'".str_replace("'","''",$s)."'";
}
?>