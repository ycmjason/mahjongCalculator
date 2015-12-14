#!/usr/bin/php
<?php
$mjData = $_GET['mjData'];

header('Content-Disposition: attachment; filename="mjData.json"');
header('Content-Type: text/plain'); # Don't use application/force-download - it's not a real MIME type, and the Content-Disposition header is sufficient
header('Content-Length: ' . strlen($mjData));
header('Connection: close');


echo stripslashes($mjData);
?>
