<?php
function valid_language($language){
  $valid_languages = array("chinglish", "traditional_chinese");
  return in_array($language, $valid_languages);
}
$lang = valid_language($_GET['lang']) ? $_GET['lang'] : "traditional_chinese";
require_once("./language/".$lang.".inc.php");
?>
