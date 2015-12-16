var MJData = function(json){
  var Player = function(id, name){
    this.id = id;
    this.name = name;
  };
  this.players = [];
  this.rounds = [];
  if(!MJData.isCorrupted(json)){
    this.players = json.players;
    this.rounds = json.rounds.map(function(round){
      return new Round(round);
    });
  }
  this.addPlayer = function(name){
    var player = new Player(this.players.length, name);
    this.players.push(player);
    return player;
  };
  this.addRound = function(round){
    this.rounds.push(round);
  };
  this.getPlayerFinalScore = function(playerId){
    return this.rounds.map(function(round){
      return round.getScore(playerId);
    }).reduce(function(a, b){
      return a+b;
    });
  };
  this.getChartData = function(){
    var ret = {};
    ret.labels = range(0, this.rounds.length-1).map(function(i){
      if(i==0) return "initial";
      return "round "+i;
    });
    ret.series = this.players.map(function(p){return p.name});
    ret.data = (function(_this){
      return _this.players.map(function(player){
        var accScore = 0;
        return _this.rounds.map(function(round){
          accScore += round.getScore(player.id);
          return accScore;
        });
      });
    })(this);
    return ret;
  };
  this.toLink = function(){
    return "data: text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this));
  };
};
MJData.isCorrupted = function(data){
  return !(data!=undefined && data.players!=undefined && data.players.length>=4 &&
    data.rounds!=undefined && data.rounds.length>0);
};
