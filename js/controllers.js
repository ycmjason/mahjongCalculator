"use strict";
var DEFAULT_PLAYER = 4;
var MAX_PLAYER = 8;
//var BASESCORE = $scope.BASESCORE = 2;
var BASESCORE = 2;
var HALF_SPICE_FROM = 4;
var MIN_MAX_FARN = 1;
var MAX_MAX_FARN = 13;

var range = function(startNumber, endNumber){
  var arr = new Array();
  for(var i=0; i<endNumber - startNumber + 1; ++i){
    arr[i] = startNumber+i;
  }
  return arr;
};

var mjCal = angular.module('mjCal', ['chart.js']);

mjCal.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data):/);
}]);
mjCal.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsText(changeEvent.target.files[0]);
            });
        }
    }
}]);


mjCal.controller('indexController', function ($scope) {
  var startGame = function(){
    $scope.started = true;
    resetRound();
  };

  $scope.DEFAULT_PLAYER = DEFAULT_PLAYER;
  $scope.MAX_PLAYER = MAX_PLAYER;
  $scope.MIN_MAX_FARN = MIN_MAX_FARN;
  $scope.MAX_MAX_FARN = MAX_MAX_FARN;

  $scope.started = false;
  $scope.range = range;
  
  $scope.$watch('uploadJson', function(json){
    if(json){
      json = angular.fromJson(json);
      $scope.mjData = new MJData(json);
      startGame();
    }
  });

  $scope.numberOfPlayer = DEFAULT_PLAYER;
  $scope.playerNames = [];
  $scope.mjData = new MJData();

  $scope.submitAndStart = function(){
    $scope.playerNames.forEach(function(playerName){
      $scope.mjData.addPlayer(new Player(playerName));
    });
    // all start from 0
    resetRound();
    saveRound();
    startGame();
  };


  /* game started */
  var round;
  var saveRound = function(){
    $scope.mjData.addRound(round);
  };
  var resetRound = $scope.resetRound = function(){
    round = $scope.round = new Round();
  };
  $scope.cancelLastRound = function(){
    if($scope.mjData.rounds.length>1)
      $scope.mjData.rounds.pop();
  }
  var generateSelfTouchedMenu = function(){
    $scope.selfTouchedMenu = [];
    $scope.mjData.players.forEach(function(player, i){
      $scope.selfTouchedMenu.push(selfTouchedMenu(i));
    });
  }
  var selfTouchedMenu = function(playerId){
    var restPlayers = angular.copy($scope.mjData.players);
    restPlayers.splice(playerId, 1);

    var options = [];
    for(var i = 0; i < restPlayers.length; i++){
      for(var j = i; j < restPlayers.length; j++){
        for(var k = j; k < restPlayers.length; k++){
          if(i == j ||
             i == k ||
             j == k) continue;
          options.push([restPlayers[i], restPlayers[j], restPlayers[k]]);
        }
      }
    }
    return options;
  };
  $scope.addPlayer = function(){
    $scope.mjData.addPlayer(new Player(""));
  }
  $scope.someoneIsEating = function(){
    return $scope.numberOfPeopleEating()>0;
  };
  $scope.numberOfPeopleEating = function(){
    return round.wus.length;
  };
  $scope.isEating = function(playerId){
    return round.getWinners().indexOf(playerId)>-1;
  };
  $scope.numberOfFarnEating = function(playerId){
    if(!$scope.isEating(playerId)) return -1;
    return round.wus.filter(function(wu){
      return wu.playerId==playerId;
    })[0].farn;
  };
  $scope.isLosing = function(playerId){
    return $scope.someoneIsEating() && !$scope.isEating(playerId);
  };
  $scope.eat = function(playerId, numberOfFarn){
    round.addWu(playerId, numberOfFarn);
  };
  $scope.selfTouched = function(losers){
    losers.forEach(function(loser){
      round.addLoser(loser.id);
    });
    saveRound();
    resetRound();
  };
  $scope.lose = function(loserId){
    round.addLoser(loserId);
    saveRound();
    resetRound();
  };

  /* for graph */
  $scope.chart_type="chart-line";
  $scope.$watch('mjData', function(mjData){
    generateSelfTouchedMenu();
    /* graph:
     * series: player
     * labels: round
     * data: score */
    if(mjData instanceof MJData){
      $scope.graph = mjData.getChartData();
    }
  }, true);
  $scope.downloadMJData = function(){
    
  };

  /* confirm before exiting */
  $scope.$watch('started', function(started){
    if(!started){ return; }
    var confirmmsg="Have you save your game? You will lose your game progress unless you save it.";
    window.onbeforeunload = function (e) {
      console.log(e);
      e = e || window.event;

      // For IE and Firefox prior to version 4
      if (e) {
          e.returnValue = confirmmsg;
      }

      // For Safari
      return confirmmsg;
    };
  });
  
});
