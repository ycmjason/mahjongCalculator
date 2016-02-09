#!/usr/bin/php
<?php
require_once("version.php");
require_once("language/lang.inc.php");

$js_resources = array();
array_push($js_resources, "./js/lib/socket.io.js");
array_push($js_resources, "./js/lib/angular-socket-io.min.js");

array_push($js_resources, "./js/Utils.js");
array_push($js_resources, "./js/classes/strategies/chung/ChungStrategy.js");
array_push($js_resources, "./js/classes/strategies/chung/HalfChungStrategy.js");
array_push($js_resources, "./js/classes/strategies/chung/FullChungStrategy.js");

array_push($js_resources, "./js/classes/strategies/farnScore/FarnScoreStrategy.js");
array_push($js_resources, "./js/classes/strategies/farnScore/BasicStrategy.js");
array_push($js_resources, "./js/classes/strategies/farnScore/25ChickenStrategy.js");
array_push($js_resources, "./js/classes/strategies/farnScore/51Strategy.js");
array_push($js_resources, "./js/classes/strategies/farnScore/12MosquitosStrategy.js");

array_push($js_resources, "./js/classes/Round.js");
array_push($js_resources, "./js/classes/MJData.js");
array_push($js_resources, "./js/classes/isCleans.js");

array_push($js_resources, "./js/mjCal.js");
array_push($js_resources, "./js/controllers.js");
?>
<html ng-app="mjCal">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="description" content="A simple mahjong score calculator for mahjong lovers.">

    <title><?=$lang['title']?></title>

    <link href="favicon.ico" rel="icon" type="image/x-icon" />

    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/angular.chartjs/latest/angular-chart.css">
    <!-- angular is included in head for ng-cloak to work properly! -->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
  </head>
  <body ng-controller="indexController" class="ng-cloak">
    <section class="container">
      <header class="jumbotron">
        <h1>
          <img src="images/logo.png" />
          <?=$lang['title']?>
        </h1>
      </header>
      <main ng-hide="started">
        <?php include("entrance.html"); ?>
      </main>
      <main ng-if="started">
        <?php include("started.html"); ?>
      </main>
      <footer>
        <?php include("footer.html"); ?>
      </footer>
    </section>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.js"></script>
    <script src="//cdn.jsdelivr.net/angular.chartjs/latest/angular-chart.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<?php foreach($js_resources as $js_resource){?>
    <script src="<?=$js_resource?>"></script>
<?php }?>
    <script>
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    </script>
<?php if(strpos($_SERVER[HTTP_HOST], "ycmjason.com")!==false){ ?>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-71404316-1', 'auto');
      ga('send', 'pageview');

    </script>
<?php }?>
  </body>
</html>
