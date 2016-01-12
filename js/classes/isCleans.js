function isCleanFactory(){
  var valueOf = function(obj, fieldPath){
    var firstPart = fieldPath.split('.')[0];
    var restPath = fieldPath.substring(firstPart.length+1);
    return fieldPath.length==0? obj: valueOf(obj[firstPart], restPath);
  }
  var args = arguments;
  return function(json){
    if(json == undefined) return false;

    var isDefined = function(value){
      return value != undefined;
    };
    var isString = function(s){
      return typeof s == 'string' || s instanceof String;
    };

    for(var i=0; i<args.length; i++){
      var path = isString(args[i])? args[i]: args[i][0];
      var method = isString(args[i])? isDefined: args[i][1];
      if(!method(valueOf(json, path))){
        console.log(path+" is either not defiend or does not pass test as stated.");
        return false;
        break;
      }
    }
    return true;
  };
}
function isAllCleanFactory(isClean){
  return function(objects){
    return objects.map(isClean).reduce(function(a, b){
      return a && b;
    }, true);
  };
}

MJData.isCleanSettings = isCleanFactory('chungStrategy',
                                        'farnScoreStrategy',
                                        'halfSpicyFrom',
                                        ['chungStrategy', ChungStrategy.isValidName],
                                        ['farnScoreStrategy',
                                          FarnScoreStrategy.isValidName]);

Round.Wu.isClean = isCleanFactory('playerId', 'farn');

Round.isClean = isCleanFactory('wus', 'losers', 'isSelfTouched',
                              ['wus', isAllCleanFactory(Round.Wu.isClean)]);

MJData.isClean = isCleanFactory('settings',
                                'players',
                                'rounds',
                                ['settings', MJData.isCleanSettings],
                                ['players', function(players){
                                  return players.length >= 4;
                                }],
                                ['rounds', isAllCleanFactory(Round.isClean)]);
