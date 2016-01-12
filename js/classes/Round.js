function Round()/* (round, settings) or (settings) */{
  var _round = this;

  /* arguments checking */
  if(arguments[0] && Round.isClean(arguments[0]) &&
     arguments[1] && MJData.isCleanSettings(arguments[1])){
    var round = arguments[0];
    var settings = arguments[1];
    this.losers = round.losers;
    this.isSelfTouched = round.isSelfTouched;
    this.wus = round.wus.map(function(wu){
      return new Round.Wu(wu, settings);
    });
  }else if(arguments[0] && MJData.isCleanSettings(arguments[0])){
    var settings = arguments[0];
    this.wus = [];
    this.losers = [];
    this.isSelfTouched = false;
  }

  this.findWuByWinner = function(playerId){
    return this.wus.filter(function(wu){
      return wu.playerId==playerId;
    })[0];
  }

  this.getScore = function(playerId){
    var Strategy = ChungStrategy.parseStrategy(settings.chungStrategy);
    var chungStrategy = new Strategy(this.isSelfTouched);

    if(this.isWinner(playerId)){
      return chungStrategy.getWinnerScore(this.findWuByWinner(playerId).getWuScore());
    }else if(this.isLoser(playerId)){
      return this.wus.map(function(wu){
          return chungStrategy.getLoserScore(wu.getWuScore(settings),
                                             _round.losers.length,
                                             _round.didOutChung(playerId));
        }).reduce(function(s1, s2){
          return s1+s2;
        });
    }else{
      return 0;
    }
  };

  this.isWinner = function(playerId){
    return this.getWinners().indexOf(playerId)>-1;
  };
  
  this.isLoser = function(playerId){
    return this.losers.indexOf(playerId)>-1;
  };

  this.didOutChung = function(playerId){
    return this.losers.indexOf(playerId)==0;
  }
  
  this.addWu = function(playerId, farn){
    if(!(this.isWinner(playerId)))
      this.wus.push(new Round.Wu(playerId, farn, settings));
  };
  this.getWinners = function(){
    return this.wus.map(function(wu){
      return wu.playerId;
    });
  };
  this.addLoser = function(playerId){
    if(this.wus.length==0)
      console.error("Trying to add loser before adding winner");
    if(this.wus.length>1 && this.losers.length>=1)
      console.error("Trying to add more than one loser while there are more than one winners");
    if(!(this.losers.indexOf(playerId)>-1))
      this.losers.push(playerId);
  };
};
Round.Wu = function()/* (playerId, farn, settings) or (wu, settings)*/{
  /* parameters checkings */
  if(arguments[0] && Round.Wu.isClean(arguments[0]) &&
     arguments[1] && MJData.isCleanSettings(arguments[1])){
    // case: (wu, settings)
    var wu = arguments[0];
    var settings = arguments[1];
    this.playerId = wu.playerId;
    this.farn = wu.farn;
  }else{
    // case: (playerId, farn, settings)
    this.playerId = arguments[0];
    this.farn = arguments[1];
    var settings = arguments[2];
  }

  this.getWuScore = function(){
    var Strategy = FarnScoreStrategy.parseStrategy(settings.farnScoreStrategy);
    var farnScoreStrategy = new Strategy();
    return farnScoreStrategy.getWuScore(settings, this.farn);
  }
};
