#!/usr/bin/php
<?php
$js_resources = array();
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
array_push($js_resources, "./js/controllers.js");
?>
<html ng-app="mjCal">
  <head>
    <title>Mahjong Score Calculator</title>
    <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAABX1BMVEX///+lZRmhYRK4qpjQ0MzOzszGxsO/v728vLq6ura2trO0tLKysq+vr6ysrKurq6ilpaGwsK2hoZ+hoZ6iop+hoZ/IyMS2QECoGhrc29jKysbMzMjGxsLJycbNzcmqXVvm5eSxNDSvNDSjOTnIu7fOz8vJyceaCgqoHR2jHh3LrarOzsrLy8mZAACsWVfMvrrR0c3Pz8vKysqRAADNxMHv5eTLfHzQ0MzMzMrR0c7S0s/LubbKubbT0c7V1dHQ0M3OzsvRyMXU1NDW1tLPz8zY2NTX19LX19PZ2dXU1NHa2tbc3Nnb29dERES2trLZ2dbS0tA6OjpsbGwfHx/e3trd3dnT09Dg4NwaGhri4t7j49/f39vT09Hl5uJCQkLn5+Tk5eHT08/u7uzx8u/x8e7v7+3u7uvDwbvu7urs7Ojp6ebq6uft7env7+vk5N/o6OTl5eLm5uPp6eXr6+ff3tsaoEqqAAAAFHRSTlMARuP7+/v7+/v7+/v7+/v7he98t4S+M5gAAAG6SURBVBiV7dpHT1VRFEBhBEREKYJY6SpgFxtKbxZQAXtBUBQL2Mv/D7O1JzshhAk5Wd9wn7fPXXf0kpdXUZHYg//4h7/4g9+I2S/E7k9UIivYgoEGGmiggbs8sArxuB/4jm/YSKzjKyL1Cww00EADDSwvsBqf8QlriY/IPhezD1iFgQYaaKCB5QXuxXvEl967xAqy02XEfW9hoIEGGmhgeYE1WMKbxOvEK8QsNl7iBQw00EADDSwvcB+e41niKeJF4vQJHiNOF2GggQYaaGB5gbVYwDwe4SEeIJuFORhooIEGGlhy4H7M4n7iHrLTu4jZHczAQAMNNNDA8gLrED+STSemEpOIWWzEHwEmYKCBBhpoYHmBBzCOuHoMo4iYEQxjCLdxCwYaaKCBBpYXeBCDiMCbuIHruIbVRLzwVRhooIEGGlheYD0GEKlXcBmXcBGDibjvAgw00EADDSwvsAHnEVefw1n0ow9ZVuiFgQYaaKCB5QU2IgLP4DROoQfd6EInOtAOAw000EADywtsQhtO4gSOIx58DEcRu0dwCAYaaKCBBpYXGJrRisPbFrst2FGWgQYaaKCBuydwE1z1+XlhZbgqAAAAAElFTkSuQmCC" rel="icon" type="image/x-icon" />

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/angular.chartjs/latest/angular-chart.css">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  </head>
  <body ng-controller="indexController">
    <section class="container ng-cloak">
      <header class="jumbotron">
        <h1>
          <img src="https://cdn0.iconfinder.com/data/icons/mahjong/128/man8.png" />
          Mahjong Score Calculator
        </h1>
      </header>
<?php /** login page **/ ?>
      <main ng-hide="started">
        <div class="row">
          <div class="col-sm-2">
          </div>
          <div class="col-sm-8">
            <form>
              <!-- number of players -->
              <div class="form-group">
                <label for="numberOfPlayer">Number of players</label>
                <select id="numberOfPlayer" class="form-control" ng-model="numberOfPlayer">
                  <option ng-repeat="n in range(DEFAULT_PLAYER, MAX_PLAYER)"
                          value="{{n}}"
                          ng-selected="n==DEFAULT_PLAYER">
                    {{n}}
                  </option>
                </select>
              </div>
<!-- player name, ng-repeat -->
              <div class="form-group" ng-repeat="i in range(1, numberOfPlayer)">
                <label for="name{{i}}">Player {{i}}'s name</label>
                <input class="form-control" id="name{{i}}" type="text" ng-model="playerNames[i-1]">
              </div>
<!-- advanced settings -->
              <div class="form-group">
                <button class="btn btn-primary"
                        ng-click="advanced_setting_show=advanced_setting_show?false:true">
                  <span ng-hide="advanced_setting_show" class="glyphicon glyphicon-chevron-down"></span>
                  <span ng-show="advanced_setting_show" class="glyphicon glyphicon-chevron-up"></span>
                  Advanced Settings
                </button>
              </div>
<!-- advanced settings -->
              <div class="panel panel-default"
                   ng-show="advanced_setting_show">
                <div class="panel-body"
                     ng-include="'./advancedSetting.html'"></div>
              </div>

<!-- start button -->
              <div class="btn-group">
                <button class="btn btn-default" ng-click="submitAndStart()">Start the game</button>
              </div>
<!-- upload button -->
              <div class="btn-group">
                <label>
                  <div class="btn btn-success">
                    <span class="glyphicon glyphicon-upload"></span> Upload game progress
                  </div>
                  <input type="file" class="hidden" fileread="uploadJson"></input>
                </label>
              </div>
            </form>
          </div>
          <div class="col-sm-2">
          </div>
        </div>
      </main>
<?php /** result page **/?>
      <main ng-if="started">
        <div class="row">
          <div class="col-lg-5">
            <form>
              <div class="form-group">
                <button class="btn btn-primary"
                        ng-click="advanced_setting_show=advanced_setting_show?false:true">
                  <span ng-hide="advanced_setting_show" class="glyphicon glyphicon-chevron-down"></span>
                  <span ng-show="advanced_setting_show" class="glyphicon glyphicon-chevron-up"></span>
                  Advanced Settings
                </button>
              </div>
<!-- advanced setting -->
              <div class="panel panel-default"
                   ng-show="advanced_setting_show">
                <div class="panel-body"
                     ng-include="'./advancedSetting.html'"></div>
              </div>
              {{chungStrategy}}
            </form>
            <form class="form-inline">
              <div class="form-group">
                <a class="btn btn-success" href="{{mjData.toLink()}}" download="mjData.json">
                <span class="glyphicon glyphicon-download"></span>
                Download game progress
                </a>
              </div>
              <div class="form-group">
                <button class="btn btn-primary"
                        type="button"
                        ng-click="cancelLastRound()"
                        ng-show="mjData.rounds.length>1">
                  <span class="glyphicon glyphicon-remove-sign"></span>
                  Cancel last round
                </button>
              </div>
              <div class="form-group">
                <button class="btn btn-primary"
                        type="button"
                        ng-click="resetRound()"
                        ng-show="someoneIsEating()">
                Undo Eat
                </button>
              </div>
            </form>
            <form class="form-inline">
              <div class="form-group">
                <button class="btn btn-default"
                        type="button"
                        ng-click="flush()">
                  <span class="glyphicon glyphicon-tint"></span>
                  Flush game
                </button>
              </div>
            </form>
            <!--
            <div>{{mjData}}</div>
            -->
            <div ng-repeat="player in mjData.players">
              <form class="form-inline">
              <!-- Name -->
                <div class="input-group">
                  <input class="form-control" type="text" ng-model="player.name" tabindex="{{player.id+1}}"></input>
                </div>
                <!-- Eat -->
                <div class="btn-group">
                  <button class="btn btn-default dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                          ng-disabled="isEating(player.id) || numberOfPeopleEating()==3">
                          {{isEating(player.id)?"Eating "+numberOfFarnEating(player.id)+" farn":"Eat"}}
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                    <li ng-repeat="farn in range(MIN_MAX_FARN, MAX_MAX_FARN)"><a href="#" ng-click="eat(player.id, farn)">{{farn}} farn</a></li>
                  </ul>
                </div>
                <!-- selfTouch -->
                <div class="btn-group">
                  <button class="btn btn-default dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                          ng-show="isEating(player.id) && numberOfPeopleEating()==1">
                          Self-touched
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="dropdown-header">
                    Losers:
                    </li>
                    <li ng-repeat="losers in getRestPlayers(player.id, 1)">
                      <a href="#" ng-click="selfTouched(losers)">
                        {{mjData.players[losers[0]].name}}
                      </a>
                    </li>
                    <li ng-repeat="losers in getRestPlayers(player.id, 3)">
                      <a href="#" ng-click="selfTouched(losers)">
                        {{mjData.players[losers[0]].name}},
                        {{mjData.players[losers[1]].name}},
                        {{mjData.players[losers[2]].name}},
                      </a>
                    </li>
                  </ul>
                </div>
                <!-- Lose -->
                <div class="btn-group">
                  <button class="btn btn-default dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                          ng-show="isLosing(player.id)">
                          Lose (out chung)
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="dropdown-header">
                    Other losers:
                    </li>
                    <li ng-repeat="losers in getLoseMenu(player.id)">
                      <a href="#" ng-click="lose([player.id].concat(losers))">
                        {{mjData.players[losers[0]].name}}{{losers.length>1?',':''}}
                        {{mjData.players[losers[1]].name}}
                      </a>
                    </li>
                  </ul>
<!-- TODO: to be added back
                  <button class="btn btn-default"
                          ng-click="lose([player])"
                          ng-show="isLosing(player.id)">
                          Lose
                  </button>
-->
                </div>
              </form>
            </div>
            <form class="form-inline">
              <div class="form-group">
                <button class="btn btn-warning" type="button" ng-click="addPlayer()">
                  <span class="glyphicon glyphicon-plus"></span> Add player
                </button>
              </div>
            </form>
          </div>
          <div class="col-lg-7">
            <canvas id="line" class="chart chart-line" ng-class="chart_type" chart-data="graph.data"
              chart-labels="graph.labels" chart-legend="true" chart-series="graph.series"
              chart-click="onClick" chart-options="{bezierCurve:false, datasetFill:false, datasetStrokeWidth:4}">
            </canvas> 
          </div>
          <div class="col-sm-12">
            <div ng-include="'./summaryTable.html'"></div>
          </div>
        </div>
        <script>
        </script>
      </main>
      <footer>
        
        <div class="text-right"> <em>This project is open source. Available on <a href="https://github.com/ycmjason/mahjongCalculator" target="_blank">github</a>.</div>
        <div class="text-right"> <em>All built from scratch by <a href="//facebook.com/ycm.jason" target="_blank">Jason Yu</a> &copy;.</em></div>
      </footer>
    </section>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.js"></script>
    <script src="//cdn.jsdelivr.net/angular.chartjs/latest/angular-chart.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<?php foreach($js_resources as $js_resource){?>
    <script src="<?=$js_resource?>"></script>
<?php }?>
    <script>
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    </script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-71404316-1', 'auto');
      ga('send', 'pageview');

    </script>
  </body>
</html>
