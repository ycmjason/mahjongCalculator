"use strict";
var DEFAULT_PLAYER = 4;
var MAX_PLAYER = 8;
var MIN_MAX_FARN = 0;
var MAX_MAX_FARN = 13;

mjCal.controller('indexController', function ($scope, socket) {
  var startGame = function(isNewGame){
    if(isNewGame){
      socket.emit('new game', mjData);
    }
    socket.on('update game code', function(c){
      setCode(c);
    });
    socket.on('update mjdata', function(json){
      setMjData(json);
    });
    $scope.$watch('mjData', function(mjData, oldmjData){
      if($scope.code=='') return;
      if(!angular.equals(mjData, oldmjData)){
        socket.emit('update game', {
          code: $scope.code,
          mjData: mjData
        });
      }
    }, true);
    $scope.started = true;
    resetRound();
  };
  var mjData;
  var setMjData = function(json){
    mjData = $scope.mjData = json;
    $scope.advancedSettings.chungStrategy = json.settings.chungStrategy;
    $scope.advancedSettings.farnScoreStrategy = json.settings.farnScoreStrategy;
    if(json.settings.halfSpicyFrom==4 || json.settings.halfSpicyFrom==10000){
      $scope.advancedSettings.halfSpicyFrom = json.settings.halfSpicyFrom;
    }else{
      $scope.advancedSettings.halfSpicyFrom = 'custom';
      $scope.advancedSettings.halfSpicyFromCustom = json.settings.halfSpicyFrom;
    }
  };
  var code;
  $scope.$watch('code', function(c){
    $scope.codeErrorMsg='';
    setCode(c.toLowerCase());
  });
  var setCode = function(c){
    code = $scope.code = c;
  };

  $scope.DEFAULT_PLAYER = DEFAULT_PLAYER;
  $scope.MAX_PLAYER = MAX_PLAYER;
  $scope.MIN_MAX_FARN = MIN_MAX_FARN;
  $scope.MAX_MAX_FARN = MAX_MAX_FARN;

  $scope.started = false;
  $scope.range = range;
  // join existing game
  $scope.code='';
  $scope.joinGame = function(){
    if($scope.code.length == 4) socket.emit('join game', $scope.code);
  }
  socket.on('[fail] join game', function(msg){
    $scope.codeErrorMsg = msg;
  });
  socket.on('update mjData', function(mjData){
    if(MJData.isClean(mjData)){
      setMjData(new MJData(mjData));
      if(!$scope.started){
        startGame(false);
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
  setMjData(new MJData());

  $scope.$watch('uploadJson', function(json){
    if(json){
      json = angular.fromJson(json);
      if(MJData.isClean(json)){
        setMjData(new MJData(json));
        startGame(true);
      }else{
        console.error("json is corrupted");
        alert("Uploaded progress is corrupted.");
      }
    }
  });


  $scope.submitAndStart = function(){
    // close the advanced setting
    $scope.advanced_setting_show = false;

    // add players
    for(var i=0; i<$scope.numberOfPlayer; i++){
      mjData.addPlayer($scope.playerNames[i] || '');
    };
    // for initial states (all player with 0 scores)
    resetRound(); saveRound();
    startGame(true);
  };
  // start listening for change of strategies
  $scope.$watch('advancedSettings.chungStrategy', function(s){
    mjData.setChungStrategy(s);
  });
  $scope.$watch('advancedSettings.farnScoreStrategy', function(s){
    mjData.setFarnScoreStrategy(s);
  });
  $scope.$watch('advancedSettings.halfSpicyFrom', function(s){
    mjData.setHalfSpicyFrom(s=="custom"?$scope.advancedSettings.halfSpicyFromCustom:s);
  });
  $scope.$watch('advancedSettings.halfSpicyFromCustom', function(s){
    if($scope.advancedSettings.halfSpicyFrom=='custom')
      mjData.setHalfSpicyFrom(s);
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
    mjData.addRound(round);
  };
  var resetRound = $scope.resetRound = function(){
    round = $scope.round = new Round(mjData.settings);
  };
  $scope.cancelLastRound = function(){
    if(mjData.rounds.length>1)
      mjData.rounds.pop();
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
      if(memoize.numberOfPlayers != mjData.players.length){
        memoize = {};
        memoize.numberOfPlayers = mjData.players.length;
      }
      if(!(playerId in memoize)){
        memoize[playerId] = {};
      }
      if(!(n in memoize[playerId])){
        var playerIds = mjData.players.map(function(p){return p.id;});
        memoize[playerId][n] = combination(playerIds, n).filter(function(losers){
          return losers.indexOf(playerId)==-1;
        });
      }
      return memoize[playerId][n];
    }
  })();
  $scope.addPlayer = function(){
    mjData.addPlayer('');
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

