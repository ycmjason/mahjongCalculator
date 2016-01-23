#!/usr/bin/php
<?php
require_once("version.php");

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
    <title>Mahjong Score Calculator</title>
    <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAABX1BMVEX///+lZRmhYRK4qpjQ0MzOzszGxsO/v728vLq6ura2trO0tLKysq+vr6ysrKurq6ilpaGwsK2hoZ+hoZ6iop+hoZ/IyMS2QECoGhrc29jKysbMzMjGxsLJycbNzcmqXVvm5eSxNDSvNDSjOTnIu7fOz8vJyceaCgqoHR2jHh3LrarOzsrLy8mZAACsWVfMvrrR0c3Pz8vKysqRAADNxMHv5eTLfHzQ0MzMzMrR0c7S0s/LubbKubbT0c7V1dHQ0M3OzsvRyMXU1NDW1tLPz8zY2NTX19LX19PZ2dXU1NHa2tbc3Nnb29dERES2trLZ2dbS0tA6OjpsbGwfHx/e3trd3dnT09Dg4NwaGhri4t7j49/f39vT09Hl5uJCQkLn5+Tk5eHT08/u7uzx8u/x8e7v7+3u7uvDwbvu7urs7Ojp6ebq6uft7env7+vk5N/o6OTl5eLm5uPp6eXr6+ff3tsaoEqqAAAAFHRSTlMARuP7+/v7+/v7+/v7+/v7he98t4S+M5gAAAG6SURBVBiV7dpHT1VRFEBhBEREKYJY6SpgFxtKbxZQAXtBUBQL2Mv/D7O1JzshhAk5Wd9wn7fPXXf0kpdXUZHYg//4h7/4g9+I2S/E7k9UIivYgoEGGmiggbs8sArxuB/4jm/YSKzjKyL1Cww00EADDSwvsBqf8QlriY/IPhezD1iFgQYaaKCB5QXuxXvEl967xAqy02XEfW9hoIEGGmhgeYE1WMKbxOvEK8QsNl7iBQw00EADDSwvcB+e41niKeJF4vQJHiNOF2GggQYaaGB5gbVYwDwe4SEeIJuFORhooIEGGlhy4H7M4n7iHrLTu4jZHczAQAMNNNDA8gLrED+STSemEpOIWWzEHwEmYKCBBhpoYHmBBzCOuHoMo4iYEQxjCLdxCwYaaKCBBpYXeBCDiMCbuIHruIbVRLzwVRhooIEGGlheYD0GEKlXcBmXcBGDibjvAgw00EADDSwvsAHnEVefw1n0ow9ZVuiFgQYaaKCB5QU2IgLP4DROoQfd6EInOtAOAw000EADywtsQhtO4gSOIx58DEcRu0dwCAYaaKCBBpYXGJrRisPbFrst2FGWgQYaaKCBuydwE1z1+XlhZbgqAAAAAElFTkSuQmCC" rel="icon" type="image/x-icon" />

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="description" content="A simple mahjong score calculator for mahjong lovers.">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/angular.chartjs/latest/angular-chart.css">
  </head>
  <body ng-controller="indexController">
    <section class="container ng-cloak">
      <header class="jumbotron">
        <h1>
          <img src="//cdn0.iconfinder.com/data/icons/mahjong/128/man8.png" />
          Mahjong Score Calculator
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
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
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
