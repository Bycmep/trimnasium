<?php
function store() {
    global $db, $out;
    $num = (int)_getvar('photos');
    if (move_uploaded_file($_FILES["file"]["tmp_name"],
        '../img/'.str_pad($num, 8, "0", STR_PAD_LEFT).'.webp')) {
            $out['num'] = $num; _setvar('photos', $num + 1);
    }
    else { echo "Error storing the uploaded file."; $out['num'] = -1; }   
}
?>