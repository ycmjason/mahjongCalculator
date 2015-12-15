var Round = function(){
  var _round = this;
  this.wus = [];
  this.losers = [];

  var Wu = function(playerId, farn){
    this.playerId = playerId;
    this.farn = farn;
    this.getWuScore = function(){
      var wuScore = getWuScoreHelper(this.farn);
      if(_round.isSelfTouched()){
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
    if(this.isWinner(playerId)){
      score = this.wus.filter(function(wu){
        return wu.playerId==playerId;
      })[0].getWuScore();
    }else if(this.isLoser(playerId)){
      score = -((this.wus.map(function(wu){
        return wu.getWuScore();
      }).reduce(function(s1, s2){
        return s1+s2;
      }))/this.losers.length);
    }
    return score;
  };

  this.isWinner = function(playerId){
    return this.getWinners().indexOf(playerId)>-1;
  }
  
  this.isLoser = function(playerId){
    return this.losers.indexOf(playerId)>-1;
  }
  
  this.isSelfTouched = function(){
    return this.wus.length==1 && this.losers.length>1;
  }
  
  this.addWu = function(playerId, farn){
    if(!(this.isWinner(playerId)))
      this.wus.push(new Wu(playerId, farn));
  }
  this.getWinners = function(){
    return this.wus.map(function(wu){
      return wu.playerId;
    });
  }
  this.addLoser = function(playerId){
    if(this.wus.length==0)
      console.error("Trying to add loser before adding winner");
    if(this.wus.length>1 && this.losers.length>=1)
      console.error("Trying to add more than one loser while there are more than one winners");
    if(!(this.losers.indexOf(playerId)>-1))
      this.losers.push(playerId);
  }
}
