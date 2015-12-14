var Round = function(){
  var _this=this;
  this.wus = [];
  this.losers = [];

  var Wu = function(playerId, farn){
    var __this = this;
    this.playerId = playerId;
    this.farn = farn;
    this.getWuScore = function(){
      var wuScore = getWuScoreHelper(__this.farn);
      if(_this.isSelfTouched()){
        wuScore = Math.floor(3*wuScore/2);
      }
      return wuScore;
    }
    var getWuScoreHelper = function(farn){
      var wuScore = Math.pow(BASESCORE, farn);
      if(farn>HALF_SPICE_FROM){
        if(farn%2==0){ //even
          wuScore = Math.pow(BASESCORE, (farn+HALF_SPICE_FROM)/2);
        }else{
          wuScore = (getWuScoreHelper(farn-1)  +
                     getWuScoreHelper(farn+1)) / 2;
        }
      }
      return wuScore;
    }
  }

  this.getScore = function(playerId){
    var score = 0;
    if(_this.isWinner(playerId)){
      score = _this.wus.filter(function(wu){
        return wu.playerId==playerId;
      })[0].getWuScore();
    }else if(_this.isLoser(playerId)){
      score = -((_this.wus.map(function(wu){
        return wu.getWuScore();
      }).reduce(function(s1, s2){
        return s1+s2;
      }))/_this.losers.length);
    }
    return score;
  };

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
