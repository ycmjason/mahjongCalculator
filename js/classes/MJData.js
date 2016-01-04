function MJData(json){
  var Player = function(id, name){
    this.id = id;
    this.name = name;
  };
  this.settings = {
    chungStrategy: MJData.DEFAULT_CHUNG_STRATEGY,
    farnScoreStrategy: MJData.DEFAULT_FARN_SCORE_STRATEGY,
    halfSpicyFrom: MJData.DEFAULT_HALF_SPICY_FROM
  };
  // Set static strategy setting
  this.players = [];
  this.rounds = [];
  if(!MJData.isCorrupted(json)){
    this.settings = json.settings;
    MJData.ChungStrategy = json.settings.chungStrategy;
    MJData.FarnScoreStrategy = json.settings.farnScoreStrategy;
    MJData.halfSpicyFrom = json.settings.halfSpicyFrom;
    this.players = json.players;
    this.rounds = json.rounds.map(function(round){
      return new Round(round);
    });
  }
  var resetRoundsWithNewSettings = function(rounds){
    rounds.map(function(round){
      return new Round(round);
    });
  }
  this.setMaxFarn = function(farn){
    this.settings.maxFarn = MJData.maxfarn = farn;
    resetRoundsWithNewSettings(this.rounds);
  }
  this.setHalfSpicyFrom = function(from){
    this.settings.halfSpicyFrom = MJData.halfSpicyFrom = from;
  }
  this.setChungStrategy = function(strategyName){
    if(ChungStrategy.isValidName(strategyName)){
      this.settings.chungStrategy = MJData.ChungStrategy = strategyName;
      resetRoundsWithNewSettings(this.rounds);
    }
  }
  this.setFarnScoreStrategy = function(strategyName){
    if(FarnScoreStrategy.isValidName(strategyName)){
      this.settings.farnScoreStrategy = MJData.FarnScoreStrategy = strategyName;
      resetRoundsWithNewSettings(this.rounds);
    }
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
  return data==undefined
      || data.settings == undefined
      || data.settings.chungStrategy == undefined
      || !ChungStrategy.isValidName(data.settings.chungStrategy)
      || data.settings.farnScoreStrategy == undefined
      || !FarnScoreStrategy.isValidName(data.settings.farnScoreStrategy)
      || data.settings.halfSpicyFrom == undefined
      || data.players==undefined
      || data.players.length<4
      || data.rounds==undefined
      || data.rounds.map(function(round){
           return Round.isCorrupted(round)
         }).reduce(function(a, b){
           return a || b;
         });
};
MJData.DEFAULT_CHUNG_STRATEGY = MJData.ChungStrategy = "FullChungStrategy";
MJData.DEFAULT_FARN_SCORE_STRATEGY = MJData.FullChungStrategy = "_25ChickenStrategy";
MJData.DEFAULT_HALF_SPICY_FROM = MJData.halfSpicyFrom = 4;
MJData.DEFAULT_MAX_FARN = MJData.maxFarn = 13;
