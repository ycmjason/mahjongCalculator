"use strict";
var mjCal = angular.module('mjCal', ['chart.js']);

var range = function(startNumber, endNumber){
  var arr = new Array();
  for(var i=0; i<endNumber - startNumber + 1; ++i){
    arr[i] = startNumber+i;
  }
  return arr;
};

var notRightInstanceMSG = function(className){
  return "Given player is not an instance of "+className+".";
}

var MJData = function(baseScore, halfSpiceFrom){
  var _this = this;
  this.baseScore = baseScore;
  this.halfSpiceFrom = halfSpiceFrom;
  this.players = [];
  this.rounds = [];
  this.addPlayer = function(player){
    if(!(player instanceof Player))
      console.error(notRightInstanceMSG("Player"));
    player.id = this.players.length;
    _this.players.push(player);
  };
  this.addRound = function(round){
    if(!(round instanceof Round))
      console.error(notRightInstanceMSG("Round"));
    _this.rounds.push(round);
  };
  this.getPlayerNames = function(){
    return _this.players.map(function(p){return p.name});
  };
  this.getPlayerScores = function(){
    var baseScore = _this.baseScore;
    var halfSpiceFrom = _this.halfSpiceFrom;
    return _this.players.map(function(player){
      var accScore = 0;
      return _this.rounds.map(function(round){
        round.wus.forEach(function(wu){
          var wuScore = wu.getWuScore(baseScore, halfSpiceFrom);
          /* winner */
          if(wu.playerId==player.id){
            accScore += wuScore;
          }
          /* loser */
          if(round.isLoser(player.id))
            accScore -= Math.floor(wuScore/round.losers.length);
        });
        return accScore;
      });
    });
  };
};

var Player = function(name){
  this.name = name;
};

var Round = function(){
  var _this=this;
  this.wus = [];
  this.losers = [];

  var Wu = function(playerId, farn){
    var __this = this;
    this.playerId = playerId;
    this.farn = farn;
    this.getWuScore = function(baseScore, halfSpiceFrom){
      return getWuScoreHelper(baseScore, halfSpiceFrom, __this.farn);
    }
    var getWuScoreHelper = function(baseScore, halfSpiceFrom, farn){
      var wuScore = Math.pow(baseScore, farn);
      if(farn>halfSpiceFrom){
        if(farn%2==0){ //even
          wuScore = Math.pow(baseScore, (farn+halfSpiceFrom)/2);
        }else{
          wuScore = (getWuScoreHelper(baseScore, halfSpiceFrom, farn-1)  +
                     getWuScoreHelper(baseScore, halfSpiceFrom, farn+1)) / 2;
        }
      }
      if(_this.isSelfTouched())
        wuScore = Math.floor((3*wuScore)/2);
      return wuScore;
    }
  }

  this.isWinner = function(playerId){
    return _this.getWinners().indexOf(playerId)>-1;
  }
  
  this.isLoser = function(playerId){
    return _this.losers.indexOf(playerId)>-1;
  }
  
  this.isSelfTouched = function(){
    return _this.wus.length==1 && _this.losers.length>1;
  }
  
  this.addWu = function(playerId, farn){
    if(!(_this.isWinner(playerId)))
      _this.wus.push(new Wu(playerId, farn));
  }
  this.getWinners = function(){
    return _this.wus.map(function(wu){
      return wu.playerId;
    });
  }
  this.addLoser = function(playerId){
    if(_this.wus.length==0)
      console.error("Trying to add loser before adding winner");
    if(_this.wus.length>1 && _this.losers.length>=1)
      console.error("Trying to add more than one loser while there are more than one winners");
    if(!(_this.losers.indexOf(playerId)>-1))
      _this.losers.push(playerId);
  }
}

mjCal.controller('indexController', function ($scope) {
  var DEFAULT_PLAYER = $scope.DEFAULT_PLAYER = 4;
  var MAX_PLAYER = $scope.MAX_PLAYER = 8;
  //var DEFAULT_BASE_SCORE = $scope.DEFAULT_BASE_SCORE = 2;
  var DEFAULT_BASE_SCORE = 2;
  var DEFAULT_HALF_SPICE_FROM = 4;
  var MAX_BASE_SCORE = $scope.MAX_BASE_SCORE = 10;
  var MIN_MAX_FARN = $scope.MIN_MAX_FARN = 1;
  var MAX_MAX_FARN = $scope.MAX_MAX_FARN = 15;

  $scope.range = range;

  $scope.numberOfPlayer = DEFAULT_PLAYER;
  //$scope.baseScore = DEFAULT_BASE_SCORE;
  $scope.playerNames = [];

  $scope.started = false;
  $scope.startGame = function(){
    $scope.started = true;
    //$scope.mjData = new MJData($scope.baseScore);
    $scope.mjData = new MJData(DEFAULT_BASE_SCORE, DEFAULT_HALF_SPICE_FROM);
    generateSelfTouchedMenu();
    $scope.playerNames.forEach(function(playerName, i){
      $scope.selfTouchedMenu.push(selfTouchedMenu(i));
    });
    // all start from 0
    resetRound();
    saveRound();
    // reset round
    resetRound();
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
    $scope.playerNames.forEach(function(playerName){
      $scope.mjData.addPlayer(playerName);
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
    $scope.mjData.addPlayer("");
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
    /* graph:
     * series: player
     * labels: round
     * data: score */
    if(mjData instanceof MJData){
      $scope.graph = {};
      $scope.graph.series = mjData.getPlayerNames();
      $scope.graph.labels = range(0, mjData.rounds.length-1).map(function(i){
        if(i==0) return "initial";
        return "round "+i;
      });
      $scope.graph.data = mjData.getPlayerScores();
    }
  }, true);
  
});
