"use strict";
var DEFAULT_PLAYER = 4;
var MAX_PLAYER = 8;
var MIN_MAX_FARN = 0;
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
      if(MJData.isCorrupted(json)){
        console.error("json is corrupted");
        alert("Uploaded progress is corrupted.");
      }else{
        $scope.mjData = new MJData(json);
        startGame();
      }
    }
  });

  $scope.numberOfPlayer = DEFAULT_PLAYER;
  $scope.playerNames = [];
  $scope.advancedSettings={
    chungStrategy: MJData.DEFAULT_CHUNG_STRATEGY,
    farnScoreStrategy: MJData.DEFAULT_FARN_SCORE_STRATEGY,
    halfSpicyFrom:  MJData.DEFAULT_HALF_SPICY_FROM
  };
  $scope.maxFarn = MJData.DEFAULT_MAX_FARN;
  $scope.mjData = new MJData();

  $scope.submitAndStart = function(){
    // close the advanced setting
    $scope.advanced_setting_show = false;

    // add players
    for(var i=0; i<$scope.numberOfPlayer; i++){
      $scope.mjData.addPlayer($scope.playerNames[i] || '');
    };
    // for initial states (all player with 0 scores)
    resetRound(); saveRound();
    startGame();
  };
  // start listening for change of strategies
  $scope.$watch('advancedSettings.chungStrategy', function(s){
    $scope.mjData.setChungStrategy(s);
  });
  $scope.$watch('advancedSettings.farnScoreStrategy', function(s){
    $scope.mjData.setFarnScoreStrategy(s);
  });
  $scope.$watch('advancedSettings.halfSpicyFrom', function(s){
    $scope.mjData.setHalfSpicyFrom(s=="custom"?$scope.advancedSettings.halfSpicyFromCustom:s);
  });
  $scope.$watch('advancedSettings.halfSpicyFromCustom', function(s){
    if($scope.advancedSettings.halfSpicyFrom=='custom')
      $scope.mjData.setHalfSpicyFrom(s);
  });


  $scope.$watch('started', function(started){
    if(!started){ return; }
    /* confirm before exiting */
    var confirmmsg="Have you save your game? You will lose your game progress unless you save it.";
    window.onbeforeunload = function (e) {
      e = e || window.event;

      // For IE and Firefox prior to version 4
      if (e) {
          e.returnValue = confirmmsg;
      }

      // For Safari
      return confirmmsg;
    };
  });

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
  $scope.getLoseMenu = function(playerId){
    var menu = [];
    var n = 3-$scope.numberOfPeopleEating();
    angular.extend(menu, $scope.getRestPlayers(playerId, n));
    round.getWinners().forEach(function(winner){
      angular.extend(menu, $scope.getRestPlayers(winner, n));
    });
    return menu.filter(function(losers){
      return losers.indexOf(playerId) == -1;
    });
  }
  $scope.getRestPlayers = (function(){
    var memoize = {};
    return function(playerId, n){
      if(memoize.numberOfPlayers != $scope.mjData.players.length){
        memoize = {};
        memoize.numberOfPlayers = $scope.mjData.players.length;
      }
      if(!(playerId in memoize)){
        memoize[playerId] = {};
      }
      if(!(n in memoize[playerId])){
        var playerIds = $scope.mjData.players.map(function(p){return p.id;});
        memoize[playerId][n] = combination(playerIds, n).filter(function(losers){
          return losers.indexOf(playerId)==-1;
        });
      }
      return memoize[playerId][n];
    }
  })();
  $scope.addPlayer = function(){
    $scope.mjData.addPlayer('');
  }
  $scope.someoneIsEating = function(){
    return $scope.numberOfPeopleEating()>0;
  };
  $scope.numberOfPeopleEating = function(){
    return round.wus.length;
  };
  $scope.getEatingPlayers = function(){
    return round.getWinners();
  }
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
    round.isSelfTouched = true;
    $scope.lose(losers);
  };
  $scope.lose = function(losers){
    losers.forEach(function(loser){
      round.addLoser(loser);
    });
    saveRound();
    resetRound();
  };
  $scope.flush = function(){
    saveRound();
    resetRound();
  }

  /* for graph */
  $scope.chart_type="chart-line";
  $scope.$watch('mjData', function(mjData){
    /* graph:
     * series: player
     * labels: round
     * data: score */
    $scope.graph = mjData.getChartData();
  }, true);
});

