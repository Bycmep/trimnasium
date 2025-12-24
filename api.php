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
        require 'get/'.array_keys($_GET)[0].'.php';    
    } else {
        $in = json_decode(file_get_contents('php://input'), true);
        require $_SERVER['REQUEST_METHOD'].'/'.$in['cmd'].'.php';
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
?>