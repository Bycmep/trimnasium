<?php
echo json_encode($_FILES);

$q = $db->query('select photos from vars');
$f = $q->fetch_assoc();
$num = (int)($f['photos']);

if (move_uploaded_file($_FILES["file"]["tmp_name"], './upload/'.str_pad($num, 8, "0", STR_PAD_LEFT).'.webp')) {
    $db->query('update vars set photos = '.($num + 1));
}
else echo "Error storing the uploaded file.";

?>