<?php
    $file=$_FILES["fileField"];
	$toFile=$_POST['toFile'];
	if(!$file){echo "error:no document";return;}
	if(!$toFile){echo "error:no toFile";return;}
	move_uploaded_file($_FILES["fileField"]["tmp_name"], $toFile.$_FILES["fileField"]["name"]);////file
    echo $toFile.$_FILES["fileField"]["name"];
?>