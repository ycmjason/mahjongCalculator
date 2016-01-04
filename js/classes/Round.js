function Round(json){
  var Wu = function(playerId, farn){
    this.playerId = playerId;
    this.farn = farn;
    var Strategy = FarnScoreStrategy.parseStrategy(MJData.FarnScoreStrategy);
    var strategy = new Strategy();
    this.getWuScore = function(){
      return strategy.getWuScore(this.farn);
    }
  };

  var _round = this;
  this.wus = [];
  this.losers = [];
  this.isSelfTouched = false;

  if(!Round.isCorrupted(json)){
    this.wus = json.wus.map(function(wu){
      return new Wu(wu.playerId, wu.farn);
    });
    this.losers = json.losers;
    this.isSelfTouched = json.isSelfTouched;
  }
  this.findWuByWinner = function(playerId){
    return this.wus.filter(function(wu){
      return wu.playerId==playerId;
    })[0];
  }

  this.getScore = function(playerId){
    var Strategy = ChungStrategy.parseStrategy(MJData.ChungStrategy);
    var strategy = new Strategy(this.isSelfTouched);
    if(this.isWinner(playerId)){
      return strategy.getWinnerScore(this.findWuByWinner(playerId).getWuScore());
    }else if(this.isLoser(playerId)){
      return this.wus.map(function(wu){
        return strategy.getLoserScore(wu.getWuScore(), _round.losers.length, _round.didOutChung(playerId));
      }).reduce(function(s1, s2){
        return s1+s2;
      });
    }
    return 0;
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
      this.wus.push(new Wu(playerId, farn));
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

Round.isCorrupted = function(data){
  return data==undefined || data.wus==undefined || data.losers==undefined || data.isSelfTouched==undefined;
};
