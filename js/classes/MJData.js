function MJData(json){
  var Player = function(id, name){
    this.id = id;
    this.name = name;
  };
  if(json && MJData.isClean(json)){
    this.settings = json.settings;
    this.players = json.players;
    this.rounds = json.rounds.map(function(round){
      return new Round(round, json.settings);
    });
  }else{
    this.settings = {
      chungStrategy: MJData.DEFAULT_CHUNG_STRATEGY,
      farnScoreStrategy: MJData.DEFAULT_FARN_SCORE_STRATEGY,
      halfSpicyFrom: MJData.DEFAULT_HALF_SPICY_FROM
    };
    this.players = [];
    this.rounds = [];
  }

  this.setHalfSpicyFrom = function(from){
    this.settings.halfSpicyFrom = from;
  }
  this.setChungStrategy = function(strategyName){
    if(ChungStrategy.isValidName(strategyName))
      this.settings.chungStrategy = strategyName;
  }
  this.setFarnScoreStrategy = function(strategyName){
    if(FarnScoreStrategy.isValidName(strategyName))
      this.settings.farnScoreStrategy = strategyName;
  }

  this.addPlayer = function(name){
    name = name.trim();
    var player = new Player(this.players.length, name || 'Player '+(this.players.length+1));
    this.players.push(player);
    return player;
  };
  this.addRound = function(round){
    this.rounds.push(round);
  };
  this.getPlayerFinalScore = (function(_this){
    return function(playerId){
      return _this.rounds.map(function(round){
          return round.getScore(playerId);
        }).reduce(function(a, b){
          return a+b;
        });
    }
  })(this);
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
MJData.DEFAULT_CHUNG_STRATEGY = "FullChungStrategy";
MJData.DEFAULT_FARN_SCORE_STRATEGY = "_25ChickenStrategy";
MJData.DEFAULT_HALF_SPICY_FROM = 4;
