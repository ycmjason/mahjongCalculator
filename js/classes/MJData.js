var notRightInstanceMSG = function(className){
  return "Given player is not an instance of "+className+".";
}

var MJData = function(json){
  var _this = this;
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
  this.getPlayerScoreAtRound = function(playerId, roundId){
    var round = rounds[roundId];
    return round.get
  };
  this.getPlayerNames = function(){
    return _this.players.map(function(p){return p.name});
  };
  this.getPlayerScore = function(playerId){
    return _this.rounds.map(function(round){
      return round.getScore(playerId);
    }).reduce(function(a, b){
      return a+b;
    });
  }
  this.getPlayerScores = function(){
    return _this.players.map(function(player){
      var accScore = 0;
      return _this.rounds.map(function(round){
        accScore += round.getScore(player.id);
        return accScore;
      });
    });
  };
  this.toLink = function(){
    return "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_this));
  }
};
MJData.isCorrupted = function(data){
  return !(data!=undefined && data.players!=undefined && data.players.length>=4 &&
    data.rounds!=undefined && data.rounds.length>0);
}
